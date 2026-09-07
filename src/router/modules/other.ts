// 其他工具菜单路由模块
// 本模块为 other 一级菜单的「唯一事实来源」：路径常量、路由配置、落地页卡片、NavBar 菜单
import type { RouteRecordRaw } from 'vue-router'
import { MoreFilled } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'

// —— 路径定义 ——
export const ROUTE_OTHER = '/other'
export const ROUTE_FEEDBACK = '/other/feedback'

// —— 路由配置 ——
export const otherRoutes: RouteRecordRaw[] = [
  { path: ROUTE_OTHER, name: 'OtherTools', component: () => import('../../views/other/index.vue') },
  { path: ROUTE_FEEDBACK, name: 'Feedback', component: () => import('../../views/other/Feedback/index.vue') }
]

// —— 落地页入口卡片 ——
export const otherToolCards: ToolItem[] = [
  { path: ROUTE_FEEDBACK, icon: 'ChatDotRound', title: 'menu.feedback', desc: 'tools.feedback.description', color: '#909399' }
]

// —— NavBar 一级菜单 ——
export const otherMenu: NavMenuGroup = {
  key: 'other',
  title: 'menu.otherTools',
  icon: MoreFilled,
  link: ROUTE_OTHER,
  prefix: ROUTE_OTHER,
  hidden: false,
  items: otherToolCards.map((c) => ({ path: c.path, label: c.title }))
}
