// 网页常用色彩数据相关类型
/** 配色分组（如：按单一色彩为主分类 / 按印象搭配分类） */
export interface ColorGroup {
  title: string
  categories: ColorCategory[]
}

/** 配色分类项 */
export interface ColorCategory {
  title: string
  desc: string
  colors: string[]
}
