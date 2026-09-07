<template>
  <div class="container">
    <el-card class="tool-card">
      <el-input
        v-model="jsonInput"
        type="textarea"
        :rows="12"
        :placeholder="$t('tools.jsonParser.input')"
        class="textarea-input"
      />

      <div class="button-group">
        <el-button type="primary" @click="formatJson" :icon="Document">
          {{ $t('tools.jsonParser.formatValidate') }}
        </el-button>
        <el-button type="success" @click="compressJson" :icon="Minus">
          {{ $t('buttons.compress') }}
        </el-button>
        <el-button type="warning" @click="escapeJson" :icon="Switch">
          {{ $t('tools.jsonParser.escape') }}
        </el-button>
        <el-button @click="unescapeJson" :icon="RefreshLeft">
          {{ $t('tools.jsonParser.unescape') }}
        </el-button>
        <el-button @click="unicodeToCn" :icon="CaretRight">
          {{ $t('tools.jsonParser.unicodeToCn') }}
        </el-button>
        <el-button @click="cnToUnicode" :icon="CaretLeft">
          {{ $t('tools.jsonParser.cnToUnicode') }}
        </el-button>
        <el-button @click="copyJson" :icon="CopyDocument">
          {{ $t('tools.jsonParser.copyResult') }}
        </el-button>
        <el-button type="info" @click="saveJson" :icon="Download">
          {{ $t('tools.jsonParser.saveLocal') }}
        </el-button>
        <el-button type="danger" @click="clearJson" :icon="Delete">
          {{ $t('common.clear') }}
        </el-button>
      </div>

      <el-alert
        v-if="message"
        :title="message ? t(message) : ''"
        :type="messageType"
        :closable="false"
        class="tool-alert"
      >
        <div v-if="errorDetail" class="alert-detail">
          <p class="alert-line">{{ t('tools.jsonParser.errLine', { line: errorDetail.line, column: errorDetail.column }) }}</p>
          <p class="alert-content">{{ t('tools.jsonParser.errContent', { content: errorDetail.content }) }}</p>
          <p class="alert-suggestion">{{ t('tools.jsonParser.errSuggestion', { suggestion: t(errorDetail.suggestionKey) }) }}</p>
        </div>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils'
import { Document, Minus, Switch, RefreshLeft, CaretRight, CaretLeft, CopyDocument, Download, Delete } from '@element-plus/icons-vue'

const { t } = useI18n()

const jsonInput = ref('')
const message = ref('')
const messageType = ref('success')
const errorDetail = ref(null)

const requireInput = () => {
  if (!jsonInput.value || !jsonInput.value.trim()) {
    ElMessage.warning(t('tools.jsonParser.inputEmpty'))
    // 输入已清空时，同步清除残留的错误提示
    message.value = ''
    errorDetail.value = null
    return false
  }
  return true
}

const parseErrorInfo = (e) => {
  const msg = e.message || ''
  const posMatch = msg.match(/position (\d+)/)
  const pos = posMatch ? parseInt(posMatch[1], 10) : -1
  let line = -1
  let column = -1
  let content = ''
  const lineColMatch = msg.match(/\(line (\d+) column (\d+)\)/)
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10)
    column = parseInt(lineColMatch[2], 10)
  } else if (pos >= 0) {
    const before = jsonInput.value.slice(0, pos)
    line = before.split('\n').length
    column = pos - before.lastIndexOf('\n')
  }
  if (line >= 1) {
    const allLines = jsonInput.value.split('\n')
    const raw = allLines[line - 1] || ''
    if (raw.length <= 60) {
      content = raw.trim()
    } else if (pos >= 0) {
      // 内容过长时只展示错误位置附近的片段
      const lineStart = jsonInput.value.lastIndexOf('\n', Math.max(0, pos - 1)) + 1
      const start = Math.max(lineStart, pos - 12)
      const end = Math.min(jsonInput.value.length, pos + 42)
      content = (start > lineStart ? '...' : '') + jsonInput.value.slice(start, end) + (end < jsonInput.value.length ? '...' : '')
    } else {
      content = raw.trim().slice(0, 60) + '...'
    }
  }
  const atEnd = pos >= jsonInput.value.trim().length - 1
  let suggestionKey = 'tools.jsonParser.errSugGeneric'
  if (/Unexpected end of JSON input|Unexpected end of input/i.test(msg)) {
    suggestionKey = 'tools.jsonParser.errSugUnclosed'
  } else if (/Expected ':' after property name/i.test(msg)) {
    suggestionKey = 'tools.jsonParser.errSugColon'
  } else if (/Expected double-quoted property name/i.test(msg)) {
    suggestionKey = 'tools.jsonParser.errSugTailComma'
  } else if (/Expected ',' or '\]' after array element|Expected ',' or '\}' after property value|Expected ','|Expected '\]'|Expected '\}'/i.test(msg)) {
    suggestionKey = atEnd ? 'tools.jsonParser.errSugUnclosed' : 'tools.jsonParser.errSugComma'
  } else if (/Unexpected non-whitespace character after JSON/i.test(msg)) {
    const head = jsonInput.value.trim().charAt(0)
    suggestionKey = (head === '{' || head === '[')
      ? 'tools.jsonParser.errSugTrailing'
      : 'tools.jsonParser.errSugWrap'
  } else if (/Unexpected string/i.test(msg)) {
    suggestionKey = 'tools.jsonParser.errSugQuote'
  } else if (/Unexpected token|Unexpected number|Unexpected identifier/i.test(msg)) {
    suggestionKey = 'tools.jsonParser.errSugTrailing'
  }
  return { line, column, content, suggestionKey, pos }
}

