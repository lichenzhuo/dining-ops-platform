<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { GeoMapChart } from '@/charts'
import { useGeoStore } from '@/stores/geo'

const router = useRouter()
const geoStore = useGeoStore()
const { data, loading, error } = storeToRefs(geoStore)

onMounted(() => {
  geoStore.loadGeoData()
})

async function handleRefresh() {
  await geoStore.loadGeoData()
  if (!error.value) {
    ElMessage.success('地图态势已刷新')
  }
}

function handleRegionClick(payload) {
  router.push({
    path: '/reports',
    query: {
      report: 'store',
      keyword: payload.name?.replace(/省|市/g, ''),
    },
  })
}

function handleStoreClick(payload) {
  router.push({
    path: '/reports',
    query: {
      report: 'store',
      drillStore: payload.name,
    },
  })
}
</script>

<template>
  <div v-loading="loading" class="geo-page">
    <header class="geo-page__header">
      <div>
        <h2>地图态势分析</h2>
        <p>ECharts + GeoJSON · 区域热力 · 门店点位 · 订单飞线 · 点击下钻报表</p>
      </div>
      <div class="geo-page__actions">
        <el-button @click="router.push('/geo-3d')">3D 地理态势</el-button>
        <el-button type="primary" :loading="loading" @click="handleRefresh">刷新</el-button>
        <el-button @click="router.push('/large-screen')">打开经营大屏</el-button>
      </div>
    </header>

    <el-alert
      v-if="error"
      type="error"
      :title="error"
      show-icon
      :closable="false"
      class="geo-page__error"
    />

    <section v-if="data" class="geo-page__content">
      <div class="geo-page__map panel-card">
        <GeoMapChart
          theme="light"
          :center="[119.5, 31.2]"
          :zoom="3.3"
          roam
          :regions="data.regions"
          :stores="data.stores"
          :hub="data.hub"
          :loading="loading"
          height="620px"
          @region-click="handleRegionClick"
          @store-click="handleStoreClick"
        />
      </div>

      <aside class="geo-page__aside">
        <section class="panel-card">
          <h3>态势摘要</h3>
          <ul class="geo-page__summary">
            <li><span>覆盖省份</span><strong>{{ data.summary.provinceCount }}</strong></li>
            <li><span>门店点位</span><strong>{{ data.summary.storeCount }}</strong></li>
            <li><span>区域营业额指数</span><strong>{{ data.summary.totalRevenue }}</strong></li>
          </ul>
        </section>

        <section class="panel-card">
          <h3>省份热力</h3>
          <ul class="geo-page__list">
            <li v-for="item in data.regions" :key="item.name">
              <button type="button" class="geo-page__link" @click="handleRegionClick(item)">
                {{ item.name }}
              </button>
              <span>{{ item.value.toLocaleString('zh-CN') }}</span>
            </li>
          </ul>
        </section>

        <section class="panel-card">
          <h3>门店点位</h3>
          <ul class="geo-page__list geo-page__list--stores">
            <li v-for="item in data.stores" :key="item.name">
              <button type="button" class="geo-page__link" @click="handleStoreClick(item)">
                {{ item.name }}
              </button>
              <span>{{ item.province }}</span>
              <em>{{ item.revenue }}</em>
            </li>
          </ul>
        </section>
      </aside>
    </section>
  </div>
</template>

<style scoped lang="scss">
.geo-page {
  display: grid;
  gap: 16px;
  min-height: 640px;

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

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 16px;
  }

  &__map {
    min-height: 620px;
    padding: 12px;
  }

  &__aside {
    display: grid;
    gap: 16px;
    align-content: start;
  }

  &__summary,
  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__summary li,
  &__list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 0;
    font-size: 13px;
    border-bottom: 1px dashed $border-light;
  }

  &__summary span,
  &__list span {
    color: $text-secondary;
  }

  &__list--stores li {
    flex-wrap: wrap;
  }

  &__list em {
    width: 100%;
    font-style: normal;
    font-size: 12px;
    color: $text-tertiary;
  }

  &__link {
    padding: 0;
    font: inherit;
    color: $color-primary;
    text-align: left;
    cursor: pointer;
    background: none;
    border: none;
  }
}

.panel-card {
  padding: 16px 18px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;

  h3 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

@media (max-width: 1100px) {
  .geo-page__content {
    grid-template-columns: 1fr;
  }
}
</style>
