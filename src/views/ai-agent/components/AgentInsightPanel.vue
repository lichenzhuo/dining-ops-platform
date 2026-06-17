<script setup>
defineProps({
  insights: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  compliance: {
    type: Object,
    default: null,
  },
  savedCount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <section class="panel-card agent-insight">
    <div class="agent-insight__head">
      <h3>经营洞察</h3>
      <el-tag size="small">近 7 日</el-tag>
    </div>

    <el-skeleton v-if="loading" animated :rows="5" />
    <template v-else-if="insights">
      <div class="agent-insight__metrics">
        <article>
          <span>营收</span>
          <strong>{{ insights.revenue7d }}{{ insights.revenueUnit }}</strong>
        </article>
        <article>
          <span>客流</span>
          <strong>{{ insights.footfall7d }}{{ insights.footfallUnit }}</strong>
        </article>
        <article>
          <span>复购率</span>
          <strong>{{ insights.repurchaseRate }}%</strong>
        </article>
      </div>

      <div class="agent-insight__block">
        <p>渠道转化</p>
        <ul>
          <li v-for="item in insights.channelConversion" :key="item.channel">
            <span>{{ item.channel }}</span>
            <em>{{ item.rate }}%</em>
          </li>
        </ul>
      </div>

      <div class="agent-insight__block">
        <p>门店画像</p>
        <ul class="agent-insight__profile">
          <li v-for="(item, index) in insights.storeProfile" :key="index">{{ item }}</li>
        </ul>
      </div>
    </template>

    <div v-if="compliance" class="agent-insight__compliance">
      <div class="agent-insight__compliance-head">
        <p>合规检查</p>
        <el-tag size="small" :type="compliance.passed ? 'success' : 'warning'">
          {{ compliance.passed ? '通过' : '需修改' }}
        </el-tag>
      </div>
      <ul>
        <li v-for="(item, index) in compliance.issues" :key="index">{{ item }}</li>
      </ul>
    </div>

    <div class="agent-insight__materials">
      <span>素材库</span>
      <strong>{{ savedCount }}</strong>
      <em>已保存方案</em>
    </div>
  </section>
</template>

<style scoped lang="scss">
.agent-insight {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    h3 {
      margin: 0;
      font-size: 15px;
    }
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 14px;

    article {
      padding: 10px;
      text-align: center;
      background: $bg-page;
      border: 1px solid $border-light;
      border-radius: $radius-base;

      span {
        display: block;
        font-size: 11px;
        color: $text-tertiary;
      }

      strong {
        font-size: 16px;
        color: $text-primary;
      }
    }
  }

  &__block {
    & + & {
      margin-top: 12px;
    }

    p {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 600;
      color: $text-primary;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;
      color: $text-secondary;
    }

    em {
      font-style: normal;
      color: $color-brand;
    }
  }

  &__profile li {
    display: block;
    line-height: 1.6;
  }

  &__compliance {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px dashed $border-light;

    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      p {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
      }
    }

    ul {
      margin: 0;
      padding-left: 16px;
      font-size: 12px;
      line-height: 1.6;
      color: $text-secondary;
    }
  }

  &__materials {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 8px;
    align-items: center;
    margin-top: 14px;
    padding: 10px 12px;
    background: linear-gradient(135deg, #f7f4ff, #fff);
    border-radius: $radius-base;

    span {
      font-size: 12px;
      color: $text-tertiary;
    }

    strong {
      font-size: 20px;
      color: #722ed1;
    }

    em {
      grid-column: 1 / -1;
      font-size: 11px;
      font-style: normal;
      color: $text-tertiary;
    }
  }
}
</style>
