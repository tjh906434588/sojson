// 前端工具菜单路由模块
// 本模块为 frontend 一级菜单的「唯一事实来源」：路径常量、路由配置、落地页卡片、NavBar 菜单
import type { RouteRecordRaw } from 'vue-router'
import { Monitor } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'

// —— 路径定义 ——
export const ROUTE_FRONTEND = '/frontend'
export const ROUTE_WEB_COLORS = '/frontend/web-colors'

// —— 路由配置 ——
export const frontendRoutes: RouteRecordRaw[] = [
  { path: ROUTE_FRONTEND, name: 'FrontendTools', component: () => import('../../views/frontend/index.vue') },
  { path: ROUTE_WEB_COLORS, name: 'WebColors', component: () => import('../../views/frontend/WebColors/index.vue') }
]

// —— 落地页入口卡片 ——
export const frontendToolCards: ToolItem[] = [
  { path: ROUTE_WEB_COLORS, icon: 'Brush', title: 'menu.webColors', desc: 'tools.webColors.description', color: '#67c23a' }
]

// —— NavBar 一级菜单 ——
export const frontendMenu: NavMenuGroup = {
  key: 'frontend',
  title: 'menu.frontend',
  icon: Monitor,
  link: ROUTE_FRONTEND,
  prefix: ROUTE_FRONTEND,
  hidden: false,
  items: frontendToolCards.map((c) => ({ path: c.path, label: c.title }))
}
