<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  APPROVAL_WORKFLOW,
  CanvasStorePointsDemo,
  D3ChannelFunnelChart,
  D3MemberTierChart,
  MARKETING_WORKFLOW,
  SvgDataPipeline,
  SvgWorkflowDiagram,
  ThreeStoreCardScene,
} from '@/visualization'

const router = useRouter()
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

function handleD3Click(item) {
  ElMessage.info(`选中：${item.segment ?? item.stage}`)
}
</script>

<template>
  <div class="viz-lab">
    <header class="viz-lab__header">
      <div>
        <h2>可视化实验室</h2>
        <p>SVG / Canvas / D3 / X6 / Three.js / Cesium 分层负责不同可视化场景；ECharts 负责常规统计图表。</p>
      </div>
      <div class="viz-lab__header-actions">
        <el-button @click="router.push('/geo-3d')">打开 Cesium 3D 态势</el-button>
        <el-button type="primary" @click="router.push('/workflow-designer')">打开 X6 流程设计器</el-button>
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

      <el-tab-pane label="D3 会员分层" name="d3-tier">
        <section class="panel-card">
          <h3>会员分层图</h3>
          <p class="panel-card__desc">D3 数据驱动绑定，补充 ECharts 不便高度定制的分层关系图。</p>
          <D3MemberTierChart @segment-click="handleD3Click" />
        </section>
      </el-tab-pane>

      <el-tab-pane label="Three.js 3D 指标卡" name="three">
        <section class="panel-card">
          <h3>Three.js 3D 门店指标卡 Demo</h3>
          <p class="panel-card__desc">Scene / Camera / Renderer / 几何体 / 材质 / 光照 / 动画循环 / dispose。</p>
          <ThreeStoreCardScene />
        </section>
      </el-tab-pane>

      <el-tab-pane label="D3 渠道漏斗" name="d3-funnel">
        <section class="panel-card">
          <h3>渠道转化漏斗</h3>
          <p class="panel-card__desc">曝光 → 点击 → 下单 → 核销 → 复购，自定义 SVG 几何绘制。</p>
          <D3ChannelFunnelChart @stage-click="handleD3Click" />
        </section>
      </el-tab-pane>
    </el-tabs>

    <section class="panel-card viz-lab__compare">
      <h3>技术选型对比</h3>
      <ul>
        <li><strong>ECharts</strong>：趋势、占比、地图等常规统计图表。</li>
        <li><strong>SVG</strong>：审批流、营销任务流、数据链路这类结构化可交互图形。</li>
        <li><strong>Canvas</strong>：大量点位、粒子背景、轨迹动画等高频重绘场景。</li>
        <li><strong>D3</strong>：会员分层、渠道漏斗等高度定制的数据驱动 SVG 图形。</li>
        <li><strong>X6</strong>：可拖拽、可连线的流程编排与设计器，见 <router-link to="/workflow-designer">流程设计器</router-link>。</li>
        <li><strong>Three.js</strong>：通用 WebGL 3D 场景与指标卡实验，见本页 Tab 或 <router-link to="/geo-3d">3D 地理态势</router-link>。</li>
        <li><strong>Cesium</strong>：3D 地球、门店点位、区域柱状体与飞线，见 <router-link to="/geo-3d">3D 地理态势</router-link>。</li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
.viz-lab {
  display: grid;
  gap: 16px;

  &__header {
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
  }

  &__header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
