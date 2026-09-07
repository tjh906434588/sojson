// 文档工具菜单路由模块
// 本模块为 document 一级菜单的「唯一事实来源」：路径常量、路由配置、落地页卡片、NavBar 菜单
import type { RouteRecordRaw } from 'vue-router'
import { Document } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'

// —— 路径定义 ——
export const ROUTE_DOCUMENT = '/document'
export const ROUTE_MIME_TYPE = '/document/mime-type'
export const ROUTE_HTML_ESCAPE = '/document/html-escape'
export const ROUTE_RGB_COLOR = '/document/rgb-color'
export const ROUTE_PUBLIC_DNS = '/document/public-dns'

// —— 路由配置 ——
export const documentRoutes: RouteRecordRaw[] = [
  { path: ROUTE_DOCUMENT, name: 'DocumentTools', component: () => import('../../views/document/index.vue') },
  { path: ROUTE_MIME_TYPE, name: 'MimeType', component: () => import('../../views/document/MimeType/index.vue') },
  { path: ROUTE_HTML_ESCAPE, name: 'HtmlEscape', component: () => import('../../views/document/HtmlEscape/index.vue') },
  { path: ROUTE_RGB_COLOR, name: 'RgbColor', component: () => import('../../views/document/RgbColor/index.vue') },
  { path: ROUTE_PUBLIC_DNS, name: 'PublicDns', component: () => import('../../views/document/PublicDns/index.vue') }
]

// —— 落地页入口卡片 ——
export const documentToolCards: ToolItem[] = [
  { path: ROUTE_MIME_TYPE, icon: 'Document', title: 'menu.mimeType', desc: 'tools.mimeType.description', color: '#409eff' },
  { path: ROUTE_HTML_ESCAPE, icon: 'EditPen', title: 'menu.htmlEscape', desc: 'tools.htmlEscape.description', color: '#67c23a' },
  { path: ROUTE_RGB_COLOR, icon: 'MagicStick', title: 'menu.rgbColor', desc: 'tools.rgbColor.description', color: '#f56c6c' },
  { path: ROUTE_PUBLIC_DNS, icon: 'Connection', title: 'menu.publicDns', desc: 'tools.publicDns.description', color: '#e6a23c' }
]

// —— NavBar 一级菜单 ——
export const documentMenu: NavMenuGroup = {
  key: 'documents',
  title: 'menu.documents',
  icon: Document,
  link: ROUTE_DOCUMENT,
  prefix: ROUTE_DOCUMENT,
  hidden: false,
  items: documentToolCards.map((c) => ({ path: c.path, label: c.title }))
}
