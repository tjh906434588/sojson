<template>
  <div class="container json-compare-container">
    <el-card class="tool-card json-compare-card">
      <!-- web：左一右；H5：上一下 -->
      <div class="compare-area" :class="{ vertical: isMobile }">
        <!-- 左/上：JSON A -->
        <div class="pane pane-left">
          <div class="pane-label">
            <span class="label-dot dot-left"></span>{{ $t('tools.jsonCompare.left') }}
          </div>
          <div class="editor-wrap">
            <pre ref="hlLeft" class="hl-layer" aria-hidden="true" v-html="leftHtml"></pre>
            <textarea
              ref="taLeft"
              v-model="leftText"
              wrap="off"
              spellcheck="false"
              class="cmp-textarea"
              :placeholder="$t('tools.jsonCompare.leftPlaceholder')"
              @scroll="syncScroll('left')"
            ></textarea>
          </div>
        </div>

        <!-- 右/下：JSON B -->
        <div class="pane pane-right">
          <div class="pane-label">
            <span class="label-dot dot-right"></span>{{ $t('tools.jsonCompare.right') }}
          </div>
          <div class="editor-wrap">
            <pre ref="hlRight" class="hl-layer" aria-hidden="true" v-html="rightHtml"></pre>
            <textarea
              ref="taRight"
              v-model="rightText"
              wrap="off"
              spellcheck="false"
              class="cmp-textarea"
              :placeholder="$t('tools.jsonCompare.rightPlaceholder')"
              @scroll="syncScroll('right')"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 底部：图例 + 对比结果 -->
      <div class="compare-footer">
        <div class="legend">
          <span class="legend-item"><i class="swatch swatch-add"></i>{{ $t('tools.jsonCompare.legendAdd') }}</span>
          <span class="legend-item"><i class="swatch swatch-diff"></i>{{ $t('tools.jsonCompare.legendDiff') }}</span>
        </div>
        <div class="result-text" :class="resultClass">{{ resultText }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIsMobile } from '@/utils'

const { t } = useI18n()

const leftText = ref('')
const rightText = ref('')
const isMobile = useIsMobile()

const taLeft = ref(null)
const taRight = ref(null)
const hlLeft = ref(null)
const hlRight = ref(null)

let leftTimer = null
let rightTimer = null

// ---------- JSON 解析与自动格式化 ----------

const parse = (s) => {
  const txt = (s || '').trim()
  if (!txt) return { ok: false, empty: true, data: null }
  try {
    return { ok: true, empty: false, data: JSON.parse(txt) }
  } catch (e) {
    return { ok: false, empty: false, data: null }
  }
}

const formatIfValid = (text) => {
  const r = parse(text)
  if (!r.ok) return null
  const formatted = JSON.stringify(r.data, null, 2)
  return formatted === text ? null : formatted
}

// 输入停止后自动格式化（仅当内容是合法 JSON）
watch(leftText, () => {
  clearTimeout(leftTimer)
  leftTimer = setTimeout(() => {
    const formatted = formatIfValid(leftText.value)
    if (formatted !== null) leftText.value = formatted
  }, 800)
})

watch(rightText, () => {
  clearTimeout(rightTimer)
  rightTimer = setTimeout(() => {
    const formatted = formatIfValid(rightText.value)
    if (formatted !== null) rightText.value = formatted
  }, 800)
})

// ---------- 递归 diff ----------

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const keyOf = (path) => path.map((s) => (typeof s === 'number' ? '[' + s + ']' : s)).join('.')

// 生成 path -> status 映射：same / changed / addedL / addedR
function diffMap(a, b, path, map) {
  const k = keyOf(path)
  if (deepEq(a, b)) {
    map.set(k, 'same')
    return
  }
  if (isObj(a) && isObj(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of keys) {
      const p = path.concat(key)
      if (key in a && key in b) diffMap(a[key], b[key], p, map)
      else if (key in a) map.set(keyOf(p), 'addedL')
      else map.set(keyOf(p), 'addedR')
    }
    return
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.max(a.length, b.length)
    for (let i = 0; i < len; i++) {
      const p = path.concat(i)
      if (i < a.length && i < b.length) diffMap(a[i], b[i], p, map)
      else if (i < a.length) map.set(keyOf(p), 'addedL')
      else map.set(keyOf(p), 'addedR')
    }
    return
  }
  // 标量或类型不同：差异
  map.set(k, 'changed')
}

