import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchSessionByToken, login as loginRequest } from '@/services/auth'

const defaultOrg = {
  brand: '味满鲜',
  region: '华东区',
  store: '全部门店',
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null)
    const user = ref(null)
    const org = ref({ ...defaultOrg })
    const menuPaths = ref([])
    const permissions = ref([])
    const sessionReady = ref(false)

    const isLoggedIn = computed(() => Boolean(token.value && user.value))
    const displayName = computed(() => user.value?.displayName ?? '')
    const roleLabel = computed(() => user.value?.roleLabel ?? '')
    const avatarText = computed(() => user.value?.avatarText ?? '访')
    const roles = computed(() => user.value?.roles ?? [])

    function applySession(result) {
      token.value = result.token
      user.value = result.user
      org.value = result.org
      menuPaths.value = result.menuPaths
      permissions.value = result.permissions ?? []
    }

    async function login(username, password) {
      const result = await loginRequest({ username, password })
      applySession(result)
      return result
    }

    async function restoreSession() {
      if (!token.value) {
        sessionReady.value = true
        return false
      }
      if (user.value && menuPaths.value.length > 0 && permissions.value.length > 0) {
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
      permissions.value = []
      sessionReady.value = true
    }

    function hasPermission(code) {
      if (!code) {
        return true
      }
      return permissions.value.includes(code)
    }

    function hasAnyPermission(codes = []) {
      if (!codes.length) {
        return true
      }
      return codes.some((code) => hasPermission(code))
    }

    function hasRole(role) {
      return roles.value.includes(role)
    }

    function hasAnyRole(requiredRoles) {
      if (!requiredRoles?.length) {
        return true
      }
      return requiredRoles.some((role) => hasRole(role))
    }

    function canAccessPath(path) {
      return menuPaths.value.includes(path)
    }

    function updateOrg(partial) {
      org.value = { ...org.value, ...partial }
    }

    return {
      token,
      user,
      org,
      menuPaths,
      permissions,
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
      hasPermission,
      hasAnyPermission,
      updateOrg,
    }
  },
  {
    persist: {
      key: 'dop-auth',
      pick: ['token', 'user', 'org', 'menuPaths', 'permissions'],
    },
  },
)
