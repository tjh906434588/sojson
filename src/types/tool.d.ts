// 通用类型：工具卡片、语言等
/** 工具入口卡片（一级菜单落地页 / 首页卡片数据项） */
export interface ToolItem {
  /** 路由地址 */
  path: string
  /** @element-plus/icons-vue 图标名 */
  icon: string
  /** i18n key：menu.<工具名> */
  title: string
  /** i18n key：tools.<工具名>.description */
  desc: string
  /** 卡片主题色 */
  color: string
}

/** 支持的语言 */
export type Language = 'zh' | 'en'
