import {
  ALL_MENU_PATHS,
  PERMISSION_LABELS,
  ROLE_LABELS,
  resolveMenuPathsForRoles,
  resolvePermissionsForRoles,
} from '@/constants/permissions'

const MOCK_ACCOUNTS = [
  {
    username: 'admin',
    password: '123456',
    user: {
      id: 'u-001',
      username: 'admin',
      displayName: '张运营',
      avatarText: '运',
      roles: ['hq_admin'],
      roleLabel: ROLE_LABELS.hq_admin,
    },
    org: {
      brand: '味满鲜',
      region: '华东区',
      store: '全部门店',
    },
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
      roleLabel: ROLE_LABELS.region_manager,
    },
    org: {
      brand: '味满鲜',
      region: '华南区',
      store: '全部门店',
    },
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
      roleLabel: ROLE_LABELS.store_manager,
    },
    org: {
      brand: '味满鲜',
      region: '华东区',
      store: '上海南京路店',
    },
  },
]

function buildSession(account) {
  const permissions = resolvePermissionsForRoles(account.user.roles)
  const menuPaths = resolveMenuPathsForRoles(account.user.roles)
  return {
    user: account.user,
    org: account.org,
    permissions,
    menuPaths: menuPaths.length ? menuPaths : ALL_MENU_PATHS,
  }
}

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createToken(username) {
  return `mock-token-${username}-${Date.now()}`
}

export async function mockLogin(payload) {
  await delay()
  const account = MOCK_ACCOUNTS.find(
    (item) => item.username === payload.username && item.password === payload.password,
  )
  if (!account) {
    throw new Error('账号或密码错误')
  }
  const session = buildSession(account)
  return {
    token: createToken(account.username),
    ...session,
  }
}

export async function mockGetUserByToken(token) {
  await delay(200)
  const username = token.replace(/^mock-token-/, '').split('-')[0]
  const account = MOCK_ACCOUNTS.find((item) => item.username === username)
  if (!account) {
    return null
  }
  const session = buildSession(account)
  return {
    token,
    ...session,
  }
}

export function getPermissionLabels(codes = []) {
  return codes.map((code) => PERMISSION_LABELS[code] ?? code)
}
