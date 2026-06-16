<script setup lang="ts">
interface Kpi {
  label: string
  value: string
  trend: string
  up: boolean
  spark: number[]
  color: string
}

const kpiList: Kpi[] = [
  { label: '今日营业额', value: '¥ 1,286,420', trend: '+8.2%', up: true, color: '#13c2c2', spark: [40, 52, 48, 60, 55, 72, 68] },
  { label: '实收金额', value: '¥ 1,152,300', trend: '+6.5%', up: true, color: '#1677ff', spark: [45, 50, 58, 54, 66, 62, 74] },
  { label: '订单数', value: '18,642', trend: '+4.1%', up: true, color: '#52c41a', spark: [50, 46, 55, 60, 58, 64, 70] },
  { label: '客单价', value: '¥ 68.9', trend: '+1.2%', up: true, color: '#722ed1', spark: [55, 52, 56, 53, 58, 57, 62] },
  { label: '毛利率', value: '62.4%', trend: '-0.3%', up: false, color: '#faad14', spark: [62, 64, 60, 63, 59, 61, 58] },
  { label: '会员复购率', value: '38.6%', trend: '+2.8%', up: true, color: '#eb2f96', spark: [30, 33, 31, 36, 34, 37, 39] },
]

const channelData = [
  { name: '堂食 POS', percent: 42, color: '#13c2c2' },
  { name: '美团外卖', percent: 26, color: '#1677ff' },
  { name: '抖音团购', percent: 18, color: '#722ed1' },
  { name: '饿了么', percent: 14, color: '#faad14' },
]

const storeRank = [
  { name: '上海南京路旗舰店', value: 186420, rate: 100 },
  { name: '杭州西湖印象店', value: 162300, rate: 87 },
  { name: '南京新街口店', value: 148900, rate: 80 },
  { name: '苏州观前街店', value: 132600, rate: 71 },
  { name: '宁波天一广场店', value: 118400, rate: 63 },
]

function maxSpark(spark: number[]) {
  return Math.max(...spark)
}

function sparkPoints(spark: number[]) {
  const max = maxSpark(spark)
  const min = Math.min(...spark)
  const range = max - min || 1
  return spark
    .map((v, i) => {
      const x = (i / (spark.length - 1)) * 100
      const y = 30 - ((v - min) / range) * 26 - 2
      return `${x},${y}`
    })
    .join(' ')
}

const alerts = [
  { store: '上海南京路店', type: '库存预警', level: 'danger', desc: '牛肉库存低于安全值', time: '10:24' },
  { store: '杭州西湖店', type: '退款异常', level: 'warning', desc: '退款率 5.2% 超阈值', time: '09:58' },
  { store: '南京新街口店', type: '差评风险', level: 'warning', desc: '近 1 小时差评 3 条', time: '09:30' },
  { store: '苏州观前街店', type: '低效门店', level: 'info', desc: '午市客流低于预期', time: '09:12' },
]

const approvals = [
  { title: '双人午市套餐活动', applicant: '王晓敏', type: '营销活动', status: '待审批' },
  { title: '门店补货申请 · 华东', applicant: '李建国', type: '库存补货', status: '待审批' },
  { title: '小红书种草内容 ×5', applicant: 'AI 营销助手', type: '内容审批', status: '待审批' },
  { title: '会员日满减预算调整', applicant: '陈雪', type: '预算审批', status: '待审批' },
]

const levelType: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  danger: 'danger',
  warning: 'warning',
  info: 'info',
}
</script>

