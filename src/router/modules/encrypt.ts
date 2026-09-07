// 加解密工具菜单路由模块
// 本模块为 encrypt 一级菜单的「唯一事实来源」：路径常量、路由配置、落地页卡片、NavBar 菜单
import type { RouteRecordRaw } from 'vue-router'
import { Lock } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'

// —— 路径定义 ——
export const ROUTE_ENCRYPT = '/encrypt'
export const ROUTE_ENCRYPT_DECRYPT = '/encrypt/encrypt-decrypt'
export const ROUTE_JS_ENCRYPT_DECRYPT = '/encrypt/js-encrypt-decrypt'

// —— 路由配置 ——
export const encryptRoutes: RouteRecordRaw[] = [
  { path: ROUTE_ENCRYPT, name: 'EncryptTools', component: () => import('../../views/encrypt/index.vue') },
  { path: ROUTE_ENCRYPT_DECRYPT, name: 'EncryptDecrypt', component: () => import('../../views/encrypt/EncryptDecrypt/index.vue') },
  { path: ROUTE_JS_ENCRYPT_DECRYPT, name: 'JsEncryptDecrypt', component: () => import('../../views/encrypt/JsEncryptDecrypt/index.vue') }
]

// —— 落地页入口卡片 ——
export const encryptToolCards: ToolItem[] = [
  { path: ROUTE_ENCRYPT_DECRYPT, icon: 'Lock', title: 'menu.encrypt', desc: 'tools.encryptDecrypt.description', color: '#409eff' },
  { path: ROUTE_JS_ENCRYPT_DECRYPT, icon: 'Operation', title: 'menu.jsEncryptDecrypt', desc: 'tools.jsEncryptDecrypt.description', color: '#67c23a' }
]

// —— NavBar 一级菜单（分两个模块分组）——
export const encryptMenu: NavMenuGroup = {
  key: 'encrypt',
  title: 'menu.encryptDecrypt',
  icon: Lock,
  link: ROUTE_ENCRYPT,
  prefix: ROUTE_ENCRYPT,
  hidden: false,
  modules: [
    { key: 'symmetric', title: 'menu.encryptModule1', items: [{ path: ROUTE_ENCRYPT_DECRYPT, label: 'menu.encrypt' }] },
    { key: 'js', title: 'menu.encryptModule2', items: [{ path: ROUTE_JS_ENCRYPT_DECRYPT, label: 'menu.jsEncryptDecrypt' }] }
  ]
}
