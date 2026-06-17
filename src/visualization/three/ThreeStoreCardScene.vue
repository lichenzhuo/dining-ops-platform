<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { createThreeStoreCardScene } from './createThreeStoreCardScene'
import { THREE_KPI_CARDS } from '@/constants/geo3d'

const containerRef = ref()
let disposeScene = null

onMounted(() => {
  if (!containerRef.value) {
    return
  }
  disposeScene = createThreeStoreCardScene(containerRef.value).dispose
})

onUnmounted(() => {
  disposeScene?.()
})
</script>

<template>
  <div class="three-store-card">
    <div ref="containerRef" class="three-store-card__canvas" />
    <ul class="three-store-card__labels">
      <li v-for="item in THREE_KPI_CARDS" :key="item.label">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.three-store-card {
  position: relative;
  min-height: 360px;
  overflow: hidden;
  border-radius: $radius-base;

  &__canvas {
    width: 100%;
    height: 360px;
  }

  &__labels {
    position: absolute;
    right: 16px;
    bottom: 16px;
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 8px 12px;
      text-align: right;
      background: rgba(7, 20, 38, 0.72);
      border: 1px solid rgba(19, 194, 194, 0.25);
      border-radius: $radius-base;
    }

    strong {
      display: block;
      font-size: 16px;
      color: $screen-accent;
    }

    span {
      font-size: 11px;
      color: $screen-text-secondary;
    }
  }
}
</style>
