<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const now = new Date().toLocaleString('zh-CN', { hour12: false })

const kpiList = [
  { label: '营业额', value: '128.6万' },
  { label: '实收', value: '115.2万' },
  { label: '订单', value: '1.86万' },
  { label: '客流', value: '2.14万' },
  { label: '客单价', value: '68.9' },
  { label: '毛利率', value: '62.4%' },
]
</script>

<template>
  <div class="large-screen-page">
    <header class="screen-header">
      <div class="screen-header__left">
        <h1>餐饮连锁经营指挥大屏</h1>
        <span class="screen-meta">全国 · 今日口径 · 同步 {{ now }}</span>
      </div>
      <div class="screen-header__right">
        <el-tag effect="dark" type="success">数据健康</el-tag>
        <el-button text class="screen-btn" @click="router.push('/dashboard')">返回后台</el-button>
      </div>
    </header>

    <section class="screen-kpi">
      <div v-for="item in kpiList" :key="item.label" class="screen-kpi__item">
        <span class="label">{{ item.label }}</span>
        <strong class="value">{{ item.value }}</strong>
      </div>
    </section>

    <section class="screen-body">
      <div class="screen-panel">
        <h3>经营诊断</h3>
        <p>低效门店 12 家 · 库存风险 5 项 · 差评待处理 8 条</p>
      </div>
      <div class="screen-panel screen-panel--main">
        <h3>区域经营态势</h3>
        <p>地图与飞线可视化将在第 8–9 阶段接入 ECharts 地图。</p>
        <div class="map-placeholder">MAP / HEAT / FLYLINE</div>
      </div>
      <div class="screen-panel">
        <h3>今日运营动作</h3>
        <p>AI 推荐动作 3 条 · 门店任务完成率 86%</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.large-screen-page {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 16px;
  height: 100%;
  padding: 20px 24px 24px;
  background:
    radial-gradient(circle at 20% 10%, rgba(19, 194, 194, 0.18), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(22, 119, 255, 0.16), transparent 35%),
    $screen-bg;
}

.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.screen-header h1 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 600;
  color: $screen-text-primary;
}

.screen-meta {
  font-size: 13px;
  color: $screen-text-secondary;
}

.screen-header__right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.screen-btn {
  color: $screen-text-secondary !important;
}

.screen-kpi {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.screen-kpi__item {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $screen-border;
  border-radius: $radius-base;

  .label {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    color: $screen-text-secondary;
  }

  .value {
    font-size: 20px;
    color: $screen-accent;
  }
}

.screen-body {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 16px;
  min-height: 0;
}

.screen-panel {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid $screen-border;
  border-radius: $radius-base;

  h3 {
    margin: 0 0 10px;
    font-size: 15px;
    color: $screen-text-primary;
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: $screen-text-secondary;
  }
}

.screen-panel--main {
  display: flex;
  flex-direction: column;
}

.map-placeholder {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  min-height: 280px;
  font-size: 14px;
  letter-spacing: 2px;
  color: rgba(19, 194, 194, 0.75);
  background: rgba(0, 0, 0, 0.18);
  border: 1px dashed rgba(19, 194, 194, 0.35);
  border-radius: $radius-base;
}

@media (max-width: 1280px) {
  .screen-kpi {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .screen-body {
    grid-template-columns: 1fr;
  }
}
</style>
