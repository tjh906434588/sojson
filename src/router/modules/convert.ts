// 转换工具菜单路由模块
// 本模块为 convert 一级菜单的「唯一事实来源」：路径常量、路由配置、落地页卡片、NavBar 菜单
import type { RouteRecordRaw } from 'vue-router'
import { Switch } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'

// —— 路径定义 ——
export const ROUTE_CONVERT = '/convert'
export const ROUTE_CASE_CONVERT = '/convert/case-convert'

// —— 路由配置 ——
export const convertRoutes: RouteRecordRaw[] = [
  { path: ROUTE_CONVERT, name: 'ConvertTools', component: () => import('../../views/convert/index.vue') },
  { path: ROUTE_CASE_CONVERT, name: 'CaseConvert', component: () => import('../../views/convert/CaseConvert/index.vue') }
]

// —— 落地页入口卡片 ——
export const convertToolCards: ToolItem[] = [
  { path: ROUTE_CASE_CONVERT, icon: 'EditPen', title: 'menu.caseConvert', desc: 'tools.caseConvert.description', color: '#409eff' }
]

// —— NavBar 一级菜单 ——
export const convertMenu: NavMenuGroup = {
  key: 'convert',
  title: 'menu.convert',
  icon: Switch,
  link: ROUTE_CONVERT,
  prefix: ROUTE_CONVERT,
  hidden: false,
  items: convertToolCards.map((c) => ({ path: c.path, label: c.title }))
}
