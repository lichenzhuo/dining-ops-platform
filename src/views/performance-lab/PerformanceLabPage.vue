<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ChartThrottleDemo from '@/components/perf/ChartThrottleDemo.vue'
import VirtualScrollTable from '@/components/perf/VirtualScrollTable.vue'
import { PERF_TECHNIQUE_GROUPS, ROUTE_LAZY_MODULES } from '@/constants/performance'
import { CanvasStorePointsDemo } from '@/visualization'

const router = useRouter()

const throttledDemoRef = ref()
const rawDemoRef = ref()
const streamRunning = ref(false)
const pointCount = ref(5000)
const canvasMode = ref('compare')

const virtualColumns = [
  { key: 'id', label: '序号', width: 72 },
  { key: 'storeName', label: '门店', width: 140 },
  { key: 'region', label: '区域', width: 88 },
  { key: 'revenue', label: '营业额', width: 120 },
  { key: 'orders', label: '订单数', width: 96 },
]

const virtualRows = buildVirtualRows(5000)

function buildVirtualRows(count) {
  const regions = ['华东', '华南', '华北', '西南', '华中']
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    storeName: `门店 ${String(index + 1).padStart(4, '0')}`,
    region: regions[index % regions.length],
    revenue: `${(12000 + ((index * 37) % 8000)).toLocaleString('zh-CN')} 元`,
    orders: 80 + ((index * 13) % 200),
  }))
}

function toggleChartStream() {
  if (streamRunning.value) {
    throttledDemoRef.value?.stopStream()
    rawDemoRef.value?.stopStream()
    streamRunning.value = false
    return
  }
  throttledDemoRef.value?.resetCounters()
  rawDemoRef.value?.resetCounters()
  throttledDemoRef.value?.startStream()
  rawDemoRef.value?.startStream()
  streamRunning.value = true
}

function statusTag(status) {
  return status === 'done' ? 'success' : 'info'
}
</script>

<template>
  <div class="perf-lab">
    <header class="perf-lab__header">
      <div>
        <h2>可视化性能优化专题</h2>
        <p>
          把性能优化分成报表、图表、文件和地图四类：报表用服务端分页与虚拟滚动，图表复用实例并控制刷新频率，
          Excel 大文件用 Web Worker，地图大量点位采用聚合、视口裁剪与路由分包。
        </p>
      </div>
      <div class="perf-lab__header-actions">
        <el-button @click="router.push('/data-import')">数据导入 Worker</el-button>
        <el-button @click="router.push('/geo-3d')">Cesium 3D 态势</el-button>
        <el-button type="primary" @click="router.push('/visualization-lab')">可视化实验室</el-button>
      </div>
    </header>

    <section class="perf-lab__section">
      <h3>优化清单</h3>
      <div class="perf-lab__grid perf-lab__grid--techniques">
        <article v-for="group in PERF_TECHNIQUE_GROUPS" :key="group.key" class="panel-card">
          <h4>{{ group.title }}</h4>
          <p class="panel-card__desc">{{ group.summary }}</p>
          <ul class="perf-lab__list">
            <li v-for="item in group.items" :key="item.name">
              <span>{{ item.name }}</span>
              <el-tag size="small" :type="statusTag(item.status)">{{ item.location }}</el-tag>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="perf-lab__section">
      <div class="section-head">
        <div>
          <h3>ECharts 更新节流</h3>
          <p class="section-head__desc">模拟高频数据推送（约 60 次/秒），对比节流与无节流下 setOption 调用次数。</p>
        </div>
        <el-button :type="streamRunning ? 'danger' : 'primary'" @click="toggleChartStream">
          {{ streamRunning ? '停止推送' : '开始高频推送' }}
        </el-button>
      </div>
      <div class="perf-lab__grid perf-lab__grid--charts">
        <article class="panel-card">
          <h4>节流模式（BaseChart）</h4>
          <ChartThrottleDemo ref="throttledDemoRef" :throttled="true" />
        </article>
        <article class="panel-card">
          <h4>无节流（对照组）</h4>
          <ChartThrottleDemo ref="rawDemoRef" :throttled="false" />
        </article>
      </div>
    </section>

    <section class="perf-lab__section">
      <div class="section-head">
        <div>
          <h3>虚拟滚动表格</h3>
          <p class="section-head__desc">5000 行明细仅渲染可视窗口 + 缓冲行，DOM 节点数与滚动位置无关。</p>
        </div>
      </div>
      <article class="panel-card">
        <VirtualScrollTable :columns="virtualColumns" :rows="virtualRows" :height="420" />
      </article>
    </section>

    <section class="perf-lab__section">
      <div class="section-head">
        <div>
          <h3>Canvas 视口裁剪</h3>
          <p class="section-head__desc">大量点位场景下只绘制当前视口内元素，并配合空间网格加速命中检测。</p>
        </div>
        <div class="section-head__controls">
          <span>点位数量</span>
          <el-slider v-model="pointCount" :min="1200" :max="8000" :step="400" style="width: 220px" />
          <el-radio-group v-model="canvasMode" size="small">
            <el-radio-button value="compare">对比</el-radio-button>
            <el-radio-button value="optimized">仅优化</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="perf-lab__grid" :class="{ 'perf-lab__grid--canvas': canvasMode === 'compare' }">
        <article v-if="canvasMode === 'compare'" class="panel-card">
          <h4>全量绘制（对照）</h4>
          <CanvasStorePointsDemo :point-count="pointCount" :optimized="false" />
        </article>
        <article class="panel-card">
          <h4>{{ canvasMode === 'compare' ? '视口裁剪（优化）' : '视口裁剪模式' }}</h4>
          <CanvasStorePointsDemo :point-count="pointCount" :optimized="true" />
        </article>
      </div>
    </section>

    <section class="perf-lab__section">
      <div class="section-head">
        <div>
          <h3>路由懒加载与分包</h3>
          <p class="section-head__desc">业务路由均为动态 import；构建时将 echarts / cesium / three / x6 / xlsx 拆为独立 chunk。</p>
        </div>
      </div>
      <article class="panel-card">
        <el-table :data="ROUTE_LAZY_MODULES" stripe border style="width: 100%">
          <el-table-column prop="path" label="路由" width="200" />
          <el-table-column prop="chunk" label="懒加载 / 分包说明" />
        </el-table>
      </article>
    </section>
  </div>
</template>

<style scoped lang="scss">
.perf-lab {
  display: grid;
  gap: 24px;
  padding-bottom: 24px;

  &__header {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    h2 {
      margin: 0 0 8px;
      font-size: 22px;
      font-weight: 600;
      color: $text-primary;
    }

    p {
      max-width: 720px;
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: $text-secondary;
    }

    &-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  &__section {
    display: grid;
    gap: 12px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  &__grid {
    display: grid;
    gap: 16px;

    &--techniques {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    &--charts,
    &--canvas {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &__list {
    display: grid;
    gap: 8px;
    margin: 12px 0 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: $text-secondary;
    }
  }
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  &__desc {
    margin: 4px 0 0;
    font-size: 13px;
    color: $text-tertiary;
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    font-size: 13px;
    color: $text-secondary;
  }
}

.panel-card {
  padding: 18px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;

  h4 {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }

  &__desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: $text-secondary;
  }
}

@media (max-width: 960px) {
  .perf-lab__grid--charts,
  .perf-lab__grid--canvas {
    grid-template-columns: 1fr;
  }
}
</style>
