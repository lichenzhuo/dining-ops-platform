<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

function sparkPoints(spark) {
  const max = Math.max(...spark)
  const min = Math.min(...spark)
  const range = max - min || 1
  return spark
    .map((value, index) => {
      const x = (index / (spark.length - 1)) * 100
      const y = 30 - ((value - min) / range) * 26 - 2
      return `${x},${y}`
    })
    .join(' ')
}
</script>

<template>
  <section class="kpi-row">
    <div v-for="item in items" :key="item.key" class="kpi-card">
      <div class="kpi-card__top">
        <p class="kpi-label">{{ item.label }}</p>
        <span class="kpi-trend" :class="item.up ? 'kpi-trend--up' : 'kpi-trend--down'">
          <el-icon><component :is="item.up ? 'CaretTop' : 'CaretBottom'" /></el-icon>
          {{ item.trend }}
        </span>
      </div>
      <p class="kpi-value">{{ item.value }}</p>
      <svg class="kpi-spark" viewBox="0 0 100 30" preserveAspectRatio="none">
        <polyline
          :points="sparkPoints(item.spark)"
          fill="none"
          :stroke="item.color"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </section>
</template>

<style scoped lang="scss">
.kpi-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.kpi-card {
  position: relative;
  padding: 16px 18px;
  overflow: hidden;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.kpi-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-label {
  margin: 0;
  font-size: 13px;
  color: $text-tertiary;
}

.kpi-trend {
  display: inline-flex;
  align-items: center;
  font-size: 12px;

  &--up {
    color: $color-success;
  }

  &--down {
    color: $color-danger;
  }
}

.kpi-value {
  margin: 10px 0 0;
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
}

.kpi-spark {
  width: 100%;
  height: 30px;
  margin-top: 8px;
}

@media (max-width: 1366px) {
  .kpi-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
