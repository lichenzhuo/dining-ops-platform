/** 用户角色编码，与菜单 / 路由 meta.roles 对齐 */
export type UserRole = 'hq_admin' | 'region_manager' | 'store_manager'

export interface UserInfo {
  id: string
  username: string
  displayName: string
  avatarText: string
  roles: UserRole[]
  roleLabel: string
}

export interface OrgContext {
  brand: string
  region: string
  store: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserInfo
  org: OrgContext
  menuPaths: string[]
}

export interface AuthPersistedState {
  token: string | null
  user: UserInfo | null
  org: OrgContext
  menuPaths: string[]
}