const leftData = computed(() => parse(leftText.value))
const rightData = computed(() => parse(rightText.value))

const diffStatus = computed(() => {
  const map = new Map()
  const l = leftData.value
  const r = rightData.value
  if (l.ok && r.ok) diffMap(l.data, r.data, [], map)
  return map
})

// ---------- 高亮行生成 ----------

// 解析 JSON.stringify(data, null, 2) 格式化文本，返回每行对应的路径
function scanPaths(text) {
  const lines = text.split('\n')
  const stack = [] // { kind: 'obj'|'arr', key }
  const counters = [] // 与 stack 对齐，数组元素计数
  const keyRe = /^"((?:[^"\\]|\\.)*)"\s*:/
  const out = []

  for (const raw of lines) {
    const trimmed = raw.trim()
    const depth = Math.floor((raw.length - raw.replace(/^ */, '').length) / 2)
    const path = () => stack.map((c) => c.key).filter((k) => k !== null && k !== undefined)

    // 闭合行时，被关闭的容器仍在栈中（索引 == depth），只需弹出其更深层
    const isClosing = trimmed.startsWith('}') || trimmed.startsWith(']')
    const targetLen = isClosing ? depth + 1 : depth
    while (stack.length > targetLen) {
      stack.pop()
      counters.pop()
    }

    if (isClosing) {
      // 闭合行：所属容器即当前栈顶
      const p = [...path()]
      if (stack.length) {
        stack.pop()
        counters.pop()
      }
      out.push(p)
    } else {
      const m = trimmed.match(keyRe)
      if (m && stack.length && stack[stack.length - 1].kind === 'obj') {
        // 对象内的 key 行
        const key = JSON.parse('"' + m[1] + '"')
        const rest = trimmed.slice(m[0].length).trim().replace(/,$/, '')
        const p = [...path(), key]
        if (rest === '{' || rest === '[') {
          stack.push({ kind: rest === '{' ? 'obj' : 'arr', key })
          counters.push(0)
        }
        out.push(p)
      } else if (stack.length && stack[stack.length - 1].kind === 'arr') {
        // 数组元素行
        const idx = counters[counters.length - 1]++
        const rest = trimmed.replace(/,$/, '')
        const p = [...path(), idx]
        if (rest === '{' || rest === '[') {
          stack.push({ kind: rest === '{' ? 'obj' : 'arr', key: idx })
          counters.push(0)
        }
        out.push(p)
      } else if (!stack.length && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
        // 根容器打开
        stack.push({ kind: trimmed.startsWith('{') ? 'obj' : 'arr', key: null })
        counters.push(0)
        out.push([])
      } else {
        out.push([...path()])
      }
    }
  }
  return out
}

