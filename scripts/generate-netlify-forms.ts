import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { FeedbackField } from '../src/types'
import { FEEDBACK_FORM_NAME, feedbackFields } from '../src/config/feedbackForm'

const publicDir = resolve(process.cwd(), 'public')
const outputPath = resolve(publicDir, '__forms.html')

const getFieldMarkup = (field: FeedbackField) => {
  if (field.kind === 'textarea') {
    return `      <textarea name="${field.name}"></textarea>`
  }

  return `      <input type="text" name="${field.name}" />`
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <title>Netlify Forms</title>
  </head>
  <body>
    <form name="${FEEDBACK_FORM_NAME}" method="POST" data-netlify="true" hidden>
      <input type="hidden" name="form-name" value="${FEEDBACK_FORM_NAME}" />
${feedbackFields.map(getFieldMarkup).join('\n')}
    </form>
  </body>
</html>
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(outputPath, html)