<template>
  <div class="dashboard-page">
    <section class="diagnosis-banner">
      <div class="diagnosis-banner__icon">
        <el-icon :size="22"><DataLine /></el-icon>
      </div>
      <div class="diagnosis-banner__text">
        <strong>今日经营诊断</strong>
        <p>整体营业额较昨日增长 8.2%，华东区表现突出；3 家门店存在库存与退款异常，建议优先处理。</p>
      </div>
      <div class="diagnosis-banner__tags">
        <span class="diag-tag diag-tag--up">营收 +8.2%</span>
        <span class="diag-tag diag-tag--warn">异常 3 项</span>
        <span class="diag-tag diag-tag--ai">AI 建议 3 条</span>
      </div>
    </section>

    <section class="filter-bar">
      <el-form inline>
        <el-form-item label="时间">
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="渠道">
          <el-select placeholder="全部渠道" style="width: 140px">
            <el-option label="全部渠道" value="all" />
            <el-option label="堂食 POS" value="pos" />
            <el-option label="美团外卖" value="meituan" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select placeholder="全部活动" style="width: 140px">
            <el-option label="全部活动" value="all" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
          <el-button plain>导出</el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="kpi-row">
      <div v-for="item in kpiList" :key="item.label" class="kpi-card">
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

    <section class="chart-row">
      <div class="panel-card chart-card chart-card--trend">
        <div class="card-head">
          <h3>营收趋势与订单结构</h3>
          <el-radio-group size="small" model-value="7d">
            <el-radio-button value="7d">近 7 日</el-radio-button>
            <el-radio-button value="30d">近 30 日</el-radio-button>
          </el-radio-group>
        </div>
        <div class="trend-chart">
          <div v-for="n in 7" :key="n" class="trend-bar-group">
            <span class="trend-bar trend-bar--revenue" :style="{ height: `${40 + ((n * 53) % 55)}%` }" />
            <span class="trend-bar trend-bar--order" :style="{ height: `${24 + ((n * 31) % 40)}%` }" />
            <em>{{ ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][n - 1] }}</em>
          </div>
        </div>
        <div class="trend-legend">
          <span><i style="background: #13c2c2" />营业额</span>
          <span><i style="background: #1677ff" />订单数</span>
        </div>
      </div>

      <div class="panel-card chart-card">
        <div class="card-head">
          <h3>渠道贡献</h3>
        </div>
        <ul class="channel-list">
          <li v-for="ch in channelData" :key="ch.name">
            <div class="channel-list__top">
              <span>{{ ch.name }}</span>
              <strong>{{ ch.percent }}%</strong>
            </div>
            <div class="channel-bar">
              <span :style="{ width: `${ch.percent}%`, background: ch.color }" />
            </div>
          </li>
        </ul>
      </div>

      <div class="panel-card chart-card chart-card--gauge">
        <div class="card-head">
          <h3>客单价</h3>
        </div>
        <div class="gauge">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" stroke="#eef4f4" stroke-width="12" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#13c2c2"
              stroke-width="12"
              fill="none"
              stroke-linecap="round"
              stroke-dasharray="314"
              stroke-dashoffset="86"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div class="gauge__center">
            <strong>68.9</strong>
            <span>元 / 单</span>
          </div>
        </div>
        <p class="gauge__hint">较昨日 <em>+1.2%</em></p>
      </div>
    </section>

    <section class="ai-row">
      <div class="panel-card ai-card">
        <div class="card-head">
          <h3>AI 今日建议</h3>
          <el-tag size="small" effect="dark" type="success">AI</el-tag>
        </div>
        <ul class="ai-list">
          <li>
            <el-icon class="ai-list__icon"><MagicStick /></el-icon>
            华东区午市套餐转化率偏低，建议推送「双人套餐 +8 元券」。
          </li>
          <li>
            <el-icon class="ai-list__icon"><MagicStick /></el-icon>
            3 家门店库存预警，建议触发补货审批流程。
          </li>
          <li>
            <el-icon class="ai-list__icon"><MagicStick /></el-icon>
            员工推广 TOP 门店可复用「转发话术模板 A」。
          </li>
        </ul>
        <el-button type="primary" plain class="ai-action">进入 AI 营销助手</el-button>
      </div>

      <div class="panel-card rank-card">
        <div class="card-head">
          <h3>门店达成率排行</h3>
          <el-link type="primary" :underline="false">查看全部</el-link>
        </div>
        <ul class="rank-list">
          <li v-for="(store, index) in storeRank" :key="store.name">
            <span class="rank-no" :class="{ 'rank-no--top': index < 3 }">{{ index + 1 }}</span>
            <span class="rank-name">{{ store.name }}</span>
            <div class="rank-bar">
              <span :style="{ width: `${store.rate}%` }" />
            </div>
            <span class="rank-value">¥{{ (store.value / 10000).toFixed(1) }}万</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="table-row">
      <div class="panel-card table-card">
        <div class="card-head">
          <h3>异常预警处理台</h3>
          <el-link type="primary" :underline="false">前往处理</el-link>
        </div>
        <el-table :data="alerts" size="default">
          <el-table-column prop="store" label="门店" min-width="130" />
          <el-table-column label="类型" width="100">
            <template #default="{ row }">
              <el-tag size="small" :type="levelType[row.level]" effect="light">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="说明" min-width="150" />
          <el-table-column prop="time" label="时间" width="80" />
        </el-table>
      </div>

      <div class="panel-card table-card">
        <div class="card-head">
          <h3>审批待办</h3>
          <el-link type="primary" :underline="false">前往审批</el-link>
        </div>
        <el-table :data="approvals" size="default">
          <el-table-column prop="title" label="审批事项" min-width="160" />
          <el-table-column prop="applicant" label="申请人" width="110" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag size="small" type="warning" effect="light">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 16px;
}

