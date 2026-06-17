<script setup>
import { IMPORT_FILE_LIMIT } from '@/constants/dataImport'

defineProps({
  parsing: {
    type: Boolean,
    default: false,
  },
  fileName: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['file-selected'])

function beforeUpload(file) {
  emit('file-selected', file)
  return false
}
</script>

<template>
  <section class="panel-card upload-panel">
    <h3>上传 Excel</h3>
    <p class="upload-panel__desc">
      支持 {{ IMPORT_FILE_LIMIT.accept }}，大小不超过 {{ IMPORT_FILE_LIMIT.maxSizeMB }}MB
    </p>

    <el-upload
      drag
      :accept="IMPORT_FILE_LIMIT.accept"
      :show-file-list="false"
      :disabled="parsing"
      :before-upload="beforeUpload"
    >
      <el-icon class="upload-panel__icon"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        拖拽文件到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div v-if="fileName" class="upload-panel__file">已选择：{{ fileName }}</div>
      </template>
    </el-upload>

    <el-alert v-if="error" type="error" :title="error" show-icon :closable="false" class="upload-panel__error" />
    <div v-if="parsing" class="upload-panel__loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在解析 Excel…</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.upload-panel {
  h3 {
    margin: 0 0 8px;
    font-size: 15px;
  }

  &__desc {
    margin: 0 0 12px;
    font-size: 12px;
    color: $text-tertiary;
  }

  &__icon {
    font-size: 42px;
    color: $color-brand;
  }

  &__file {
    margin-top: 8px;
    font-size: 12px;
    color: $text-secondary;
  }

  &__error {
    margin-top: 12px;
  }

  &__loading {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 12px;
    font-size: 13px;
    color: $text-secondary;
  }
}
</style>
