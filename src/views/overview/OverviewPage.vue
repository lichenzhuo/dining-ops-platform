<script setup lang="ts">
import { useRouter } from 'vue-router'
import * as ElementPlusIcons from '@element-plus/icons-vue'

const router = useRouter()

function resolveIcon(name: string) {
  return (
    (ElementPlusIcons as Record<string, typeof ElementPlusIcons.Menu>)[name] ??
    ElementPlusIcons.Menu
  )
}

interface OverviewModule {
  title: string
  path: string
  desc: string
  icon: string
  color: string
  tag?: string
}

const capabilityModules: OverviewModule[] = [
  { title: '经营工作台', path: '/dashboard', desc: 'KPI、趋势、异常与 AI 建议', icon: 'Odometer', color: '#13c2c2', tag: '首页' },
  { title: '报表中心', path: '/reports', desc: '原生报表、字段配置、下钻导出', icon: 'DataAnalysis', color: '#1677ff' },
  { title: '门店经营', path: '/store-ops', desc: '单店达成、任务执行、异常处理', icon: 'Shop', color: '#52c41a' },
  { title: '订单报表', path: '/order-reports', desc: '渠道订单、退款与结构分析', icon: 'Tickets', color: '#722ed1' },
  { title: '营销活动', path: '/marketing', desc: '活动创建、ROI 分析与追踪', icon: 'Promotion', color: '#fa541c' },
  { title: '卡券中心', path: '/coupons', desc: '发券、核销、库存与规则', icon: 'Ticket', color: '#faad14' },
  { title: '会员运营', path: '/members', desc: '会员增长、分层与复购', icon: 'UserFilled', color: '#eb2f96' },
  { title: '员工推广', path: '/staff-promotion', desc: '店员转发、排名与激励', icon: 'Avatar', color: '#13c2c2' },
  { title: '品牌种草', path: '/brand-seeding', desc: '小红书 / 抖音内容运营', icon: 'ChatDotRound', color: '#f5222d' },
  { title: 'AI 营销助手', path: '/ai-agent', desc: '生成方案、审批、下发门店', icon: 'MagicStick', color: '#722ed1', tag: 'AI' },
  { title: '素材库', path: '/materials', desc: '文案、图片提示词与模板', icon: 'FolderOpened', color: '#1677ff' },
  { title: '经营指挥大屏', path: '/large-screen', desc: '深色全屏态势展示', icon: 'Monitor', color: '#0b3d5c', tag: '大屏' },
  { title: '地图态势', path: '/geo-visualization', desc: 'ECharts 地图 / Cesium 3D', icon: 'Location', color: '#52c41a' },
  { title: '可视化实验室', path: '/visualization-lab', desc: 'SVG / Canvas / D3 / X6', icon: 'PictureFilled', color: '#fa8c16' },
  { title: '流程设计器', path: '/workflow-designer', desc: '审批流与任务流编排', icon: 'Share', color: '#13c2c2' },
  { title: '审批中心', path: '/approval', desc: '营销动作、素材与预算审批', icon: 'DocumentChecked', color: '#1677ff' },
  { title: '数据导入', path: '/data-import', desc: 'POS / 外卖 / CRM 数据接入', icon: 'Upload', color: '#52c41a' },
  { title: '性能优化实验室', path: '/performance-lab', desc: '虚拟滚动、Worker、图表优化', icon: 'Cpu', color: '#722ed1' },
  { title: 'AI Coding 沉淀', path: '/ai-coding', desc: 'Prompt、复盘与面试话术', icon: 'EditPen', color: '#eb2f96' },
  { title: '系统设置', path: '/settings', desc: '组织、角色、菜单与参数', icon: 'Setting', color: '#86909c' },
]

const flowSteps = [
  { label: '数据接入', icon: 'Upload', color: '#1677ff' },
  { label: '经营分析', icon: 'DataAnalysis', color: '#13c2c2' },
  { label: '大屏展示', icon: 'Monitor', color: '#722ed1' },
  { label: '地图态势', icon: 'Location', color: '#52c41a' },
  { label: 'AI 营销', icon: 'MagicStick', color: '#fa541c' },
  { label: '审批下发', icon: 'DocumentChecked', color: '#faad14' },
  { label: '门店执行', icon: 'Shop', color: '#eb2f96' },
  { label: '效果复盘', icon: 'RefreshRight', color: '#0b3d5c' },
]

