<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const moduleEntries = [
  { title: '经营工作台', path: '/dashboard', desc: '日常运营首页，KPI / 趋势 / 异常' },
  { title: '报表中心', path: '/reports', desc: '原生 Vue 报表，字段配置与下钻' },
  { title: '经营指挥大屏', path: '/large-screen', desc: '深色全屏投屏展示' },
  { title: 'AI 营销 Agent', path: '/ai-agent', desc: '生成方案、审批、下发门店' },
  { title: '审批中心', path: '/approval', desc: '营销动作与素材审批' },
  { title: '数据导入', path: '/data-import', desc: 'POS / 外卖 / CRM 数据接入' },
]

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="overview-page page-container">
    <el-card shadow="never" class="page-card intro-card">
      <div class="intro-header">
        <div>
          <h2>{{ appStore.appName }}</h2>
          <p>能力地图与业务闭环入口 · Phase 2 多布局路由已就绪</p>
        </div>
        <el-tag type="success">AdminLayout</el-tag>
      </div>
    </el-card>

    <el-row :gutter="16">
      <el-col v-for="item in moduleEntries" :key="item.path" :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="module-card" @click="navigate(item.path)">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <el-button link type="primary">进入模块</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.overview-page {
  display: grid;
  gap: 16px;
}

.intro-card {
  border: 1px solid $border-color;
}

.intro-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  h2 {
    margin: 0 0 8px;
    font-size: 20px;
    color: $text-primary;
  }

  p {
    margin: 0;
    color: $text-secondary;
  }
}

.module-card {
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid $border-color;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(19, 194, 194, 0.45);
  }

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    color: $text-primary;
  }

  p {
    margin: 0 0 12px;
    min-height: 44px;
    color: $text-secondary;
    line-height: 1.6;
  }
}
</style>
