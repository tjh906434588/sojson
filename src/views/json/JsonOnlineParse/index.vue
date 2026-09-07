<template>
  <div class="container">
    <el-card class="tool-card">
      <!-- 按钮板块 -->
      <div class="op-bar">
        <el-radio-group v-if="!isMobile" v-model="layoutMode" size="small" class="layout-radio">
          <el-radio-button label="horizontal">{{ $t('tools.jsonOnlineParse.leftRight') }}</el-radio-button>
          <el-radio-button label="vertical">{{ $t('tools.jsonOnlineParse.topBottom') }}</el-radio-button>
        </el-radio-group>
        <el-button type="primary" @click="formatJson">{{ $t('tools.jsonOnlineParse.format') }}</el-button>
        <el-button @click="compressJson">{{ $t('tools.jsonOnlineParse.compress') }}</el-button>
        <el-checkbox v-model="highlight">{{ $t('tools.jsonOnlineParse.highlight') }}</el-checkbox>
        <el-checkbox v-model="showType">{{ $t('tools.jsonOnlineParse.showType') }}</el-checkbox>
        <el-checkbox v-model="showIndex">{{ $t('tools.jsonOnlineParse.showIndex') }}</el-checkbox>
        <el-button @click="clearAll">{{ $t('common.clear') }}</el-button>
        <el-button @click="copyResult">{{ $t('tools.jsonOnlineParse.copyResult') }}</el-button>
      </div>

      <!-- 内容板块 -->
      <div class="content-area" :class="{ vertical: isVertical }" ref="areaEl">
        <div class="pane pane-input" :style="{ flexGrow: leftRatio }">
          <el-input
            v-model="jsonInput"
            type="textarea"
            :placeholder="$t('tools.jsonOnlineParse.input')"
            class="textarea-input"
          />
        </div>
        <div
          class="splitter"
          :class="{ 'splitter-v': !isVertical, 'splitter-h': isVertical }"
          @pointerdown="startDrag"
        >
          <svg v-if="!isVertical" class="splitter-icon" viewBox="0 0 4 64" width="4" height="64">
            <circle v-for="i in 8" :key="i" :cx="2" :cy="4 + (i - 1) * 8" r="1.5" />
          </svg>
          <svg v-else class="splitter-icon" viewBox="0 0 64 4" width="64" height="4">
            <circle v-for="i in 8" :key="i" :cx="4 + (i - 1) * 8" :cy="2" r="1.5" />
          </svg>
        </div>
        <div class="pane pane-output" :style="{ flexGrow: 100 - leftRatio }">
          <div v-if="parsedData && lastAction === 'format'" class="result-tree">
            <JsonTree :node="treeData" :highlight="highlight" :show-type="showType" :show-index="showIndex" />
          </div>
          <pre v-else-if="resultHtml" class="result-pre" :class="{ 'no-highlight': !highlight }" v-html="resultHtml"></pre>
          <div v-else class="result-placeholder">{{ $t('tools.jsonOnlineParse.output') }}</div>
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
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import JsonTree from './components/JsonTree.vue'
import { useIsMobile, copyToClipboard } from '@/utils'

const { t } = useI18n()

const jsonInput = ref('')
const parsedData = ref(null)
const lastAction = ref(null) // 'format' | 'compress'
const errorMessage = ref('')
const layoutMode = ref('horizontal')
const isMobile = useIsMobile()
const leftRatio = ref(50)
const highlight = ref(false)
const showType = ref(false)
const showIndex = ref(true)

const isVertical = computed(() => isMobile.value || layoutMode.value === 'vertical')

const areaEl = ref(null)
let dragging = false
let startPos = 0
let startRatio = 50

const startDrag = (e) => {
  if (isMobile.value) return
  dragging = true
  startPos = isVertical.value ? e.clientY : e.clientX
  startRatio = leftRatio.value
  window.addEventListener('pointermove', onDrag)
  window.addEventListener('pointerup', stopDrag)
  e.preventDefault()
}
const onDrag = (e) => {
  if (!dragging || !areaEl.value) return
  const rect = areaEl.value.getBoundingClientRect()
  const delta = isVertical.value ? (e.clientY - startPos) : (e.clientX - startPos)
  const total = isVertical.value ? rect.height : rect.width
  let r = startRatio + (delta / total) * 100
  r = Math.max(10, Math.min(90, r))
  leftRatio.value = r
}
const stopDrag = () => {
  dragging = false
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', stopDrag)
}

// H5 下强制单栏布局
watch(isMobile, (v) => {
  if (v) layoutMode.value = 'vertical'
}, { immediate: true })
onUnmounted(() => {
  stopDrag()
})

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const compressHighlight = (json) => {
  const re = /("(?:\\.|[^"\\])*")(\s*:)|("(?:\\.|[^"\\])*")|(\b-?\d+\.?\d*(?:e[+-]?\d+)?\b)|(\btrue\b|\bfalse\b)|(\bnull\b)|([[\]{}])/g
  return json.replace(re, (m, key, colon, str, num, bool, nul, br) => {
    if (key) return `<span class="json-key">${escapeHtml(key)}</span><span class="json-colon">${colon}</span>`
    if (str) return `<span class="json-string">${escapeHtml(str)}</span>`
    if (num) return `<span class="json-number">${num}</span>`
    if (bool) return `<span class="json-bool">${bool}</span>`
    if (nul) return `<span class="json-null">null</span>`
    if (br) return `<span class="json-bracket">${br}</span>`
    return escapeHtml(m)
  })
}