const quickEntries: OverviewModule[] = [
  { title: '经营工作台', path: '/dashboard', desc: '查看今日经营', icon: 'Odometer', color: '#13c2c2' },
  { title: '经营大屏', path: '/large-screen', desc: '投屏态势展示', icon: 'Monitor', color: '#0b3d5c' },
  { title: 'AI 营销助手', path: '/ai-agent', desc: '生成营销方案', icon: 'MagicStick', color: '#722ed1' },
  { title: '报表中心', path: '/reports', desc: '下钻与导出', icon: 'DataAnalysis', color: '#1677ff' },
]

const notices = [
  { type: 'warning', text: '华东区 3 家门店触发库存预警，待处理', time: '10 分钟前' },
  { type: 'success', text: '「双人午市套餐」活动审批已通过并下发门店', time: '1 小时前' },
  { type: 'info', text: 'AI 营销助手生成 5 条小红书种草文案', time: '2 小时前' },
  { type: 'danger', text: '上海南京路店昨日退款率超过阈值', time: '昨天 18:20' },
  { type: 'info', text: '本月会员复购率较上月提升 2.8%', time: '昨天 09:00' },
]

const noticeDotColor: Record<string, string> = {
  warning: '#faad14',
  success: '#52c41a',
  info: '#1677ff',
  danger: '#ff4d4f',
}

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="overview-page">
    <section class="overview-hero">
      <div class="overview-hero__content">
        <p class="overview-hero__badge">能力地图 · Capability Map</p>
        <h1>味链云 · 连锁餐饮运营平台</h1>
        <p class="overview-hero__desc">
          从数据接入到经营分析、大屏展示、AI 营销、审批下发与门店执行反馈，形成完整业务闭环。
        </p>
      </div>
      <div class="overview-hero__stats">
        <div><strong>20</strong><span>规划模块</span></div>
        <div><strong>1</strong><span>业务闭环</span></div>
        <div><strong>128</strong><span>接入门店</span></div>
      </div>
    </section>

    <section class="overview-block">
      <div class="block-head">
        <h2>系统能力地图</h2>
        <span>覆盖经营分析、可视化、营销运营、流程协同与工程实践</span>
      </div>
      <div class="capability-grid">
        <article
          v-for="item in capabilityModules"
          :key="item.path"
          class="cap-card"
          @click="navigate(item.path)"
        >
          <span class="cap-card__icon" :style="{ '--icon-color': item.color }">
            <el-icon :size="20"><component :is="resolveIcon(item.icon)" /></el-icon>
          </span>
          <div class="cap-card__body">
            <div class="cap-card__title">
              <h3>{{ item.title }}</h3>
              <el-tag v-if="item.tag" size="small" effect="plain" type="success">{{ item.tag }}</el-tag>
            </div>
            <p>{{ item.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="overview-block">
      <div class="block-head">
        <h2>业务闭环</h2>
        <span>数据接入 → 分析 → 展示 → AI 营销 → 审批 → 执行 → 复盘</span>
      </div>
      <div class="flow-strip">
        <template v-for="(step, index) in flowSteps" :key="step.label">
          <div class="flow-node">
            <span class="flow-node__icon" :style="{ '--icon-color': step.color }">
              <el-icon :size="18"><component :is="resolveIcon(step.icon)" /></el-icon>
            </span>
            <span class="flow-node__label">{{ step.label }}</span>
          </div>
          <el-icon v-if="index < flowSteps.length - 1" class="flow-arrow"><ArrowRightBold /></el-icon>
        </template>
      </div>
    </section>

    <section class="overview-bottom">
      <div class="overview-block overview-block--quick">
        <div class="block-head">
          <h2>快捷入口</h2>
        </div>
        <div class="quick-grid">
          <article
            v-for="item in quickEntries"
            :key="item.path"
            class="quick-card"
            @click="navigate(item.path)"
          >
            <span class="quick-card__icon" :style="{ '--icon-color': item.color }">
              <el-icon :size="22"><component :is="resolveIcon(item.icon)" /></el-icon>
            </span>
            <strong>{{ item.title }}</strong>
            <span class="quick-card__desc">{{ item.desc }}</span>
          </article>
        </div>
      </div>

      <div class="overview-block overview-block--notice">
        <div class="block-head">
          <h2>最近动态</h2>
          <el-link type="primary" :underline="false">查看全部</el-link>
        </div>
        <ul class="notice-list">
          <li v-for="(item, index) in notices" :key="index">
            <span class="notice-dot" :style="{ background: noticeDotColor[item.type] }" />
            <span class="notice-text">{{ item.text }}</span>
            <span class="notice-time">{{ item.time }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.overview-page {
  display: grid;
  gap: 16px;
}

.overview-hero {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  color: #fff;
  background: linear-gradient(120deg, #0b3d5c 0%, #0e6b73 55%, #13a8a8 100%);
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.overview-hero__badge {
  display: inline-block;
  margin: 0 0 12px;
  padding: 4px 12px;
  font-size: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 999px;
}

.overview-hero h1 {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 700;
}

.overview-hero__desc {
  max-width: 660px;
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
}

.overview-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex-shrink: 0;

  div {
    min-width: 84px;
    padding: 14px 18px;
    text-align: center;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: $radius-base;
  }

  strong {
    display: block;
    margin-bottom: 4px;
    font-size: 24px;
  }

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.78);
  }
}

.overview-block {
  padding: 20px 24px 24px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;

  h2 {
    position: relative;
    margin: 0;
    padding-left: 12px;
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;

    &::before {
      position: absolute;
      top: 2px;
      bottom: 2px;
      left: 0;
      width: 3px;
      background: $color-brand;
      border-radius: 2px;
      content: '';
    }
  }

  span {
    font-size: 12px;
    color: $text-tertiary;
  }
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(232px, 1fr));
  gap: 12px;
}

.cap-card {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-base;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    border-color: rgba(19, 194, 194, 0.45);
    box-shadow: $shadow-card;
    transform: translateY(-2px);
  }
}