// 将文本拆成带样式类名的行
function buildLines(text, map) {
  if (!text) return []
  const rawLines = text.split('\n')
  const paths = scanPaths(text)
  const result = []
  const N = rawLines.length
  for (let i = 0; i < N; i++) {
    const p = paths[i] || []
    let cls = ''
    if (p.length > 0) {
      // 任一祖先为新增 → 整棵子树标"新增"
      let added = false
      for (let j = 0; j <= p.length; j++) {
        const st = map.get(keyOf(p.slice(0, j)))
        if (st === 'addedL' || st === 'addedR') {
          added = true
          break
        }
      }
      if (added) {
        cls = 'line-add'
      } else if (map.get(keyOf(p)) === 'changed') {
        cls = 'line-diff'
      }
    }
    result.push({ text: i < N - 1 ? rawLines[i] + '\n' : rawLines[i], cls })
  }
  return result
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const linesToHtml = (lines) => lines.map((l) => '<span class="' + l.cls + '">' + esc(l.text) + '</span>').join('')

const leftLines = computed(() => buildLines(leftText.value, diffStatus.value))
const rightLines = computed(() => buildLines(rightText.value, diffStatus.value))
const leftHtml = computed(() => linesToHtml(leftLines.value))
const rightHtml = computed(() => linesToHtml(rightLines.value))

// ---------- 对比结果摘要 ----------

const summary = computed(() => {
  let adds = 0
  let diffs = 0
  for (const v of diffStatus.value.values()) {
    if (v === 'addedL' || v === 'addedR') adds++
    else if (v === 'changed') diffs++
  }
  return { adds, diffs }
})

const resultText = computed(() => {
  const l = leftData.value
  const r = rightData.value
  if (l.empty && r.empty) return t('tools.jsonCompare.emptyBoth')
  if (!l.ok || !r.ok) {
    if (!l.ok && !r.ok) return t('tools.jsonCompare.invalidBoth')
    return l.ok ? t('tools.jsonCompare.invalidRight') : t('tools.jsonCompare.invalidLeft')
  }
  const s = summary.value
  if (s.adds === 0 && s.diffs === 0) return t('tools.jsonCompare.identical')
  return t('tools.jsonCompare.diffSummary', { adds: s.adds, diffs: s.diffs })
})

const resultClass = computed(() => {
  const l = leftData.value
  const r = rightData.value
  if (!l.ok || !r.ok) return 'result-invalid'
  const s = summary.value
  return s.adds === 0 && s.diffs === 0 ? 'result-ok' : 'result-diff'
})

// ---------- 高亮层滚动同步 ----------

const syncScroll = (side) => {
  const ta = side === 'left' ? taLeft.value : taRight.value
  const hl = side === 'left' ? hlLeft.value : hlRight.value
  if (ta && hl) {
    hl.scrollTop = ta.scrollTop
    hl.scrollLeft = ta.scrollLeft
  }
}
</script>

<style scoped lang="scss">
// web：左一右布局
.compare-area {
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

  .pane-label {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
    user-select: none;
  }

  .label-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &.dot-left {
      background: #409eff;
    }

    &.dot-right {
      background: #67c23a;
    }
  }

  .editor-wrap {
    flex: 1;
    min-height: 0;
    position: relative;
    overflow: hidden;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
  }
}

// 高亮层与输入框必须完全同字体同间距
.hl-layer,
.cmp-textarea {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 8px 10px;
  border: none;
  outline: none;
  box-sizing: border-box;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  tab-size: 2;
  white-space: pre;
  word-break: normal;
}

.hl-layer {
  color: transparent;
  pointer-events: none;
  overflow: hidden; // 不自行滚动，跟随 textarea
  z-index: 0;

  :deep(span.line-add) {
    background: rgba(103, 194, 58, 0.42);
  }

  :deep(span.line-diff) {
    background: rgba(230, 162, 60, 0.55);
  }
}

.cmp-textarea {
  z-index: 1;
  background: transparent;
  resize: none;
  caret-color: #409eff;
  color: #303133;

  &::placeholder {
    color: #a8abb2;
    font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  }
}

// 底部：图例 + 结果
.compare-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  min-height: 28px;
}

.legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #606266;

    .swatch {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      flex-shrink: 0;

      &.swatch-add {
        background: rgba(103, 194, 58, 0.7);
      }

      &.swatch-diff {
        background: rgba(230, 162, 60, 0.8);
      }
    }
  }
}

.result-text {
  font-size: 13px;
  font-weight: 600;

  &.result-ok {
    color: #67c23a;
  }

  &.result-diff {
    color: #e6a23c;
  }

  &.result-invalid {
    color: #f56c6c;
  }
}

// H5：上一下布局
@media (max-width: 768px) {
  .compare-area {
    gap: 10px;
  }

  .compare-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
