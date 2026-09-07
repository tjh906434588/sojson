// 创建路由：汇总各一级菜单路由模块（modules/home、modules/json、modules/encrypt...）
// 各菜单的路由、路径常量、落地页卡片、NavBar 菜单均在对应模块中定义，业务侧从对应模块引入
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { homeRoutes } from './modules/home'
import { jsonRoutes } from './modules/json'
import { encryptRoutes } from './modules/encrypt'
import { compressRoutes } from './modules/compress'
import { documentRoutes } from './modules/document'
import { frontendRoutes } from './modules/frontend'
import { convertRoutes } from './modules/convert'
import { otherRoutes } from './modules/other'

const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  ...jsonRoutes,
  ...encryptRoutes,
  ...compressRoutes,
  ...documentRoutes,
  ...frontendRoutes,
  ...convertRoutes,
  ...otherRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
