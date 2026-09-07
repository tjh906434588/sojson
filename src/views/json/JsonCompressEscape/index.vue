<template>
  <div class="container">
    <el-card class="tool-card">
      <el-input
        v-model="jsonInput"
        type="textarea"
        :rows="12"
        :placeholder="$t('tools.jsonCompressEscape.input')"
        class="textarea-input"
      />

      <div class="button-group">
        <el-button type="success" @click="compressJson" :icon="Minus">
          {{ $t('tools.jsonCompressEscape.compress') }}
        </el-button>
        <el-button type="warning" @click="escapeJson" :icon="Switch">
          {{ $t('tools.jsonCompressEscape.escape') }}
        </el-button>
        <el-button type="primary" @click="compressAndEscape" :icon="Operation">
          {{ $t('tools.jsonCompressEscape.compressEscape') }}
        </el-button>
        <el-button @click="unescapeJson" :icon="RefreshLeft">
          {{ $t('tools.jsonCompressEscape.unescape') }}
        </el-button>
        <el-button @click="unicodeToCn" :icon="CaretRight">
          {{ $t('tools.jsonCompressEscape.unicodeToCn') }}
        </el-button>
        <el-button @click="cnToUnicode" :icon="CaretLeft">
          {{ $t('tools.jsonCompressEscape.cnToUnicode') }}
        </el-button>
        <el-button class="btn-symbol" @click="cnSymbolToEn" :icon="EditPen">
          {{ $t('tools.jsonCompressEscape.cnSymbolToEn') }}
        </el-button>
        <el-button @click="copyJson" :icon="CopyDocument">
          {{ $t('tools.jsonCompressEscape.copyResult') }}
        </el-button>
        <el-button type="info" @click="saveJson" :icon="Download">
          {{ $t('tools.jsonCompressEscape.saveLocal') }}
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
          <p class="alert-line">{{ t('tools.jsonCompressEscape.errLine', { line: errorDetail.line, column: errorDetail.column }) }}</p>
          <p class="alert-content">{{ t('tools.jsonCompressEscape.errContent', { content: errorDetail.content }) }}</p>
          <p class="alert-suggestion">{{ t('tools.jsonCompressEscape.errSuggestion', { suggestion: t(errorDetail.suggestionKey) }) }}</p>
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
import { Minus, Switch, Operation, RefreshLeft, CaretRight, CaretLeft, EditPen, CopyDocument, Download, Delete } from '@element-plus/icons-vue'

const { t } = useI18n()

const jsonInput = ref('')
const message = ref('')
const messageType = ref('success')
const errorDetail = ref(null)

