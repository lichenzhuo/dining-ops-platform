const MENU_PATHS = ['/dashboard', '/ai-agent', '/data-import', '/reports', '/geo-visualization', '/visualization-lab', '/workflow-designer', '/realtime-monitor', '/large-screen']

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
      roleLabel: '总部运营管理员',
    },
    org: {
      brand: '味满鲜',
      region: '华东区',
      store: '全部门店',
    },
    menuPaths: MENU_PATHS,
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
    menuPaths: MENU_PATHS,
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
    menuPaths: MENU_PATHS,
  },
]

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
  return {
    token: createToken(account.username),
    user: account.user,
    org: account.org,
    menuPaths: account.menuPaths,
  }
}

export async function mockGetUserByToken(token) {
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
