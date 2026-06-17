<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { GEO_REGION_CENTERS } from '@/constants/geo3d'
import { useGeoStore } from '@/stores/geo'
import CesiumGeoScene from '@/visualization/cesium/CesiumGeoScene.vue'
import ThreeStoreCardScene from '@/visualization/three/ThreeStoreCardScene.vue'

const router = useRouter()
const geoStore = useGeoStore()
const cesiumRef = ref()
const selectedStore = ref(null)

const { data, loading, error } = storeToRefs(geoStore)

const cesiumData = computed(() => {
  if (!data.value) {
    return null
  }
  return {
    ...data.value,
    regionCenters: GEO_REGION_CENTERS,
  }
})

onMounted(() => {
  geoStore.loadGeoData()
})

async function handleRefresh() {
  await geoStore.loadGeoData()
  if (!error.value) {
    ElMessage.success('3D 态势已刷新')
  }
}

function handleStoreClick(store) {
  selectedStore.value = store
}

function handleRegionClick(region) {
  router.push({
    path: '/reports',
    query: {
      report: 'store',
      keyword: region.name?.replace(/省|市/g, ''),
    },
  })
}

function handleOpenReport() {
  if (!selectedStore.value) {
    return
  }
  router.push({
    path: '/reports',
    query: {
      report: 'store',
      drillStore: selectedStore.value.name,
    },
  })
}
</script>

<template>
  <div class="geo-3d-page">
    <header class="geo-3d-page__header">
      <div>
        <h2>3D 地理态势</h2>
        <p>Cesium 3D 地球 · 区域柱状体 · 门店点位聚合 · 订单飞线 · Three.js 3D 指标卡 Demo</p>
      </div>
      <div class="geo-3d-page__actions">
        <el-button @click="router.push('/geo-visualization')">返回 ECharts 地图</el-button>
        <el-button @click="cesiumRef?.resetCamera()">重置视角</el-button>
        <el-button type="primary" :loading="loading" @click="handleRefresh">刷新</el-button>
      </div>
    </header>

    <el-alert
      v-if="error"
      type="error"
      :title="error"
      show-icon
      :closable="false"
    />

    <section v-if="cesiumData" class="geo-3d-page__layout">
      <div class="geo-3d-page__map panel-card">
        <CesiumGeoScene
          ref="cesiumRef"
          :geo-data="cesiumData"
          :loading="loading"
          @store-click="handleStoreClick"
          @region-click="handleRegionClick"
          @clear-selection="selectedStore = null"
        />
      </div>

      <aside class="geo-3d-page__aside">
        <section class="panel-card">
          <h3>Three.js 3D 指标卡</h3>
          <p class="panel-card__desc">WebGL 场景 · 几何体 · 材质 · 光照 · 动画 · 资源释放</p>
          <ThreeStoreCardScene />
        </section>

        <section class="panel-card">
          <h3>门店经营浮层</h3>
          <el-empty v-if="!selectedStore" description="点击 3D 地图中的门店点位" :image-size="64" />
          <div v-else class="store-panel">
            <h4>{{ selectedStore.name }}</h4>
            <p>{{ selectedStore.province }}</p>
            <ul>
              <li><span>营业额</span><strong>{{ selectedStore.revenue }}</strong></li>
              <li><span>订单量</span><strong>{{ selectedStore.orders }}</strong></li>
            </ul>
            <el-button type="primary" @click="handleOpenReport">下钻报表中心</el-button>
          </div>
        </section>

        <section class="panel-card">
          <h3>技术说明</h3>
          <ul class="tech-notes">
            <li>Cesium：Entity + 点位聚合 + 3D 柱状体 + 飞线</li>
            <li>Three.js：独立 3D 场景，不影响后台页面性能</li>
            <li>与 ECharts 2D 地图互补，服务高级地理可视化</li>
          </ul>
        </section>
      </aside>
    </section>
  </div>
</template>

<style scoped lang="scss">
.geo-3d-page {
  display: grid;
  gap: 16px;

  &__header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    h2 {
      margin: 0;
      font-size: 22px;
    }

    p {
      margin: 6px 0 0;
      font-size: 13px;
      color: $text-tertiary;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 16px;
  }

  &__map {
    padding: 12px;
    min-height: 644px;
  }

  &__aside {
    display: grid;
    gap: 16px;
    align-content: start;
  }
}

.panel-card {
  padding: 16px 18px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;

  h3 {
    margin: 0 0 8px;
    font-size: 15px;
  }

  &__desc {
    margin: 0 0 12px;
    font-size: 12px;
    color: $text-tertiary;
  }
}

.store-panel {
  h4 {
    margin: 0 0 4px;
    font-size: 16px;
  }

  p {
    margin: 0 0 12px;
    font-size: 12px;
    color: $text-tertiary;
  }

  ul {
    margin: 0 0 14px;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
    border-bottom: 1px dashed $border-light;
  }

  span {
    color: $text-secondary;
  }
}

.tech-notes {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.8;
  color: $text-secondary;
}

@media (max-width: 1200px) {
  .geo-3d-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
