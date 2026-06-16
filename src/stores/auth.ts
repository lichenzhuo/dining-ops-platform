import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { OrgContext, UserInfo, UserRole } from '@/types/auth'
import { fetchSessionByToken, login as loginRequest } from '@/services/auth'

const defaultOrg: OrgContext = {
  brand: '味满鲜',
  region: '华东区',
  store: '全部门店',
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null)
    const user = ref<UserInfo | null>(null)
    const org = ref<OrgContext>({ ...defaultOrg })
    const menuPaths = ref<string[]>([])
    const sessionReady = ref(false)

    const isLoggedIn = computed(() => Boolean(token.value && user.value))
    const displayName = computed(() => user.value?.displayName ?? '')
    const roleLabel = computed(() => user.value?.roleLabel ?? '')
    const avatarText = computed(() => user.value?.avatarText ?? '访')
    const roles = computed(() => user.value?.roles ?? [])

    function applySession(result: {
      token: string
      user: UserInfo
      org: OrgContext
      menuPaths: string[]
    }) {
      token.value = result.token
      user.value = result.user
      org.value = result.org
      menuPaths.value = result.menuPaths
    }

    async function login(username: string, password: string) {
      const result = await loginRequest({ username, password })
      applySession(result)
      return result
    }

    async function restoreSession() {
      if (!token.value) {
        sessionReady.value = true
        return false
      }
      if (user.value && menuPaths.value.length > 0) {
        sessionReady.value = true
        return true
      }
      const result = await fetchSessionByToken(token.value)
      if (!result) {
        logout()
        sessionReady.value = true
        return false
      }
      applySession(result)
      sessionReady.value = true
      return true
    }

    function logout() {
      token.value = null
      user.value = null
      org.value = { ...defaultOrg }
      menuPaths.value = []
      sessionReady.value = true
    }

    function hasRole(role: UserRole) {
      return roles.value.includes(role)
    }

    function hasAnyRole(requiredRoles?: UserRole[]) {
      if (!requiredRoles?.length) {
        return true
      }
      return requiredRoles.some((role) => hasRole(role))
    }

    function canAccessPath(path: string) {
      return menuPaths.value.includes(path)
    }

    function updateOrg(partial: Partial<OrgContext>) {
      org.value = { ...org.value, ...partial }
    }

    return {
      token,
      user,
      org,
      menuPaths,
      sessionReady,
      isLoggedIn,
      displayName,
      roleLabel,
      avatarText,
      roles,
      login,
      restoreSession,
      logout,
      hasRole,
      hasAnyRole,
      canAccessPath,
      updateOrg,
    }
  },
  {
    persist: {
      key: 'dop-auth',
      pick: ['token', 'user', 'org', 'menuPaths'],
    },
  },
)
