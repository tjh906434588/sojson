// 导航菜单类型：NavBar 一级菜单配置，由各一级菜单路由模块（src/router/<菜单>.ts）导出，业务侧直接引入使用
import type { Component } from 'vue'

/** 二级菜单项 */
export interface NavMenuItem {
  /** 路由地址 */
  path: string
  /** i18n key：menu.<工具名> */
  label: string
}

/** 二级菜单分组（如 encrypt 菜单下的对称加解密 / JS 加解密模块） */
export interface NavMenuSubGroup {
  key: string
  /** i18n key */
  title: string
  items: NavMenuItem[]
}

/** 一级菜单（NavBar 菜单组） */
export interface NavMenuGroup {
  key: string
  /** i18n key：menu.<一级菜单> */
  title: string
  /** @element-plus/icons-vue 图标组件 */
  icon: Component
  /** 一级菜单落地页路由 */
  link: string
  /** 路由前缀（用于二级高亮判断） */
  prefix?: string
  /** 高亮精确匹配路径（如首页 + 本菜单落地页） */
  exact?: string[]
  /** true 表示屏蔽：保留但隐藏，不参与展示 */
  hidden?: boolean
  /** 扁平二级菜单项（与 modules 二选一） */
  items?: NavMenuItem[]
  /** 分组二级菜单（与 items 二选一） */
  modules?: NavMenuSubGroup[]
}
