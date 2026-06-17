<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { PERMISSION_LABELS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { roleLabel, roles, menuPaths, permissions } = storeToRefs(authStore)

const permissionList = computed(() =>
  permissions.value.map((code) => PERMISSION_LABELS[code] ?? code),
)
</script>

<template>
  <section class="panel-card permission-panel">
    <div class="permission-panel__head">
      <h3>当前权限</h3>
      <el-tag size="small" type="success">RBAC</el-tag>
    </div>

    <dl class="permission-panel__meta">
      <div>
        <dt>角色</dt>
        <dd>{{ roleLabel }}</dd>
      </div>
      <div>
        <dt>角色码</dt>
        <dd>{{ roles.join('、') || '-' }}</dd>
      </div>
    </dl>

    <div class="permission-panel__block">
      <p>菜单权限（{{ menuPaths.length }}）</p>
      <div class="permission-panel__tags">
        <el-tag v-for="path in menuPaths" :key="path" size="small">{{ path }}</el-tag>
      </div>
    </div>

    <div class="permission-panel__block">
      <p>按钮权限（{{ permissions.length }}）</p>
      <div v-if="permissionList.length" class="permission-panel__tags">
        <el-tag v-for="item in permissionList" :key="item" size="small" type="info">{{ item }}</el-tag>
      </div>
      <el-empty v-else description="当前角色仅可查看，无操作权限" :image-size="48" />
    </div>

    <p class="permission-panel__hint">
      路由守卫控制页面访问 · 侧边菜单按 menuPaths 过滤 · 按钮通过 <code>v-permission</code> 控制
    </p>
  </section>
</template>

<style scoped lang="scss">
.permission-panel {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
    }
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 0 0 14px;

    div {
      padding: 10px 12px;
      background: $bg-page;
      border: 1px solid $border-light;
      border-radius: $radius-base;
    }

    dt {
      margin: 0;
      font-size: 11px;
      color: $text-tertiary;
    }

    dd {
      margin: 4px 0 0;
      font-size: 13px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  &__block {
    & + & {
      margin-top: 12px;
    }

    p {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__hint {
    margin: 14px 0 0;
    font-size: 11px;
    line-height: 1.6;
    color: $text-tertiary;

    code {
      font-size: 11px;
      color: $color-brand-dark;
    }
  }
}
</style>
