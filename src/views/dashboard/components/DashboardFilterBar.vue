<script setup>
const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search', 'reset', 'export', 'update:filters'])

function patchFilters(partial) {
  emit('update:filters', { ...props.filters, ...partial })
}
</script>

<template>
  <section class="filter-bar">
    <el-form inline>
      <el-form-item label="时间">
        <el-date-picker
          :model-value="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始"
          end-placeholder="结束"
          value-format="YYYY-MM-DD"
          style="width: 240px"
          @update:model-value="patchFilters({ dateRange: $event })"
        />
      </el-form-item>
      <el-form-item label="渠道">
        <el-select
          :model-value="filters.channel"
          placeholder="全部渠道"
          style="width: 140px"
          @update:model-value="patchFilters({ channel: $event })"
        >
          <el-option label="全部渠道" value="all" />
          <el-option label="堂食 POS" value="pos" />
          <el-option label="美团外卖" value="meituan" />
          <el-option label="抖音团购" value="douyin" />
          <el-option label="饿了么" value="eleme" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动类型">
        <el-select
          :model-value="filters.activityType"
          placeholder="全部活动"
          style="width: 140px"
          @update:model-value="patchFilters({ activityType: $event })"
        >
          <el-option label="全部活动" value="all" />
          <el-option label="满减促销" value="discount" />
          <el-option label="会员活动" value="member" />
          <el-option label="新品推广" value="new_product" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="emit('search')">查询</el-button>
        <el-button @click="emit('reset')">重置</el-button>
        <el-button plain @click="emit('export')">导出</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<style scoped lang="scss">
.filter-bar {
  padding: 16px 20px 2px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}
</style>
