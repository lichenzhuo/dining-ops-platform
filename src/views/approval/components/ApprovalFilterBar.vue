<script setup>
import { APPROVAL_TYPE_LABELS } from '@/constants/approval'

const filters = defineModel({ type: Object, required: true })

const emit = defineEmits(['search'])

const typeOptions = [
  { value: 'all', label: '全部类型' },
  ...Object.entries(APPROVAL_TYPE_LABELS).map(([value, label]) => ({ value, label })),
]
</script>

<template>
  <section class="approval-filter">
    <el-radio-group v-model="filters.type" @change="emit('search')">
      <el-radio-button v-for="item in typeOptions" :key="item.value" :value="item.value">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>

    <el-input
      v-model="filters.keyword"
      placeholder="搜索审批事项 / 申请人"
      clearable
      class="approval-filter__search"
      @keyup.enter="emit('search')"
    >
      <template #append>
        <el-button @click="emit('search')">搜索</el-button>
      </template>
    </el-input>
  </section>
</template>

<style scoped lang="scss">
.approval-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  &__search {
    width: 280px;
  }
}
</style>
