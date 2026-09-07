<template>
  <div class="container">
    <el-card class="tool-card">
      <div class="input-area">
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="$t('tools.jsHtmlFormat.input')"
          class="textarea-input"
        />
        <input ref="fileInput" type="file" accept=".js,.html,.css,.htm" class="hidden-file" @change="handleFile" />
      </div>

      <div class="button-group">
        <el-button class="upload-btn" :icon="Upload" @click="triggerUpload">
          {{ $t('tools.jsHtmlFormat.upload') }}
        </el-button>
        <el-select
          v-if="!isCssContent"
          v-model="indentMode"
          class="indent-select"
          :placeholder="$t('tools.jsHtmlFormat.indent')"
        >
          <el-option
            v-for="opt in indentOptions"
            :key="opt.value"
            :label="$t(opt.label)"
            :value="opt.value"
          />
        </el-select>
        <el-button type="primary" :icon="MagicStick" @click="format">
          {{ $t('tools.jsHtmlFormat.format') }}
        </el-button>
        <el-button type="success" :icon="Minus" @click="compress">
          {{ $t('tools.jsHtmlFormat.compress') }}
        </el-button>
        <el-button type="warning" :icon="Lock" @click="obfuscate">
          {{ $t('tools.jsHtmlFormat.obfuscate') }}
        </el-button>
        <el-button type="danger" :icon="Delete" @click="clear">
          {{ $t('tools.jsHtmlFormat.clear') }}
        </el-button>
        <el-button :icon="CopyDocument" @click="copy">
          {{ $t('tools.jsHtmlFormat.copyResult') }}
        </el-button>
        <el-button type="info" :icon="Download" @click="save">
          {{ $t('tools.jsHtmlFormat.saveLocal') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils'
import { Upload, MagicStick, Minus, Lock, Delete, CopyDocument, Download } from '@element-plus/icons-vue'

const { t } = useI18n()

const input = ref('')
const uploadedName = ref('')
const fileInput = ref(null)

// 缩进方式：默认第一个（制表符缩进）
const indentOptions = [
  { value: '\t', label: 'tools.jsHtmlFormat.indentTab' },
  { value: '  ', label: 'tools.jsHtmlFormat.indent2' },
  { value: '    ', label: 'tools.jsHtmlFormat.indent4' },
  { value: '        ', label: 'tools.jsHtmlFormat.indent8' }
]
const indentMode = ref('\t')

const requireInput = () => {
  if (!input.value || !input.value.trim()) {
    ElMessage.warning(t('tools.jsHtmlFormat.inputEmpty'))
    return false
  }
  return true
}

const handleError = () => {
  ElMessage.error(t('tools.jsHtmlFormat.processFailed'))
}

// 以 < 开头视为 HTML，否则按 JS 处理
const isHtml = (s) => s.trim().startsWith('<')

// 检测是否为 CSS：含“选择器 { 属性: 值 }”规则块，且不含 JS 关键字特征
const isCss = (s) => {
  const t = s.trim()
  if (!t || isHtml(t)) return false
  if (!/\{[^{}]*:[^{}]*\}/.test(t)) return false
  return !/\b(function|const|let|var|class|return|if|for|while|switch|case|=>)\b/.test(t)
}

// 输入为 CSS 时隐藏缩进选择器（CSS 样式不需要缩进）
const isCssContent = computed(() => isCss(input.value))

// CSS 格式化：只做行规范化，不做缩进
const formatCSS = (css) => css.split('\n').map((l) => l.trim()).filter(Boolean).join('\n')

const formatHTML = (html, unit) => {
  let formatted = ''
  let indent = 0
  html.replace(/>\s*</g, '><').split(/(<[^>]+>)/).forEach((node) => {
    if (node.match(/<\/\w/)) {
      indent = Math.max(0, indent - 1)
    }
    formatted += unit.repeat(indent) + node.trim() + '\n'
    if (node.match(/<\w[^>]*[^\/]>.*/) && !node.startsWith('</')) {
      indent++
    }
  })
  return formatted.trim()
}

const formatJS = (js, unit) => {
  let formatted = ''
  let indent = 0
  const lines = js.replace(/\t/g, '  ').split('\n')

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    if (trimmed.startsWith('}') || trimmed.startsWith(')')) {
      indent = Math.max(0, indent - 1)
    }
    formatted += unit.repeat(indent) + trimmed + '\n'
    if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith(',')) {
      indent++
    }
  })

  return formatted.trim()
}

// 格式化：按内容类型处理（HTML/CSS/JS），结果写回输入框（同 JSON 页面）
const format = () => {
  if (!requireInput()) return
  try {
    if (isHtml(input.value)) {
      input.value = formatHTML(input.value, indentMode.value)
    } else if (isCss(input.value)) {
      input.value = formatCSS(input.value)
    } else {
      input.value = formatJS(input.value, indentMode.value)
    }
  } catch (e) {
    handleError()
  }
}

// 普通压缩：去注释、压缩空白，对 JS/HTML/CSS 通用
const compress = () => {
  if (!requireInput()) return
  input.value = input.value
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,:])\s*/g, '$1')
    .trim()
}

// 加密压缩：JS 用 javascript-obfuscator 混淆并压缩；HTML/CSS 无混淆方案，退化为普通压缩
const obfuscate = async () => {
  if (!requireInput()) return
  if (isHtml(input.value) || isCss(input.value)) {
    compress()
    return
  }
  try {
    const { default: JavaScriptObfuscator } = await import('javascript-obfuscator')
    const result = JavaScriptObfuscator.obfuscate(input.value, {
      compact: true,
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false
    })
    input.value = result.getObfuscatedCode()
  } catch (e) {
    handleError()
  }
}

const copy = () => {
  if (!input.value) {
    ElMessage.warning(t('tools.jsHtmlFormat.copyEmpty'))
    return
  }
  copyToClipboard(input.value, t('common.success'))
}

// 保存本地：优先使用上传时的文件名，否则按内容判断扩展名
const save = () => {
  if (!input.value) {
    ElMessage.warning(t('tools.jsHtmlFormat.noResult'))
    return
  }
  const name = uploadedName.value || (isHtml(input.value) ? 'code.html' : 'code.js')
  const blob = new Blob([input.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  // 微信内置浏览器对 a[download] + Blob 下载支持不稳定，改为新窗口打开供长按保存
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    ElMessage.success(t('tools.jsHtmlFormat.saved'))
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('tools.jsHtmlFormat.saved'))
}

const clear = () => {
  input.value = ''
  uploadedName.value = ''
}

// 上传 JS/HTML/CSS 文件解析到输入框
const triggerUpload = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleFile = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  uploadedName.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    input.value = String(reader.result || '')
    ElMessage.success(t('tools.jsHtmlFormat.uploaded'))
  }
  reader.onerror = () => handleError()
  reader.readAsText(file)
  e.target.value = ''
}
</script>

<style scoped lang="scss">
// 输入区撑满剩余空间
.input-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

// 操作组贴近卡片底部
.button-group {
  .indent-select {
    width: 150px;
  }
}
</style>
