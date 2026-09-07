// 首页路由模块
import type { RouteRecordRaw } from 'vue-router'

// 首页路径（唯一来源，业务侧从这里引入）
export const ROUTE_HOME = '/'

// 首页路由
export const homeRoutes: RouteRecordRaw[] = [
  { path: ROUTE_HOME, name: 'Home', component: () => import('../../views/Home.vue') }
]
