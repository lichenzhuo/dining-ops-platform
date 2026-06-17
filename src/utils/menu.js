import { adminMenuGroups } from '@/router/menu'

export function filterMenuGroups(menuPaths) {
  if (menuPaths.length === 0) {
    return []
  }
  const allowed = new Set(menuPaths)
  return adminMenuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => allowed.has(item.path)),
    }))
    .filter((group) => group.items.length > 0)
}

export function getDefaultHomePath(menuPaths) {
  if (menuPaths.includes('/dashboard')) {
    return '/dashboard'
  }
  return menuPaths[0] ?? '/login'
}
