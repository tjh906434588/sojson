// 反馈表单相关类型
/** 反馈表单字段（字段名与 Feedback.vue 提交逻辑保持一致） */
export interface FeedbackField {
  name: string
  kind: 'text' | 'textarea'
}
