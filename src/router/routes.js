const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '登录',
      layout: 'blank',
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardPage.vue'),
    meta: {
      title: '经营工作台',
      layout: 'admin',
      icon: 'Odometer',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

export default routes
