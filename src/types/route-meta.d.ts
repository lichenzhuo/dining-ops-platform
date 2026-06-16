import type { UserRole } from '@/types/auth'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    layout?: 'admin' | 'screen' | 'blank'
    requiresAuth?: boolean
    roles?: UserRole[]
    keepAlive?: boolean
  }
}
