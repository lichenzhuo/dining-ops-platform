<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { getDefaultHomePath } from '@/utils/menu'
import LoginBrandPanel from './components/LoginBrandPanel.vue'

const REMEMBER_USERNAME_KEY = 'dop-remember-username'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const loginMode = ref('account')

const form = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  remember: true,
})

const securityItems = [
  { icon: 'Key', label: 'SSO 单点登录' },
  { icon: 'Lock', label: 'RBAC 权限控制' },
  { icon: 'CircleCheck', label: '数据加密传输' },
  { icon: 'Document', label: '操作审计留痕' },
]

async function handleLogin() {
  loading.value = true
  try {
    await authStore.login(form.username, form.password)
    if (form.remember) {
      localStorage.setItem(REMEMBER_USERNAME_KEY, form.username)
    } else {
      localStorage.removeItem(REMEMBER_USERNAME_KEY)
    }
    ElMessage.success('登录成功')
    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : getDefaultHomePath(authStore.menuPaths)
    await router.replace(redirect)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const rememberedUsername = localStorage.getItem(REMEMBER_USERNAME_KEY)
  if (rememberedUsername) {
    form.username = rememberedUsername
    form.remember = true
  }
})
</script>

<template>
  <div class="login-page">
    <LoginBrandPanel />

    <section class="login-main">
      <div class="login-main__inner">
        <div class="login-card">
          <div class="login-card__head">
            <span class="login-card__mark">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="url(#cardGrad)" />
                <path
                  d="M10 12c0 4 2.6 6.5 6 6.5S22 16 22 12M16 18.5V23"
                  stroke="#fff"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <circle cx="16" cy="11" r="1.4" fill="#fff" />
                <defs>
                  <linearGradient id="cardGrad" x1="3" y1="3" x2="29" y2="29">
                    <stop stop-color="#36cfc9" />
                    <stop offset="1" stop-color="#13a8a8" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <div class="login-card__heading">
              <h2>欢迎登录</h2>
              <p>连锁餐饮经营与营销管理平台</p>
            </div>
          </div>

          <div class="login-card__tabs">
            <button
              type="button"
              class="login-tab"
              :class="{ 'login-tab--active': loginMode === 'account' }"
              @click="loginMode = 'account'"
            >
              账号登录
            </button>
            <button
              type="button"
              class="login-tab"
              :class="{ 'login-tab--active': loginMode === 'qrcode' }"
              @click="loginMode = 'qrcode'"
            >
              扫码登录
            </button>
          </div>

          <template v-if="loginMode === 'account'">
            <el-form :model="form" size="large" class="login-form" @submit.prevent="handleLogin">
              <el-form-item>
                <el-input v-model="form.username" placeholder="请输入账号 / 手机号">
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
                  <el-input v-model="form.captcha" placeholder="请输入验证码">
                    <template #prefix>
                      <el-icon><CircleCheck /></el-icon>
                    </template>
                  </el-input>
                  <button type="button" class="captcha-img" aria-label="刷新验证码">K8M3</button>
                </div>
              </el-form-item>

              <div class="login-options">
                <el-checkbox v-model="form.remember">记住账号</el-checkbox>
                <el-link type="primary" :underline="false">忘记密码？</el-link>
              </div>

              <el-button
                type="primary"
                class="login-submit"
                :loading="loading"
                native-type="submit"
              >
                登 录
              </el-button>

              <p class="login-hint">
                演示账号：admin / region / store，密码均为 123456（权限逐级收窄）
              </p>
            </el-form>
          </template>

          <template v-else>
            <div class="qrcode-panel">
              <div class="qrcode-box">
                <div class="qrcode-placeholder" />
              </div>
              <p>使用企业微信 / 钉钉扫码登录</p>
              <el-link type="primary" :underline="false">刷新二维码</el-link>
            </div>
          </template>
        </div>

        <ul class="security-bar">
          <li v-for="item in securityItems" :key="item.label">
            <el-icon><component :is="item.icon" /></el-icon>
            {{ item.label }}
          </li>
        </ul>

        <p class="login-copyright">© 2024-2026 味链云 · 连锁餐饮数字化运营管理平台 · 演示项目</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  min-height: 100vh;
  background: $bg-container;
}

.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 56px;
}

.login-main__inner {
  width: min(400px, 100%);
}

.login-card {
  padding: 8px 4px 0;
}

.login-card__head {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
}

.login-card__mark {
  display: flex;
  width: 44px;
  height: 44px;

  svg {
    width: 100%;
    height: 100%;
  }
}

.login-card__heading {
  h2 {
    margin: 0 0 4px;
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: $text-tertiary;
  }
}

.login-card__tabs {
  display: flex;
  gap: 28px;
  margin-bottom: 24px;
  border-bottom: 1px solid $border-light;
}

.login-tab {
  position: relative;
  padding: 0 0 12px;
  font-size: 15px;
  color: $text-tertiary;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &--active {
    font-weight: 600;
    color: $color-brand;

    &::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 2px;
      background: $color-brand;
      border-radius: 2px;
      content: '';
    }
  }
}

.login-form {
  :deep(.el-input__wrapper) {
    padding: 6px 14px;
    box-shadow: 0 0 0 1px $border-color inset;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }
}

.captcha-row {
  display: grid;
  grid-template-columns: 1fr 108px;
  gap: 12px;
  width: 100%;
}

.captcha-img {
  height: 42px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 3px;
  color: $color-brand-dark;
  background: linear-gradient(135deg, #e6fffb 0%, #f0f5ff 100%);
  border: 1px solid rgba(19, 194, 194, 0.35);
  border-radius: $radius-base;
  cursor: pointer;
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.login-submit {
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 4px;
  border-radius: $radius-base;
}

.login-hint {
  margin: 14px 0 0;
  font-size: 12px;
  color: $text-placeholder;
  text-align: center;
}

.qrcode-panel {
  padding: 12px 0 8px;
  text-align: center;

  p {
    margin: 16px 0 8px;
    color: $text-secondary;
  }
}

.qrcode-box {
  display: flex;
  justify-content: center;
}

.qrcode-placeholder {
  width: 180px;
  height: 180px;
  background:
    linear-gradient(45deg, #111 25%, transparent 25%) 0 0 / 12px 12px,
    linear-gradient(-45deg, #111 25%, transparent 25%) 0 0 / 12px 12px,
    linear-gradient(45deg, transparent 75%, #111 75%) 0 0 / 12px 12px,
    linear-gradient(-45deg, transparent 75%, #111 75%) 0 0 / 12px 12px,
    #fff;
  border: 8px solid #f2f4f7;
  border-radius: $radius-lg;
}

.security-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  justify-content: center;
  margin: 32px 0 0;
  padding: 20px 0 0;
  border-top: 1px solid $border-light;
  list-style: none;

  li {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    color: $text-tertiary;

    .el-icon {
      color: $color-brand;
    }
  }
}

.login-copyright {
  margin: 16px 0 0;
  font-size: 12px;
  color: $text-placeholder;
  text-align: center;
}

@media (max-width: 1024px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  :deep(.login-brand-panel) {
    display: none;
  }

  .login-main {
    padding: 32px 20px;
  }
}
</style>
