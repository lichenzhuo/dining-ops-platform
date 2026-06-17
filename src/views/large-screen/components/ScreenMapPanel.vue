<script setup>
import { GeoMapChart } from '@/charts'
import ScreenPanel from './ScreenPanel.vue'

defineProps({
  map: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['open-report'])

function handleRegionClick(payload) {
  emit('open-report', {
    report: 'store',
    keyword: payload.name?.replace(/省|市/g, ''),
  })
}

function handleStoreClick(payload) {
  emit('open-report', {
    report: 'store',
    drillStore: payload.name,
  })
}
</script>

<template>
  <ScreenPanel title="区域经营态势">
    <template #extra>
      <span class="screen-map__hint">GeoJSON · 热力 · 点位 · 飞线</span>
    </template>

    <div class="screen-map">
      <div class="screen-map__chart">
        <GeoMapChart
          theme="dark"
          :center="[119.5, 31.2]"
          :zoom="3.4"
          :regions="map?.regions ?? []"
          :stores="map?.stores ?? []"
          :hub="map?.hub ?? null"
          :loading="loading"
          height="100%"
          @region-click="handleRegionClick"
          @store-click="handleStoreClick"
        />
      </div>
      <div class="screen-map__cards">
        <article v-for="card in map?.regionCards ?? []" :key="card.name" class="screen-map__card">
          <h4>{{ card.name }}</h4>
          <p>营业额 {{ card.revenue }}</p>
          <span>订单 {{ card.orders }}</span>
        </article>
      </div>
    </div>
  </ScreenPanel>
</template>

<style scoped lang="scss">
.screen-map {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 10px;
  height: 100%;
  min-height: 280px;

  &__hint {
    font-size: 11px;
    color: $screen-text-secondary;
  }

  &__chart {
    min-height: 240px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  &__card {
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;

    h4 {
      margin: 0 0 4px;
      font-size: 12px;
      color: $screen-text-primary;
    }

    p,
    span {
      display: block;
      font-size: 11px;
      color: $screen-text-secondary;
    }
  }
}
</style>
