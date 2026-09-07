// JSON 工具菜单路由模块
// 本模块为 json 一级菜单的「唯一事实来源」：路径常量、路由配置、落地页卡片、NavBar 菜单
// 业务侧（NavBar、落地页、跳转等）一律从这里引入，禁止在业务代码中硬编码路径
import type { RouteRecordRaw } from 'vue-router'
import { Tools } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'
import { ROUTE_HOME } from './home'

// —— 路径定义 ——
export const ROUTE_JSON = '/json'
export const ROUTE_JSON_PARSE = '/json/json-parse'
export const ROUTE_JSON_ONLINE_PARSE = '/json/json-online-parse'
export const ROUTE_JSON_COMPRESS_ESCAPE = '/json/json-compress-escape'
export const ROUTE_JSON_ONLINE_VIEW = '/json/json-online-view'
export const ROUTE_JSON_COLOR = '/json/json-color'
export const ROUTE_JSON_XML = '/json/json-xml'
export const ROUTE_JSON_COMPARE = '/json/json-compare'
export const ROUTE_JSON_ENTITY = '/json/json-entity'
export const ROUTE_JSON_EXCEL = '/json/json-excel'

// —— 路由配置 ——
export const jsonRoutes: RouteRecordRaw[] = [
  { path: ROUTE_JSON, name: 'JsonTools', component: () => import('../../views/json/index.vue') },
  { path: ROUTE_JSON_PARSE, name: 'JsonParse', component: () => import('../../views/json/JsonParse/index.vue') },
  { path: ROUTE_JSON_ONLINE_PARSE, name: 'JsonOnlineParse', component: () => import('../../views/json/JsonOnlineParse/index.vue') },
  { path: ROUTE_JSON_COMPRESS_ESCAPE, name: 'JsonCompressEscape', component: () => import('../../views/json/JsonCompressEscape/index.vue') },
  { path: ROUTE_JSON_ONLINE_VIEW, name: 'JsonOnlineView', component: () => import('../../views/json/JsonOnlineView/index.vue') },
  { path: ROUTE_JSON_COLOR, name: 'JsonColor', component: () => import('../../views/json/JsonColor/index.vue') },
  { path: ROUTE_JSON_XML, name: 'JsonXml', component: () => import('../../views/json/JsonXml/index.vue') },
  { path: ROUTE_JSON_COMPARE, name: 'JsonCompare', component: () => import('../../views/json/JsonCompare/index.vue') },
  { path: ROUTE_JSON_ENTITY, name: 'JsonEntity', component: () => import('../../views/json/JsonEntity/index.vue') },
  { path: ROUTE_JSON_EXCEL, name: 'JsonExcel', component: () => import('../../views/json/JsonExcel/index.vue') }
]

// —— 落地页入口卡片 ——
export const jsonToolCards: ToolItem[] = [
  { path: ROUTE_JSON_PARSE, icon: 'EditPen', title: 'menu.jsonParse', desc: 'tools.jsonParser.description', color: '#409eff' },
  { path: ROUTE_JSON_ONLINE_PARSE, icon: 'DataAnalysis', title: 'menu.jsonOnlineParse', desc: 'tools.jsonOnlineParse.description', color: '#67c23a' },
  { path: ROUTE_JSON_COMPRESS_ESCAPE, icon: 'Operation', title: 'menu.jsonCompressEscape', desc: 'tools.jsonCompressEscape.description', color: '#f56c6c' },
  { path: ROUTE_JSON_ONLINE_VIEW, icon: 'View', title: 'menu.jsonOnlineView', desc: 'tools.jsonOnlineView.description', color: '#909399' },
  { path: ROUTE_JSON_COLOR, icon: 'MagicStick', title: 'menu.jsonColor', desc: 'tools.jsonColor.description', color: '#7c3aed' },
  { path: ROUTE_JSON_XML, icon: 'Switch', title: 'menu.jsonXmlConvert', desc: 'tools.jsonXml.description', color: '#e6a23c' },
  { path: ROUTE_JSON_COMPARE, icon: 'Tickets', title: 'menu.jsonCompare', desc: 'tools.jsonCompare.description', color: '#9c27b0' },
  { path: ROUTE_JSON_ENTITY, icon: 'Files', title: 'menu.jsonEntity', desc: 'tools.jsonEntity.description', color: '#13c2c2' },
  { path: ROUTE_JSON_EXCEL, icon: 'Grid', title: 'menu.jsonExcel', desc: 'tools.jsonExcel.description', color: '#1e80ff' }
]

// —— NavBar 一级菜单 ——
export const jsonMenu: NavMenuGroup = {
  key: 'json',
  title: 'menu.jsonTools',
  icon: Tools,
  link: ROUTE_JSON,
  exact: [ROUTE_HOME, ROUTE_JSON],
  prefix: ROUTE_JSON,
  hidden: false,
  items: jsonToolCards.map((c) => ({ path: c.path, label: c.title }))
}
