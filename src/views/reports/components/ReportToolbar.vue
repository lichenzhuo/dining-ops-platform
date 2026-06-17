<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getReportTitle } from '@/constants/reports'
import { PERMISSIONS } from '@/constants/permissions'

const props = defineProps({
  reportId: {
    type: String,
    required: true,
  },
  savedViews: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['open-fields', 'apply-view', 'save-view', 'remove-view'])

const saveDialogVisible = ref(false)
const viewName = ref('')

function openSaveDialog() {
  viewName.value = `${getReportTitle(props.reportId)}视图`
  saveDialogVisible.value = true
}

function confirmSaveView() {
  const name = viewName.value.trim()
  if (!name) {
    ElMessage.warning('请输入视图名称')
    return
  }
  emit('save-view', name)
  saveDialogVisible.value = false
  ElMessage.success('常用视图已保存')
}

async function handleRemoveView(view) {
  await ElMessageBox.confirm(`确定删除视图「${view.name}」吗？`, '删除视图', {
    type: 'warning',
  })
  emit('remove-view', view.id)
  ElMessage.success('视图已删除')
}
</script>

<template>
  <header class="report-toolbar">
    <div>
      <h2>{{ getReportTitle(reportId) }}</h2>
      <p>原生报表中心 · 筛选、字段、下钻与导出统一在系统内完成</p>
    </div>

    <div class="report-toolbar__actions">
      <el-dropdown v-if="savedViews.length" trigger="click" @command="emit('apply-view', $event)">
        <el-button>
          常用视图
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="view in savedViews" :key="view.id" :command="view.id">
              {{ view.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button @click="openSaveDialog">保存视图</el-button>
      <el-button v-permission="PERMISSIONS.REPORT_FIELD_CONFIG" @click="emit('open-fields')">
        字段配置
      </el-button>

      <el-popover v-if="savedViews.length" placement="bottom-end" width="280" trigger="click">
        <template #reference>
          <el-button link type="primary">管理视图</el-button>
        </template>
        <ul class="report-toolbar__views">
          <li v-for="view in savedViews" :key="view.id">
            <span>{{ view.name }}</span>
            <el-button link type="danger" @click="handleRemoveView(view)">删除</el-button>
          </li>
        </ul>
      </el-popover>
    </div>
  </header>

  <el-dialog v-model="saveDialogVisible" title="保存常用视图" width="420px">
    <el-input v-model="viewName" placeholder="例如：华东区门店周报" maxlength="30" show-word-limit />
    <template #footer>
      <el-button @click="saveDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmSaveView">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.report-toolbar {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin: 6px 0 0;
    font-size: 13px;
    color: $text-tertiary;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
  }

  &__views {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
    }
  }
}
</style>