// 将 JSON 解析为树节点（对象/数组/基础值），供 JsonTree 递归渲染
const toTree = (val, key, index) => {
  if (val !== null && typeof val === 'object') {
    if (Array.isArray(val)) {
      return {
        type: 'array', key, index,
        children: val.map((v, i) => toTree(v, null, i))
      }
    }
    return {
      type: 'object', key, index,
      children: Object.entries(val).map(([k, v]) => toTree(v, k, null))
    }
  }
  return { type: 'primitive', key, index, value: val }
}

const treeData = computed(() => {
  if (parsedData.value === null || lastAction.value !== 'format') return null
  return toTree(parsedData.value, null, null)
})

// 压缩模式使用单行高亮文本
const resultHtml = computed(() => {
  if (parsedData.value === null || lastAction.value !== 'compress') return ''
  const str = JSON.stringify(parsedData.value)
  return highlight.value ? compressHighlight(str) : escapeHtml(str)
})

const resultText = computed(() => {
  if (parsedData.value === null || lastAction.value === null) return ''
  if (lastAction.value === 'compress') return JSON.stringify(parsedData.value)
  return JSON.stringify(parsedData.value, null, 2)
})

const parseInput = (action) => {
  errorMessage.value = ''
  if (!jsonInput.value || !jsonInput.value.trim()) {
    ElMessage.warning(t('tools.jsonOnlineParse.inputEmpty'))
    parsedData.value = null
    lastAction.value = null
    return false
  }
  try {
    parsedData.value = JSON.parse(jsonInput.value)
    lastAction.value = action
    return true
  } catch (e) {
    parsedData.value = null
    lastAction.value = null
    errorMessage.value = e.message || String(e)
    return false
  }
}

const formatJson = () => parseInput('format')
const compressJson = () => parseInput('compress')

const clearAll = () => {
  jsonInput.value = ''
  parsedData.value = null
  lastAction.value = null
  errorMessage.value = ''
}

const copyResult = () => {
  const text = resultText.value
  if (!text) {
    ElMessage.warning(t('tools.jsonOnlineParse.copyEmpty'))
    return
  }
  copyToClipboard(text, t('common.success'))
}
</script>

<style scoped lang="scss">
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

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px; // 卡片内容内边距
  }
}

.op-bar {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;

  .el-button {
    min-width: 100px;
  }

  .layout-radio {
    margin-right: 4px;
  }
}

.content-area {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;

  &.vertical {
    flex-direction: column;
  }
}

// 左右布局时两个面板等高，上下布局时等宽
.pane {
  flex-basis: 0%; // 宽度严格由 flex-grow 比例决定，内容变化不会改变占比
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pane-input {
  .textarea-input {
    margin: 0; // 覆盖全局 .textarea-input 的 margin: 20px 0
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;

    :deep(.el-textarea) {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    :deep(.el-textarea__inner) {
      flex: 1;
      height: 100%;
      min-height: 0;
      resize: none;
    }
  }
}

.pane-output {
  .result-pre {
    flex: 1;
    height: 100%;
    margin: 0;
    padding: 10px 12px;
    overflow: auto;
    font-family: 'Courier New', Consolas, monospace;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre;
    word-break: break-all;
    background: #fafafa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    color: #303133;
  }

  // 树形结果容器（格式化模式）
  .result-tree {
    flex: 1;
    height: 100%;
    margin: 0;
    padding: 10px 12px;
    overflow: auto;
    background: #fafafa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    color: #303133;
  }

  // 无结果时的占位提示
  .result-placeholder {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c0c4cc;
    font-size: 14px;
    background: #fafafa;
    border: 1px dashed #e4e7ed;
    border-radius: 4px;
  }
}

.no-highlight {
  .json-key,
  .json-string,
  .json-number,
  .json-bool,
  .json-null,
  .json-bracket,
  .json-colon {
    color: inherit;
  }
}

.json-key {
  color: #d73a49;
}
.json-string {
  color: #22863a;
}
.json-number {
  color: #005cc5;
}
.json-bool {
  color: #6f42c1;
}
.json-null {
  color: #6a737d;
}
.json-bracket {
  color: #303133;
  font-weight: 600;
}
.json-colon {
  color: #303133;
}
.json-type {
  color: #e6a23c;
  font-size: 11px;
}
.json-idx {
  color: #909399;
  font-size: 11px;
}

.splitter {
  flex: 0 0 8px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &.splitter-v {
    cursor: col-resize;
  }
  &.splitter-h {
    cursor: row-resize;
  }
  &:hover {
    background: #e0e0e0;
  }

  .splitter-icon {
    fill: #909399;
    pointer-events: none;
  }
}

.tool-alert {
  flex-shrink: 0;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .op-bar {
    .el-button {
      flex: 1 1 calc(33.333% - 8px);
      min-width: auto;
    }
  }
}
</style>
