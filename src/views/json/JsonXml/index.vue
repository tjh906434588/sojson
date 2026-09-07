<template>
  <div class="container json-xml-container">
    <el-card class="tool-card json-xml-card">
      <div class="content-area" :class="{ vertical: isMobile }">
        <!-- 左/上：JSON 输入框 -->
        <div class="pane pane-json">
          <el-input
            v-model="jsonInput"
            type="textarea"
            :rows="12"
            :placeholder="$t('tools.jsonXml.jsonPlaceholder')"
            class="textarea-input convert-textarea"
            :class="jsonClass"
          />
          <div class="pane-status" :class="jsonStatusClass">{{ jsonStatusText }}</div>
        </div>

        <!-- 中：按钮组（web 竖排 / H5 一行） -->
        <div class="convert-actions">
          <el-button type="primary" @click="onJsonToXml">
            &gt; {{ $t('tools.jsonXml.jsonToXml') }}
          </el-button>
          <el-button type="success" @click="onXmlToJson">
            &lt; {{ $t('tools.jsonXml.xmlToJson') }}
          </el-button>
          <el-button type="danger" @click="clearAll" :icon="Delete">
            {{ $t('common.clear') }}
          </el-button>
        </div>

        <!-- 右/下：XML 输入框 -->
        <div class="pane pane-xml">
          <el-input
            v-model="xmlInput"
            type="textarea"
            :rows="12"
            :placeholder="$t('tools.jsonXml.xmlPlaceholder')"
            class="textarea-input convert-textarea"
            :class="xmlClass"
          />
          <div class="pane-status" :class="xmlStatusClass">{{ xmlStatusText }}</div>
        </div>
      </div>

      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        :closable="false"
        class="tool-alert"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { useIsMobile } from '@/utils'

const { t } = useI18n()

const jsonInput = ref('')
const xmlInput = ref('')
const errorMessage = ref('')
const isMobile = useIsMobile()

// 各输入框格式状态：null=未校验/空 | 'valid'=格式正确 | 'invalid'=格式错误
const jsonState = ref(null)
const xmlState = ref(null)

let jsonTimer = null
let xmlTimer = null

const isValidJson = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const isValidXml = (str) => {
  try {
    const doc = new DOMParser().parseFromString(str, 'application/xml')
    return !doc.getElementsByTagName('parsererror').length && !!doc.documentElement
  } catch (e) {
    return false
  }
}

// 左侧输入框仅允许 JSON 格式内容
watch(jsonInput, () => {
  clearTimeout(jsonTimer)
  jsonTimer = setTimeout(() => {
    if (!jsonInput.value || !jsonInput.value.trim()) {
      jsonState.value = null
      return
    }
    jsonState.value = isValidJson(jsonInput.value) ? 'valid' : 'invalid'
  }, 400)
})

// 右侧输入框仅允许 XML 格式内容
watch(xmlInput, () => {
  clearTimeout(xmlTimer)
  xmlTimer = setTimeout(() => {
    if (!xmlInput.value || !xmlInput.value.trim()) {
      xmlState.value = null
      return
    }
    xmlState.value = isValidXml(xmlInput.value) ? 'valid' : 'invalid'
  }, 400)
})

const jsonClass = computed(() => (jsonState.value ? 'state-' + jsonState.value : ''))
const xmlClass = computed(() => (xmlState.value ? 'state-' + xmlState.value : ''))

const jsonStatusClass = computed(() => (jsonState.value ? 'status-' + jsonState.value : ''))
const xmlStatusClass = computed(() => (xmlState.value ? 'status-' + xmlState.value : ''))

const jsonStatusText = computed(() => {
  if (jsonState.value === 'valid') return t('tools.jsonXml.jsonValid')
  if (jsonState.value === 'invalid') return t('tools.jsonXml.jsonInvalid')
  return ''
})

const xmlStatusText = computed(() => {
  if (xmlState.value === 'valid') return t('tools.jsonXml.xmlValid')
  if (xmlState.value === 'invalid') return t('tools.jsonXml.xmlInvalid')
  return ''
})

const requireJson = () => {
  if (!jsonInput.value || !jsonInput.value.trim()) {
    ElMessage.warning(t('tools.jsonXml.jsonEmpty'))
    return false
  }
  if (!isValidJson(jsonInput.value)) {
    ElMessage.error(t('tools.jsonXml.jsonError'))
    return false
  }
  return true
}

const requireXml = () => {
  if (!xmlInput.value || !xmlInput.value.trim()) {
    ElMessage.warning(t('tools.jsonXml.xmlEmpty'))
    return false
  }
  if (!isValidXml(xmlInput.value)) {
    ElMessage.error(t('tools.jsonXml.xmlError'))
    return false
  }
  return true
}

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const indentXml = (s, n) => String(s).split('\n').map((l) => ' '.repeat(n) + l).join('\n')

