<script setup lang="ts">
const kpiList = [
  { label: '今日营业额', value: '¥ 1,286,420', trend: '+8.2%' },
  { label: '实收金额', value: '¥ 1,152,300', trend: '+6.5%' },
  { label: '订单数', value: '18,642', trend: '+4.1%' },
  { label: '客单价', value: '¥ 68.9', trend: '+1.2%' },
]
</script>

<template>
  <div class="dashboard-page">
    <el-alert
      title="经营工作台将在第 5 阶段实现完整 KPI、图表与筛选能力，当前为后台 Layout 演示页。"
      type="info"
      show-icon
      :closable="false"
    />
    <el-row :gutter="16" class="kpi-row">
      <el-col v-for="item in kpiList" :key="item.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="kpi-card">
          <p class="kpi-label">{{ item.label }}</p>
          <p class="kpi-value">{{ item.value }}</p>
          <el-tag size="small" type="success">{{ item.trend }}</el-tag>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 16px;
}

.kpi-row {
  margin-top: 4px;
}

.kpi-card {
  border: 1px solid $border-color;
}

.kpi-label {
  margin: 0 0 8px;
  color: $text-secondary;
  font-size: 13px;
}

.kpi-value {
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 600;
  color: $text-primary;
}
</style>