.cap-card__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: var(--icon-color);
  background: color-mix(in srgb, var(--icon-color) 12%, #fff);
  border-radius: 10px;
}

.cap-card__body {
  min-width: 0;
}

.cap-card__title {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 4px;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }
}

.cap-card__body p {
  margin: 0;
  overflow: hidden;
  font-size: 12px;
  color: $text-tertiary;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flow-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.flow-node {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  flex: 1;
  min-width: 72px;
}

.flow-node__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--icon-color);
  background: color-mix(in srgb, var(--icon-color) 12%, #fff);
  border: 1px solid color-mix(in srgb, var(--icon-color) 24%, #fff);
  border-radius: 50%;
}

.flow-node__label {
  font-size: 13px;
  color: $text-secondary;
}

.flow-arrow {
  flex-shrink: 0;
  margin-bottom: 22px;
  font-size: 16px;
  color: $text-placeholder;
}

.overview-bottom {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  background: linear-gradient(135deg, #f7fdfc 0%, #fff 60%);
  border: 1px solid $border-light;
  border-radius: $radius-base;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: rgba(19, 194, 194, 0.45);
    box-shadow: $shadow-card;
  }

  strong {
    font-size: 15px;
    color: $text-primary;
  }
}

.quick-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 4px;
  color: var(--icon-color);
  background: color-mix(in srgb, var(--icon-color) 12%, #fff);
  border-radius: 10px;
}

.quick-card__desc {
  font-size: 12px;
  color: $text-tertiary;
}

.notice-list {
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px dashed $border-light;

    &:last-child {
      border-bottom: none;
    }
  }
}

.notice-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.notice-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  color: $text-secondary;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-time {
  flex-shrink: 0;
  font-size: 12px;
  color: $text-placeholder;
}

@media (max-width: 1100px) {
  .overview-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .overview-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-hero__stats {
    width: 100%;
  }
}
</style>
