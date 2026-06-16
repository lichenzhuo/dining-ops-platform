import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    layout?: 'admin' | 'screen' | 'blank'
    requiresAuth?: boolean
    roles?: string[]
    keepAlive?: boolean
  }
}
