export const FEEDBACK_FORM_NAME = 'suggestion'

export const feedbackFields = [
  {
    key: 'type',
    name: 'feedback-type',
    kind: 'select',
    initialValue: 'general',
    labelKey: 'tools.feedback.type',
    options: [
      { labelKey: 'tools.feedback.bugReport', value: 'bug' },
      { labelKey: 'tools.feedback.featureRequest', value: 'feature' },
      { labelKey: 'tools.feedback.general', value: 'general' },
      { labelKey: 'tools.feedback.toolSuggestion', value: 'suggestion' }
    ]
  },
  {
    key: 'toolName',
    name: 'tool-name',
    kind: 'input',
    initialValue: '',
    labelKey: 'tools.feedback.toolName',
    placeholderKey: 'tools.feedback.toolNamePlaceholder',
    visibleWhen: (form) => form.type !== 'general'
  },
  {
    key: 'rating',
    name: 'rating',
    kind: 'rate',
    initialValue: 0,
    labelKey: 'tools.feedback.rating'
  },
  {
    key: 'feedback',
    name: 'feedback-content',
    kind: 'textarea',
    initialValue: '',
    labelKey: 'tools.feedback.feedback',
    placeholderKey: 'tools.feedback.feedbackPlaceholder',
    rows: 6,
    required: true
  },
  {
    key: 'email',
    name: 'email',
    kind: 'input',
    initialValue: '',
    labelKey: 'tools.feedback.email',
    placeholderKey: 'tools.feedback.emailPlaceholder'
  }
]

export const createFeedbackFormState = () => {
  return feedbackFields.reduce((state, field) => {
    state[field.key] = field.initialValue
    return state
  }, {})
}