const requireInput = () => {
  if (!jsonInput.value || !jsonInput.value.trim()) {
    ElMessage.warning(t('tools.jsonCompressEscape.inputEmpty'))
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
  let suggestionKey = 'tools.jsonCompressEscape.errSugGeneric'
  if (/Unexpected end of JSON input|Unexpected end of input/i.test(msg)) {
    suggestionKey = 'tools.jsonCompressEscape.errSugUnclosed'
  } else if (/Expected ':' after property name/i.test(msg)) {
    suggestionKey = 'tools.jsonCompressEscape.errSugColon'
  } else if (/Expected double-quoted property name/i.test(msg)) {
    suggestionKey = 'tools.jsonCompressEscape.errSugTailComma'
  } else if (/Expected ',' or '\]' after array element|Expected ',' or '\}' after property value|Expected ','|Expected '\]'|Expected '\}'/i.test(msg)) {
    suggestionKey = atEnd ? 'tools.jsonCompressEscape.errSugUnclosed' : 'tools.jsonCompressEscape.errSugComma'
  } else if (/Unexpected non-whitespace character after JSON/i.test(msg)) {
    const head = jsonInput.value.trim().charAt(0)
    suggestionKey = (head === '{' || head === '[')
      ? 'tools.jsonCompressEscape.errSugTrailing'
      : 'tools.jsonCompressEscape.errSugWrap'
  } else if (/Unexpected string/i.test(msg)) {
    suggestionKey = 'tools.jsonCompressEscape.errSugQuote'
  } else if (/Unexpected token|Unexpected number|Unexpected identifier/i.test(msg)) {
    suggestionKey = 'tools.jsonCompressEscape.errSugTrailing'
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
    message.value = 'tools.jsonCompressEscape.error'
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


const compressAndEscape = () => {
  if (!requireInput()) return
  try {
    const minified = JSON.stringify(JSON.parse(jsonInput.value))
    jsonInput.value = minified.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
    message.value = ''
    errorDetail.value = null
  } catch (e) {
    const info = parseErrorInfo(e)
    const fixed = tryFix(jsonInput.value)
    if (fixed !== null) {
      jsonInput.value = JSON.stringify(fixed).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
    } else {
      const partial = formatValidPrefix(jsonInput.value, info.pos)
      if (partial !== null) {
        const restStart = info.line > 1
          ? jsonInput.value.lastIndexOf('\n', Math.max(0, info.pos - 1)) + 1
          : info.pos
        const rest = jsonInput.value.slice(restStart)
        const fixedStr = JSON.stringify(JSON.parse(partial)).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
        jsonInput.value = rest ? fixedStr + '\n' + rest : fixedStr
      }
    }
    message.value = 'tools.jsonCompressEscape.error'
    messageType.value = 'error'
    errorDetail.value = info
  }
}

const cnSymbolToEn = () => {
  if (!requireInput()) return
  const map = {
    '，': ',', '。': '.', '、': ',', '：': ':', '；': ';',
    '？': '?', '！': '!', '“': '"', '”': '"', '‘': "'", '’': "'",
    '（': '(', '）': ')', '【': '[', '】': ']', '《': '<', '》': '>',
    '～': '~', '—': '-', '…': '...'
  }
  jsonInput.value = jsonInput.value.replace(/[，。、：；？！“”‘’（）【】《》～…]/g, (ch) => map[ch] || ch)
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
    ElMessage.warning(t('tools.jsonCompressEscape.copyEmpty'))
    return
  }
  copyToClipboard(jsonInput.value, t('common.success'))
}

const saveJson = () => {
  if (!jsonInput.value) {
    ElMessage.warning(t('tools.jsonCompressEscape.noResult'))
    return
  }
  const blob = new Blob([jsonInput.value], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  // 微信内置浏览器对 a[download] + Blob 下载支持不稳定，改为新窗口打开 JSON 供长按复制/分享保存
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    ElMessage.success(t('tools.jsonCompressEscape.saved'))
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = 'json-result.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('tools.jsonCompressEscape.saved'))
}

const clearJson = () => {
  jsonInput.value = ''
  message.value = ''
  errorDetail.value = null
}
</script>

<style scoped lang="scss">
// 卡片白色区域跟随内容模块高度（内容区 = 视口 - 菜单栏 - 底部栏 - 上下 20px）
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px; // 覆盖全局 .container 的 padding，仅保留左右边距
}

.tool-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0; // 覆盖全局 .tool-card 的 padding: 24px
  margin-bottom: 0; // 覆盖全局 .tool-card 的 margin-bottom: 20px

  // el-card 内容实际在 body 内，需要让 body 撑满卡片高度
  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px; // 卡片内容内边距
  }
}

// 文本框撑满卡片剩余空间，按钮组固定在底部，避免内容区留大片空白
.textarea-input {
  margin: 0; // 覆盖全局 .textarea-input 的 margin: 20px 0
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-textarea) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  :deep(.el-textarea__inner) {
    flex: 1;
    height: auto;
    min-height: 0;
  }
}

// 按钮组贴近卡片底部，消除下方多余空白
.button-group {
  margin-top: 20px;
  margin-bottom: 0;
}

// Web 模式下「中文符号转英文符号」文字较长，占两列避免文字贴边
@media (min-width: 769px) {
  .button-group .btn-symbol {
    grid-column: span 2;
  }
}

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

