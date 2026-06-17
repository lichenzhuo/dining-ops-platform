<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  APPROVAL_WORKFLOW,
  CanvasStorePointsDemo,
  MARKETING_WORKFLOW,
  SvgDataPipeline,
  SvgWorkflowDiagram,
} from '@/visualization'

const activeTab = ref('pipeline')
const pointCount = ref(1200)

const mockPipeline = [
  { key: 'pos', label: 'POS', status: 'online' },
  { key: 'waimai', label: '外卖', status: 'online' },
  { key: 'meituan', label: '美团', status: 'online' },
  { key: 'douyin', label: '抖音', status: 'warn' },
  { key: 'crm', label: 'CRM', status: 'online' },
  { key: 'inventory', label: '库存', status: 'online' },
  { key: 'finance', label: '财务', status: 'online' },
  { key: 'materials', label: '素材库', status: 'online' },
]

function handleNodeClick(node) {
  ElMessage.info(`节点：${node.label}`)
}
</script>

<template>
  <div class="viz-lab">
    <header class="viz-lab__header">
      <div>
        <h2>可视化实验室</h2>
        <p>SVG 负责结构化流程与链路，Canvas 负责大量点位与动态粒子；ECharts 负责常规统计图表。</p>
      </div>
    </header>

    <el-tabs v-model="activeTab" class="viz-lab__tabs">
      <el-tab-pane label="SVG 数据链路" name="pipeline">
        <section class="panel-card">
          <h3>数据接入链路</h3>
          <p class="panel-card__desc">POS / 外卖 / 平台 / CRM / 库存 / 财务 → 指标中心 → 报表 / 大屏</p>
          <SvgDataPipeline :items="mockPipeline" @node-click="handleNodeClick" />
        </section>
      </el-tab-pane>

      <el-tab-pane label="SVG 审批流" name="approval">
        <section class="panel-card">
          <h3>{{ APPROVAL_WORKFLOW.title }}</h3>
          <p class="panel-card__desc">适合节点数量中等、需要清晰状态色和点击交互的流程图。</p>
          <SvgWorkflowDiagram :workflow="APPROVAL_WORKFLOW" @node-click="handleNodeClick" />
        </section>
      </el-tab-pane>

      <el-tab-pane label="SVG 营销任务流" name="marketing">
        <section class="panel-card">
          <h3>{{ MARKETING_WORKFLOW.title }}</h3>
          <p class="panel-card__desc">AI 生成 → 审批 → 下发门店 → 执行反馈 → 效果追踪。</p>
          <SvgWorkflowDiagram :workflow="MARKETING_WORKFLOW" @node-click="handleNodeClick" />
        </section>
      </el-tab-pane>

      <el-tab-pane label="Canvas 大量点位" name="canvas-points">
        <section class="panel-card">
          <div class="panel-card__toolbar">
            <div>
              <h3>Canvas 门店点位渲染实验</h3>
              <p class="panel-card__desc">用 Canvas + requestAnimationFrame 绘制大量点位，避免 DOM 节点过多。</p>
            </div>
            <div class="panel-card__control">
              <span>点位数量 {{ pointCount }}</span>
              <el-slider v-model="pointCount" :min="200" :max="5000" :step="200" style="width: 220px" />
            </div>
          </div>
          <CanvasStorePointsDemo :key="pointCount" :point-count="pointCount" />
        </section>
      </el-tab-pane>
    </el-tabs>

    <section class="panel-card viz-lab__compare">
      <h3>技术选型对比</h3>
      <ul>
        <li><strong>ECharts</strong>：趋势、占比、地图等常规统计图表。</li>
        <li><strong>SVG</strong>：审批流、营销任务流、数据链路这类结构化可交互图形。</li>
        <li><strong>Canvas</strong>：大量点位、粒子背景、轨迹动画等高频重绘场景。</li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
.viz-lab {
  display: grid;
  gap: 16px;

  &__header {
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
  }

  &__tabs {
    :deep(.el-tabs__content) {
      padding-top: 4px;
    }
  }

  &__compare ul {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
    line-height: 1.8;
    color: $text-secondary;
  }
}

.panel-card {
  padding: 18px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;

  h3 {
    margin: 0 0 8px;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }

  &__desc {
    margin: 0 0 14px;
    font-size: 13px;
    color: $text-tertiary;
  }

  &__toolbar {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__control {
    display: grid;
    gap: 8px;
    justify-items: end;
    font-size: 12px;
    color: $text-secondary;
  }
}
</style>
