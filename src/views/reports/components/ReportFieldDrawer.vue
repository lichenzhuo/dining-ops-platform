<script setup>
import { computed, ref, watch } from 'vue'
import { REPORT_COLUMN_DEFS } from '@/constants/reports'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  reportId: {
    type: String,
    required: true,
  },
  visibleColumnKeys: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const draftKeys = ref([])

const columnDefs = computed(() => REPORT_COLUMN_DEFS[props.reportId] ?? [])

watch(
  () => [props.modelValue, props.visibleColumnKeys, props.reportId],
  () => {
    if (props.modelValue) {
      draftKeys.value = [...props.visibleColumnKeys]
    }
  },
  { immediate: true },
)

function toggleColumn(key) {
  if (draftKeys.value.includes(key)) {
    draftKeys.value = draftKeys.value.filter((item) => item !== key)
    return
  }
  draftKeys.value = [...draftKeys.value, key]
}

function handleSave() {
  emit('save', [...draftKeys.value])
  emit('update:modelValue', false)
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    title="字段配置"
    size="360px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="field-drawer__hint">勾选需要在明细表中展示的字段，配置会按报表类型分别保存。</p>
    <el-checkbox-group v-model="draftKeys" class="field-drawer__list">
      <el-checkbox
        v-for="col in columnDefs"
        :key="col.key"
        :value="col.key"
        :disabled="col.fixed"
      >
        {{ col.label }}
        <span v-if="col.group" class="field-drawer__group">（{{ col.group }}）</span>
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave">应用</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.field-drawer__hint {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.6;
  color: $text-secondary;
}

.field-drawer__list {
  display: grid;
  gap: 12px;
}

.field-drawer__group {
  color: $text-tertiary;
}
</style>
