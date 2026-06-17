<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useLargeScreenStore } from '@/stores/largeScreen'
import { useRealtimeStore } from '@/stores/realtime'
import { CanvasParticleLayer } from '@/visualization'
import { useFullscreen } from './composables/useFullscreen'
import { useScreenScale } from './composables/useScreenScale'
import ScreenHeader from './components/ScreenHeader.vue'
import ScreenKpiBar from './components/ScreenKpiBar.vue'
import ScreenLeftPanel from './components/ScreenLeftPanel.vue'
import ScreenMapPanel from './components/ScreenMapPanel.vue'
import ScreenOrderTicker from './components/ScreenOrderTicker.vue'
import ScreenRightPanel from './components/ScreenRightPanel.vue'
import ScreenSvgPipelineBar from './components/ScreenSvgPipelineBar.vue'
import ScreenTrendPanel from './components/ScreenTrendPanel.vue'

const router = useRouter()
const authStore = useAuthStore()
const largeScreenStore = useLargeScreenStore()
const realtimeStore = useRealtimeStore()
const viewportRef = ref()
const { stageStyle } = useScreenScale()
const { isFullscreen, toggleFullscreen } = useFullscreen(viewportRef)

const { data, loading, error } = storeToRefs(largeScreenStore)
const { orders, unreadAlertCount } = storeToRefs(realtimeStore)

const stageInlineStyle = computed(() => stageStyle())

const screenAlertCount = computed(
  () => (data.value?.alertCount ?? 0) + unreadAlertCount.value,
)

onMounted(async () => {
  await largeScreenStore.loadScreen()
  largeScreenStore.startAutoRefresh()
})

onUnmounted(() => {
  largeScreenStore.stopAutoRefresh()
})

function handleExit() {
  router.push('/dashboard')
}

function handleOpenReport(payload = {}) {
  router.push({
    path: '/reports',
    query: {
      report: payload.report ?? 'store',
      drillStore: payload.drillStore || undefined,
      keyword: payload.keyword || undefined,
    },
  })
}
</script>

<template>
  <div ref="viewportRef" class="large-screen-viewport">
    <CanvasParticleLayer :density="56" />
    <div class="large-screen-bg" />
    <div class="large-screen-glow large-screen-glow--left" />
    <div class="large-screen-glow large-screen-glow--right" />

    <div class="large-screen-stage" :style="stageInlineStyle">
      <ScreenHeader
        :brand="authStore.org.brand"
        :region="authStore.org.region"
        :sync-time="data?.syncTime ?? '-'"
        :health-status="data?.healthStatus ?? 'healthy'"
        :alert-count="screenAlertCount"
        :is-fullscreen="isFullscreen"
        @toggle-fullscreen="toggleFullscreen"
        @exit="handleExit"
      />

      <el-alert
        v-if="error"
        type="error"
        :title="error"
        show-icon
        :closable="false"
        class="large-screen-error"
      />

      <template v-if="data">
        <ScreenKpiBar :items="data.kpis" />
        <ScreenOrderTicker :orders="orders" />

        <section class="large-screen-body">
          <ScreenLeftPanel
            :diagnosis="data.diagnosis"
            :left-alerts="data.leftAlerts"
            @open-report="handleOpenReport"
          />

          <div class="large-screen-center">
            <ScreenMapPanel
              :map="data.map"
              :loading="loading"
              @open-report="handleOpenReport"
            />
            <ScreenTrendPanel :trend="data.trend" :loading="loading" />
          </div>

          <ScreenRightPanel :right-panel="data.rightPanel" @open-report="handleOpenReport" />
        </section>

        <ScreenSvgPipelineBar :items="data.pipeline" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.large-screen-viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: $screen-bg;
}

.large-screen-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(19, 194, 194, 0.12), transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(22, 119, 255, 0.1), transparent 28%),
    linear-gradient(180deg, #071426 0%, #04101f 100%);
}

.large-screen-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  pointer-events: none;
  filter: blur(80px);
  border-radius: 50%;

  &--left {
    top: 10%;
    left: -120px;
    background: rgba(19, 194, 194, 0.12);
  }

  &--right {
    right: -120px;
    bottom: 8%;
    background: rgba(22, 119, 255, 0.1);
  }
}

.large-screen-stage {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-rows: 72px 96px 40px 1fr 88px;
  gap: 10px;
  padding: 12px 18px;
  color: $screen-text-primary;
}

.large-screen-error {
  grid-row: 2 / 3;
}

.large-screen-body {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr) 360px;
  gap: 10px;
  min-height: 0;
}

.large-screen-center {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 220px;
  gap: 10px;
  min-height: 0;
}
</style>
