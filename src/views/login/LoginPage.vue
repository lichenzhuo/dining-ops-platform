<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
})

const securityItems = ['SSO 单点登录', 'RBAC 权限控制', '数据加密传输', '操作审计留痕']

async function handleLogin() {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 400))
  loading.value = false
  router.push('/dashboard')
}
</script>

<template>
  <div class="login-page">
    <section class="login-brand">
      <div class="brand-content">
        <p class="brand-badge">餐饮连锁 · 企业运营平台</p>
        <h1>{{ appStore.appName }}</h1>
        <p class="brand-desc">
          连接 POS、外卖、CRM、库存与财务数据，覆盖经营分析、报表下钻、大屏展示、AI 营销与门店执行闭环。
        </p>
        <ul class="brand-features">
          <li>
            <el-icon><TrendCharts /></el-icon>
            经营工作台与报表中心
          </li>
          <li>
            <el-icon><Monitor /></el-icon>
            经营指挥大屏与地图态势
          </li>
          <li>
            <el-icon><MagicStick /></el-icon>
            AI 营销 Agent 与审批下发
          </li>
        </ul>
      </div>
      <div class="brand-decoration">
        <div class="deco-card deco-card--1">营业额 +12.6%</div>
        <div class="deco-card deco-card--2">门店执行 86%</div>
        <div class="deco-card deco-card--3">AI 推荐动作 3 条</div>
      </div>
    </section>

    <section class="login-panel">
      <el-card class="login-card" shadow="never">
        <h2>账号登录</h2>
        <p class="login-subtitle">总部运营 · 区域管理 · 门店执行统一入口</p>
        <el-form :model="form" size="large" @submit.prevent="handleLogin">
          <el-form-item>
            <el-input v-model="form.username" placeholder="请输入账号">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="captcha-row">
              <el-input v-model="form.captcha" placeholder="验证码（演示可留空）" />
              <div class="captcha-box">A8K2</div>
            </div>
          </el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" native-type="submit">
            登录
          </el-button>
        </el-form>
        <div class="login-extra">
          <el-link type="primary" :underline="false">扫码登录</el-link>
          <el-link type="info" :underline="false">忘记密码</el-link>
        </div>
      </el-card>

      <ul class="security-list">
        <li v-for="item in securityItems" :key="item">
          <el-icon><CircleCheck /></el-icon>
          {{ item }}
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0faf8 0%, #eef4ff 48%, #f7fbff 100%);
}

.login-brand {
  position: relative;
  display: flex;
  align-items: center;
  padding: 48px 56px;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 1;
  max-width: 520px;
}

.brand-badge {
  display: inline-block;
  margin: 0 0 12px;
  padding: 4px 10px;
  font-size: 12px;
  color: $color-brand;
  background: rgba(19, 194, 194, 0.12);
  border-radius: 999px;
}

.brand-content h1 {
  margin: 0 0 16px;
  font-size: 34px;
  line-height: 1.25;
  color: $color-brand-dark;
}

.brand-desc {
  margin: 0 0 24px;
  color: $text-secondary;
  line-height: 1.7;
}

.brand-features {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: 8px;
    align-items: center;
    color: $text-primary;
    font-weight: 500;
  }
}

.brand-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-card {
  position: absolute;
  padding: 10px 14px;
  font-size: 13px;
  color: $color-brand-dark;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(19, 194, 194, 0.2);
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.deco-card--1 {
  top: 18%;
  right: 12%;
}

.deco-card--2 {
  top: 42%;
  right: 24%;
}

.deco-card--3 {
  bottom: 22%;
  right: 10%;
}

.login-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 48px 56px 48px 24px;
}

.login-card {
  border: 1px solid $border-color;
  border-radius: 12px;

  h2 {
    margin: 0 0 8px;
    font-size: 24px;
    color: $text-primary;
  }
}

.login-subtitle {
  margin: 0 0 24px;
  color: $text-secondary;
}

.captcha-row {
  display: grid;
  grid-template-columns: 1fr 96px;
  gap: 12px;
  width: 100%;
}

.captcha-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 2px;
  color: $color-brand-dark;
  background: #f0fffe;
  border: 1px dashed rgba(19, 194, 194, 0.45);
  border-radius: $radius-base;
  user-select: none;
}

.login-btn {
  width: 100%;
  margin-top: 4px;
}

.login-extra {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.security-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin: 0;
  padding: 0 4px;
  list-style: none;

  li {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    color: $text-secondary;
  }
}

@media (max-width: 960px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-brand {
    display: none;
  }

  .login-panel {
    padding: 32px 20px;
  }
}
</style>
