import type { FeedbackField } from '@/types'

// 反馈表单配置：字段名与 Feedback.vue 提交逻辑保持一致
export const FEEDBACK_FORM_NAME = 'suggestion'

export const feedbackFields: FeedbackField[] = [
  { name: 'feedback-type', kind: 'text' },
  { name: 'tool-name', kind: 'text' },
  { name: 'rating', kind: 'text' },
  { name: 'feedback-content', kind: 'textarea' },
  { name: 'email', kind: 'text' }
]
