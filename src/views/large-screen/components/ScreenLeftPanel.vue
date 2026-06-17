<script setup>
import ScreenPanel from './ScreenPanel.vue'

defineProps({
  diagnosis: { type: Object, default: null },
  leftAlerts: { type: Object, default: null },
})

const emit = defineEmits(['open-report'])
</script>

<template>
  <div class="screen-left">
    <ScreenPanel title="经营诊断">
      <p class="screen-left__summary">{{ diagnosis?.summary }}</p>
      <ul class="screen-left__highlights">
        <li v-for="item in diagnosis?.highlights ?? []" :key="item">{{ item }}</li>
      </ul>
    </ScreenPanel>

    <ScreenPanel title="低效门店" compact>
      <ul class="screen-left__list">
        <li v-for="item in leftAlerts?.lowStores ?? []" :key="item.name">
          <button type="button" class="screen-left__link" @click="emit('open-report', { drillStore: item.name })">
            {{ item.name }}
          </button>
          <span>{{ item.achievement }}</span>
          <em>{{ item.reason }}</em>
        </li>
      </ul>
    </ScreenPanel>

    <ScreenPanel title="风险预警" compact>
      <div class="screen-left__risk-group">
        <p>库存风险</p>
        <ul>
          <li v-for="item in leftAlerts?.inventoryRisks ?? []" :key="item.name">
            {{ item.name }} · {{ item.level }} · {{ item.stores }} 店
          </li>
        </ul>
      </div>
      <div class="screen-left__risk-group">
        <p>差评 / 退款</p>
        <ul>
          <li v-for="item in leftAlerts?.badReviews ?? []" :key="item.store">
            {{ item.store }} 差评 {{ item.count }} · {{ item.topic }}
          </li>
          <li v-for="item in leftAlerts?.refunds ?? []" :key="`${item.store}-refund`">
            {{ item.store }} 退款 {{ item.amount }} · {{ item.reason }}
          </li>
        </ul>
      </div>
    </ScreenPanel>
  </div>
</template>

<style scoped lang="scss">
.screen-left {
  display: grid;
  grid-template-rows: 1.1fr 0.9fr 1fr;
  gap: 10px;
  min-height: 0;

  &__summary {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
    color: $screen-text-secondary;
  }

  &__highlights {
    margin: 10px 0 0;
    padding-left: 18px;
    font-size: 12px;
    line-height: 1.8;
    color: $screen-accent;
  }

  &__list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 12px;

    li {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4px 8px;
      align-items: center;
    }

    em {
      grid-column: 1 / -1;
      font-style: normal;
      color: $screen-text-secondary;
    }

    span {
      color: $color-warning;
    }
  }

  &__link {
    padding: 0;
    font: inherit;
    color: $screen-text-primary;
    text-align: left;
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;
  }

  &__risk-group {
    & + & {
      margin-top: 10px;
    }

    p {
      margin: 0 0 6px;
      font-size: 12px;
      color: $screen-text-primary;
    }

    ul {
      margin: 0;
      padding-left: 16px;
      font-size: 12px;
      line-height: 1.7;
      color: $screen-text-secondary;
    }
  }
}
</style>