// 统计未闭合的括号，返回未闭合的 { 或 [ 列表（按出现顺序）
const countUnclosed = (s) => {
  const stack = []
  for (const ch of s) {
    if (ch === '{' || ch === '[') {
      stack.push(ch)
    } else if (ch === '}' || ch === ']') {
      const open = ch === '}' ? '{' : '['
      if (stack.length && stack[stack.length - 1] === open) stack.pop()
    }
  }
  return stack
}

// 尝试修复错误 JSON，成功返回解析结果，失败返回 null
const tryFix = (input) => {
  const unclosed = countUnclosed(input)
  if (unclosed.length) {
    const tail = unclosed.slice().reverse().map((o) => (o === '{' ? '}' : ']')).join('')
    try {
      return JSON.parse(input + tail)
    } catch (e) { /* 继续尝试其他修复 */ }
  }
  const trimmed = input.replace(/[}\]]+$/, '')
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    try {
      return JSON.parse('{' + trimmed + '}')
    } catch (e) { /* 无法修复 */ }
  }
  return null
}

// 错误无法整体修复时，格式化错误位置之前的有效部分；错误部分由调用方原样保留
const formatValidPrefix = (input, pos) => {
  if (typeof pos !== 'number' || pos <= 0) return null
  const prefix = input.slice(0, pos).replace(/[,\s]+$/, '')
  const closers = countUnclosed(prefix).slice().reverse().map((o) => (o === '{' ? '}' : ']')).join('')
  try {
    return JSON.stringify(JSON.parse(prefix + closers), null, 2)
  } catch (e) {
    return null
  }
}

// 解析并尽量容错：成功返回格式化结果；失败时尝试修复并格式化
const parseWithFix = (input) => {
  try {
    return { ok: true, value: JSON.stringify(JSON.parse(input), null, 2) }
  } catch (e) {
    const info = parseErrorInfo(e)
    const fixed = tryFix(input)
    if (fixed !== null) {
      return { ok: false, value: JSON.stringify(fixed, null, 2), info }
    }
    const partial = formatValidPrefix(input, info.pos)
    if (partial !== null) {
      // 有效部分格式化展示，错误部分原样保留（不删除原文内容）
      const restStart = info.line > 1
        ? input.lastIndexOf('\n', Math.max(0, info.pos - 1)) + 1
        : info.pos
      const rest = input.slice(restStart)
      return { ok: false, value: rest ? partial + '\n' + rest : partial, info }
    }
    return { ok: false, value: input, info }
  }
}

const formatJson = () => {
  if (!requireInput()) return
  const r = parseWithFix(jsonInput.value)
  jsonInput.value = r.value
  if (r.ok) {
    message.value = ''
    errorDetail.value = null
  } else {
    message.value = 'tools.jsonParser.error'
    messageType.value = 'error'
    errorDetail.value = r.info
  }
}

const compressJson = () => {
  if (!requireInput()) return
  try {
    jsonInput.value = JSON.stringify(JSON.parse(jsonInput.value))
    message.value = ''
    errorDetail.value = null
  } catch (e) {
    const info = parseErrorInfo(e)
    const fixed = tryFix(jsonInput.value)
    if (fixed !== null) {
      jsonInput.value = JSON.stringify(fixed)
    } else {
      const partial = formatValidPrefix(jsonInput.value, info.pos)
      if (partial !== null) {
        const restStart = info.line > 1
          ? jsonInput.value.lastIndexOf('\n', Math.max(0, info.pos - 1)) + 1
          : info.pos
        const rest = jsonInput.value.slice(restStart)
        jsonInput.value = rest ? JSON.stringify(JSON.parse(partial)) + '\n' + rest : JSON.stringify(JSON.parse(partial))
      }
    }
    message.value = 'tools.jsonParser.error'
    messageType.value = 'error'
    errorDetail.value = info
  }
}

const escapeJson = () => {
  if (!requireInput()) return
  jsonInput.value = jsonInput.value.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
  message.value = ''
  errorDetail.value = null
}

const unescapeJson = () => {
  if (!requireInput()) return
  jsonInput.value = jsonInput.value.replace(/\\([\\"'])/g, '$1').replace(/\\0/g, '\0')
  message.value = ''
  errorDetail.value = null
}

const unicodeToCn = () => {
  if (!requireInput()) return
  jsonInput.value = jsonInput.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
  message.value = ''
  errorDetail.value = null
}

const cnToUnicode = () => {
  if (!requireInput()) return
  jsonInput.value = jsonInput.value.replace(/[^\x00-\x7F]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'))
  message.value = ''
  errorDetail.value = null
}

const copyJson = () => {
  if (!jsonInput.value) {
    ElMessage.warning(t('tools.jsonParser.copyEmpty'))
    return
  }
  copyToClipboard(jsonInput.value, t('common.success'))
}

const saveJson = () => {
  if (!jsonInput.value) {
    ElMessage.warning(t('tools.jsonParser.noResult'))
    return
  }
  const blob = new Blob([jsonInput.value], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  // 微信内置浏览器对 a[download] + Blob 下载支持不稳定，改为新窗口打开 JSON 供长按复制/分享保存
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    ElMessage.success(t('tools.jsonParser.saved'))
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = 'json-result.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('tools.jsonParser.saved'))
}

const clearJson = () => {
  jsonInput.value = ''
  message.value = ''
  errorDetail.value = null
}
</script>

<style scoped lang="scss">
.tool-alert {
  margin-top: 20px;
}

.alert-detail {
  p {
    margin: 4px 0;
    word-break: break-all;
  }

  .alert-suggestion {
    color: #e6a23c;
    font-weight: 600;
  }
}
</style>

