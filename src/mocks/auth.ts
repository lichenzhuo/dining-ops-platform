import type { LoginPayload, LoginResult, UserInfo, UserRole } from '@/types/auth'
import { adminMenuItems } from '@/router/menu'

interface MockAccount {
  username: string
  password: string
  user: UserInfo
  org: LoginResult['org']
  menuPaths: string[]
}

const ALL_MENU_PATHS = adminMenuItems.map((item) => item.path)

const REGION_MENU_PATHS = ALL_MENU_PATHS.filter(
  (path) => !['/settings', '/ai-coding', '/performance-lab'].includes(path),
)

const STORE_MENU_PATHS = [
  '/overview',
  '/dashboard',
  '/store-ops',
  '/order-reports',
  '/approval',
  '/large-screen',
]

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    username: 'admin',
    password: '123456',
    user: {
      id: 'u-001',
      username: 'admin',
      displayName: '张运营',
      avatarText: '运',
      roles: ['hq_admin'],
      roleLabel: '总部运营管理员',
    },
    org: {
      brand: '味满鲜',
      region: '华东区',
      store: '全部门店',
    },
    menuPaths: ALL_MENU_PATHS,
  },
  {
    username: 'region',
    password: '123456',
    user: {
      id: 'u-002',
      username: 'region',
      displayName: '李区域',
      avatarText: '区',
      roles: ['region_manager'],
      roleLabel: '区域运营经理',
    },
    org: {
      brand: '味满鲜',
      region: '华南区',
      store: '全部门店',
    },
    menuPaths: REGION_MENU_PATHS,
  },
  {
    username: 'store',
    password: '123456',
    user: {
      id: 'u-003',
      username: 'store',
      displayName: '王店长',
      avatarText: '店',
      roles: ['store_manager'],
      roleLabel: '门店店长',
    },
    org: {
      brand: '味满鲜',
      region: '华东区',
      store: '上海南京路店',
    },
    menuPaths: STORE_MENU_PATHS,
  },
]

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createToken(username: string) {
  return `mock-token-${username}-${Date.now()}`
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  await delay()
  const account = MOCK_ACCOUNTS.find(
    (item) => item.username === payload.username && item.password === payload.password,
  )
  if (!account) {
    throw new Error('账号或密码错误')
  }
  return {
    token: createToken(account.username),
    user: account.user,
    org: account.org,
    menuPaths: account.menuPaths,
  }
}

export async function mockGetUserByToken(token: string): Promise<LoginResult | null> {
  await delay(200)
  const username = token.replace(/^mock-token-/, '').split('-')[0]
  const account = MOCK_ACCOUNTS.find((item) => item.username === username)
  if (!account) {
    return null
  }
  return {
    token,
    user: account.user,
    org: account.org,
    menuPaths: account.menuPaths,
  }
}

export function getRolesForPath(path: string): UserRole[] | undefined {
  const restricted: Record<string, UserRole[]> = {
    '/settings': ['hq_admin'],
    '/ai-coding': ['hq_admin'],
    '/performance-lab': ['hq_admin', 'region_manager'],
  }
  return restricted[path]
}
