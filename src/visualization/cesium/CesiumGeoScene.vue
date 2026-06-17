<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { createCesiumGeoViewer } from './createCesiumGeoViewer'

const props = defineProps({
  geoData: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['store-click', 'region-click', 'clear-selection'])

const containerRef = ref()
let viewerApi = null

async function mountViewer(data) {
  if (!containerRef.value || !data) {
    return
  }
  viewerApi?.dispose()
  viewerApi = await createCesiumGeoViewer(containerRef.value, data, {
    onStoreClick: (payload) => emit('store-click', payload),
    onRegionClick: (payload) => emit('region-click', payload),
    onClear: () => emit('clear-selection'),
  })
}

onMounted(async () => {
  if (props.geoData) {
    await mountViewer(props.geoData)
  }
})

watch(
  () => props.geoData,
  async (data) => {
    if (data) {
      await mountViewer(data)
    }
  },
)

onUnmounted(() => {
  viewerApi?.dispose()
  viewerApi = null
})

function resetCamera() {
  viewerApi?.flyToData()
}

defineExpose({ resetCamera })
</script>

<template>
  <div v-loading="loading" class="cesium-geo-scene">
    <div ref="containerRef" class="cesium-geo-scene__viewer" />
    <div class="cesium-geo-scene__legend">
      <span><i class="dot dot--bar" />区域柱状体</span>
      <span><i class="dot dot--store" />门店点位</span>
      <span><i class="dot dot--flow" />订单飞线</span>
      <span><i class="dot dot--hub" />区域 Hub</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cesium-geo-scene {
  position: relative;
  min-height: 620px;
  overflow: hidden;
  border-radius: $radius-base;

  &__viewer {
    width: 100%;
    height: 620px;
  }

  &__legend {
    position: absolute;
    top: 12px;
    left: 12px;
    display: grid;
    gap: 6px;
    padding: 10px 12px;
    font-size: 11px;
    color: #e6f4ff;
    background: rgba(7, 20, 38, 0.72);
    border: 1px solid rgba(19, 194, 194, 0.25);
    border-radius: $radius-base;

    span {
      display: inline-flex;
      gap: 8px;
      align-items: center;
    }
  }
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;

  &--bar {
    background: #13c2c2;
  }

  &--store {
    background: #1677ff;
    border-radius: 50%;
  }

  &--flow {
    background: #36cfc9;
    height: 2px;
  }

  &--hub {
    background: #faad14;
    border-radius: 50%;
  }
}
</style>