.panel-card {
  padding: 18px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

/* 经营诊断 banner */
.diagnosis-banner {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px 24px;
  color: #fff;
  background: linear-gradient(120deg, #0e6b73 0%, #13a8a8 60%, #36cfc9 100%);
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.diagnosis-banner__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 12px;
}

.diagnosis-banner__text {
  flex: 1;
  min-width: 0;

  strong {
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.86);
  }
}

.diagnosis-banner__tags {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

.diag-tag {
  padding: 5px 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 999px;
}

/* 筛选条 */
.filter-bar {
  padding: 16px 20px 2px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

/* KPI */
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

/* 图表区 */
.chart-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 16px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

.chart-card {
  min-height: 296px;
}

.trend-chart {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 200px;
  padding-top: 8px;
}

.trend-bar-group {
  position: relative;
  display: flex;
  gap: 4px;
  align-items: flex-end;
  justify-content: center;
  flex: 1;
  height: 100%;
  padding-bottom: 22px;

  em {
    position: absolute;
    bottom: 0;
    font-size: 12px;
    font-style: normal;
    color: $text-tertiary;
  }
}

.trend-bar {
  width: 12px;
  border-radius: 4px 4px 0 0;

  &--revenue {
    background: linear-gradient(180deg, #13c2c2 0%, rgba(19, 194, 194, 0.4) 100%);
  }

  &--order {
    background: linear-gradient(180deg, #1677ff 0%, rgba(22, 119, 255, 0.4) 100%);
  }
}

.trend-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 12px;
  font-size: 12px;
  color: $text-tertiary;

  span {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  i {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
    color: $text-secondary;

    strong {
      color: $text-primary;
    }
  }
}

.channel-bar {
  height: 8px;
  background: $bg-page;
  border-radius: 999px;

  span {
    display: block;
    height: 100%;
    border-radius: 999px;
  }
}

.chart-card--gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge {
  position: relative;
  width: 160px;
  height: 160px;
  margin-top: 4px;

  svg {
    width: 100%;
    height: 100%;
  }

  &__center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    strong {
      font-size: 30px;
      font-weight: 700;
      color: $text-primary;
    }

    span {
      font-size: 12px;
      color: $text-tertiary;
    }
  }

  &__hint {
    margin: 12px 0 0;
    font-size: 13px;
    color: $text-tertiary;

    em {
      font-style: normal;
      color: $color-success;
    }
  }
}

/* AI + 排行 */
.ai-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 16px;
}

.ai-card {
  background: linear-gradient(160deg, #f7f4ff 0%, #fff 45%);
}

.ai-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 0 18px;
  color: $text-secondary;
  line-height: 1.6;

  li {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    font-size: 13px;
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: #722ed1;
  }
}

.ai-action {
  width: 100%;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 14px;

  li {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

.rank-no {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 12px;
  font-weight: 600;
  color: $text-tertiary;
  background: $bg-page;
  border-radius: 6px;

  &--top {
    color: #fff;
    background: $color-brand;
  }
}

.rank-name {
  flex-shrink: 0;
  width: 140px;
  overflow: hidden;
  font-size: 13px;
  color: $text-secondary;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-bar {
  flex: 1;
  height: 8px;
  background: $bg-page;
  border-radius: 999px;

  span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #36cfc9, #13c2c2);
    border-radius: 999px;
  }
}

.rank-value {
  flex-shrink: 0;
  width: 64px;
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  text-align: right;
}

/* 表格区 */
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 1366px) {
  .kpi-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1100px) {
  .chart-row,
  .ai-row,
  .table-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .diagnosis-banner__tags {
    display: none;
  }
}
</style>
