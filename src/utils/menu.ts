import type { MenuGroup } from '@/router/menu'
import { adminMenuGroups } from '@/router/menu'

export function filterMenuGroups(menuPaths: string[]): MenuGroup[] {
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

export function getDefaultHomePath(menuPaths: string[]): string {
  const priority = ['/overview', '/dashboard']
  for (const path of priority) {
    if (menuPaths.includes(path)) {
      return path
    }
  }
  return menuPaths[0] ?? '/login'
}
