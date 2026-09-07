// 压缩格式化工具菜单路由模块
// 本模块为 compress 一级菜单的「唯一事实来源」：路径常量、路由配置、落地页卡片、NavBar 菜单
import type { RouteRecordRaw } from 'vue-router'
import { Operation } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'

// —— 路径定义 ——
export const ROUTE_COMPRESS = '/compress'
export const ROUTE_JS_HTML_FORMAT = '/compress/js-html-format'

// —— 路由配置 ——
export const compressRoutes: RouteRecordRaw[] = [
  { path: ROUTE_COMPRESS, name: 'CompressTools', component: () => import('../../views/compress/index.vue') },
  { path: ROUTE_JS_HTML_FORMAT, name: 'JsHtmlFormat', component: () => import('../../views/compress/JsHtmlFormat/index.vue') }
]

// —— 落地页入口卡片 ——
export const compressToolCards: ToolItem[] = [
  { path: ROUTE_JS_HTML_FORMAT, icon: 'Operation', title: 'menu.jsHtmlFormat', desc: 'tools.jsHtmlFormat.description', color: '#e6a23c' }
]

// —— NavBar 一级菜单 ——
export const compressMenu: NavMenuGroup = {
  key: 'compress',
  title: 'menu.compressFormat',
  icon: Operation,
  link: ROUTE_COMPRESS,
  prefix: ROUTE_COMPRESS,
  hidden: false,
  items: compressToolCards.map((c) => ({ path: c.path, label: c.title }))
}
