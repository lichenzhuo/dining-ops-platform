<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { PERMISSIONS } from '@/constants/permissions'
import { useDataImportStore } from '@/stores/dataImport'
import { useExportQueueStore } from '@/stores/exportQueue'
import ExportQueuePanel from './components/ExportQueuePanel.vue'
import ImportErrorTable from './components/ImportErrorTable.vue'
import ImportPreviewTable from './components/ImportPreviewTable.vue'
import ImportTypePanel from './components/ImportTypePanel.vue'
import ImportUploadPanel from './components/ImportUploadPanel.vue'

const route = useRoute()
const dataImportStore = useDataImportStore()
const exportQueueStore = useExportQueueStore()

const activeTab = ref(route.query.tab === 'export' ? 'export' : 'import')

const {
  importType,
  step,
  parsing,
  importing,
  fileName,
  validRows,
  errorRows,
  importResult,
  error,
  useWorker,
} = storeToRefs(dataImportStore)

const { tasks, pendingCount } = storeToRefs(exportQueueStore)

const importStepIndex = computed(() => {
  if (step.value === 'upload') return 0
  if (step.value === 'preview') return 1
  return 2
})

function handleDownloadTemplate() {
  dataImportStore.downloadTemplate()
  ElMessage.success('模板已下载')
}

async function handleFileSelected(file) {
  await dataImportStore.parseFile(file)
  if (step.value === 'preview') {
    ElMessage.success(`解析完成：有效 ${validRows.value.length} 条，错误 ${errorRows.value.length} 条`)
  }
}

async function handleConfirmImport() {
  const result = await dataImportStore.confirmImport()
  if (result) {
    ElMessage.success(result.message)
  }
}

function handleResetImport() {
  dataImportStore.resetUpload()
}

function handleDownloadTask(task) {
  exportQueueStore.downloadTaskFile(task)
  ElMessage.success('已开始下载导出文件')
}

function handleQuickExport() {
  exportQueueStore.quickExportSample()
  ElMessage.success('小数据量 Excel 已导出')
}
</script>

<template>
  <div class="data-import-page">
    <header class="data-import-page__header">
      <div>
        <h2>数据导入导出</h2>
        <p>模板下载 · Excel 上传解析 · 字段校验 · 错误行提示 · 异步导出任务队列</p>
      </div>
    </header>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="数据导入" name="import">
        <el-steps :active="importStepIndex" align-center finish-status="success" class="data-import-page__steps">
          <el-step title="下载模板 / 上传" />
          <el-step title="校验预览" />
          <el-step title="确认导入" />
        </el-steps>

        <section class="data-import-page__import-layout">
          <ImportTypePanel
            :import-type="importType"
            v-model:use-worker="useWorker"
            @select-type="dataImportStore.setImportType"
            @download="handleDownloadTemplate"
          />
          <ImportUploadPanel
            :parsing="parsing"
            :file-name="fileName"
            :error="error"
            @file-selected="handleFileSelected"
          />
        </section>

        <section v-if="step === 'preview'" class="data-import-page__preview">
          <ImportPreviewTable :import-type="importType" :valid-rows="validRows" />
          <ImportErrorTable :error-rows="errorRows" />

          <div class="data-import-page__confirm">
            <el-button @click="handleResetImport">重新上传</el-button>
            <el-button
              type="primary"
              :loading="importing"
              :disabled="!validRows.length"
              v-permission="PERMISSIONS.DATA_IMPORT"
              @click="handleConfirmImport"
            >
              确认导入 {{ validRows.length }} 条有效数据
            </el-button>
          </div>
        </section>

        <el-result
          v-if="step === 'done' && importResult"
          icon="success"
          :title="importResult.message"
          :sub-title="`导入 ID：${importResult.importId} · 跳过错误行 ${importResult.skippedCount} 条`"
        >
          <template #extra>
            <el-button type="primary" @click="handleResetImport">继续导入</el-button>
          </template>
        </el-result>
      </el-tab-pane>

      <el-tab-pane label="导出中心" name="export">
        <ExportQueuePanel
          :tasks="tasks"
          :pending-count="pendingCount"
          :get-status-label="exportQueueStore.getStatusLabel"
          @download="handleDownloadTask"
          @remove="exportQueueStore.removeTask"
          @clear-done="exportQueueStore.clearDoneTasks"
          @quick-export="handleQuickExport"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.data-import-page {
  display: grid;
  gap: 16px;

  &__header {
    h2 {
      margin: 0;
      font-size: 22px;
      color: $text-primary;
    }

    p {
      margin: 6px 0 0;
      font-size: 13px;
      color: $text-tertiary;
    }
  }

  &__steps {
    margin-bottom: 16px;
  }

  &__import-layout {
    display: grid;
    grid-template-columns: 320px minmax(0, 1fr);
    gap: 16px;
  }

  &__preview {
    display: grid;
    gap: 16px;
    margin-top: 16px;
  }

  &__confirm {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
}

@media (max-width: 1200px) {
  .data-import-page__import-layout {
    grid-template-columns: 1fr;
  }
}
</style>