// 将 JSON 值递归转换为 XML
const buildXml = (key, value) => {
  if (value === null || value === undefined) return '<' + key + ' />'
  if (Array.isArray(value)) return value.map((v) => buildXml(key, v)).join('\n')
  if (typeof value === 'object') {
    const inner = Object.keys(value)
      .map((k) => buildXml(k, value[k]))
      .filter(Boolean)
      .join('\n')
    return inner ? '<' + key + '>\n' + indentXml(inner, 2) + '\n</' + key + '>' : '<' + key + ' />'
  }
  return '<' + key + '>' + escapeXml(value) + '</' + key + '>'
}

// JSON 转 XML：左侧转换到右侧
const onJsonToXml = () => {
  if (!requireJson()) return
  try {
    const data = JSON.parse(jsonInput.value)
    const body = buildXml('root', data)
    xmlInput.value = '<?xml version="1.0" encoding="UTF-8"?>\n' + body
    errorMessage.value = ''
    ElMessage.success(t('tools.jsonXml.convertSuccess'))
  } catch (e) {
    ElMessage.error(t('tools.jsonXml.jsonError'))
  }
}

// 将 XML 节点递归转换为 JSON 值（重复标签合并为数组，属性使用 @ 前缀）
const nodeToJson = (node: Element) => {
  const obj = {}
  if (node.attributes) {
    for (const attr of node.attributes) obj['@' + attr.name] = attr.value
  }
  const children = Array.from(node.children || [])
  if (children.length === 0) {
    const text = (node.textContent || '').trim()
    const hasAttrs = Object.keys(obj).length > 0
    if (!text && !hasAttrs) return ''
    if (hasAttrs) {
      if (text) obj['#text'] = text
      return obj
    }
    return text
  }
  for (const child of children) {
    const val = nodeToJson(child)
    const tag = child.tagName
    if (tag in obj) {
      obj[tag] = Array.isArray(obj[tag]) ? obj[tag].concat(val) : [obj[tag], val]
    } else {
      obj[tag] = val
    }
  }
  return obj
}

// XML 转 JSON：右侧转换到左侧
const onXmlToJson = () => {
  if (!requireXml()) return
  try {
    const doc = new DOMParser().parseFromString(xmlInput.value, 'application/xml')
    if (doc.getElementsByTagName('parsererror').length) throw new Error('parse error')
    const root = doc.documentElement
    if (!root) throw new Error('empty document')
    const result: Record<string, unknown> = {}
    result[root.tagName] = nodeToJson(root)
    // 自动剥壳：仅当 XML 根元素是本工具生成的 <root> 包装时，去掉这层壳还原原始 JSON
    const parsed = root.tagName === 'root' ? result.root : result
    jsonInput.value = JSON.stringify(parsed, null, 2)
    errorMessage.value = ''
    ElMessage.success(t('tools.jsonXml.convertSuccess'))
  } catch (e) {
    ElMessage.error(t('tools.jsonXml.xmlError'))
  }
}

const clearAll = () => {
  jsonInput.value = ''
  xmlInput.value = ''
  jsonState.value = null
  xmlState.value = null
  errorMessage.value = ''
}
</script>

<style scoped lang="scss">
.json-xml-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px; // 覆盖全局 .container 的 padding，仅保留左右边距
}

.json-xml-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0; // 覆盖全局 .tool-card 的 padding: 24px
  margin-bottom: 0; // 覆盖全局 .tool-card 的 margin-bottom: 20px

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px; // 卡片内容内边距
  }
}

// web：左中右布局
.content-area {
  flex: 1;
  display: flex;
  min-height: 0;
  gap: 16px;

  &.vertical {
    flex-direction: column;
    gap: 12px;
  }
}

.pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.convert-textarea {
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
    font-family: 'Courier New', monospace;
    resize: none;
  }
}

// 格式校验状态：输入框边框颜色
.convert-textarea.state-valid :deep(.el-textarea__inner) {
  border-color: #67c23a;
}

.convert-textarea.state-invalid :deep(.el-textarea__inner) {
  border-color: #f56c6c;
}

// 输入框下方格式状态提示
.pane-status {
  flex-shrink: 0;
  min-height: 20px;
  margin-top: 4px;
  font-size: 12px;
  line-height: 20px;
  color: transparent;

  &.status-valid {
    color: #67c23a;
  }

  &.status-invalid {
    color: #f56c6c;
  }
}

// 中间按钮组：web 竖排，按钮等宽
.convert-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 12px;
  padding: 4px 2px;
  width: 140px;

  .el-button {
    margin: 0;
    width: 100%;
  }
}

.tool-alert {
  flex-shrink: 0;
  margin-top: 12px;
}

// H5：上中下布局，按钮一行展示
@media (max-width: 768px) {
  .json-xml-container {
    padding: 0 15px;
  }

  .convert-actions {
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    padding: 0;
    width: 100%;

    .el-button {
      flex: 1 1 calc(33.333% - 8px);
      min-width: auto;
      padding: 8px 4px;
    }
  }
}
</style>
