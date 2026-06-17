import { useAuthStore } from '@/stores/auth'

function checkPermission(el, binding) {
  const auth = useAuthStore()
  const value = binding.value

  let allowed = true
  if (Array.isArray(value)) {
    allowed = value.some((code) => auth.hasPermission(code))
  } else if (typeof value === 'string') {
    allowed = auth.hasPermission(value)
  }

  el.style.display = allowed ? '' : 'none'
}

export const permissionDirective = {
  mounted: checkPermission,
  updated: checkPermission,
}

export function setupPermissionDirective(app) {
  app.directive('permission', permissionDirective)
}
