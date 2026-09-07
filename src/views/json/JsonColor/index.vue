<template>
  <div class="container">
    <el-card class="tool-card">
      <!-- 上方输入区 -->
      <el-input
        v-model="jsonInput"
        type="textarea"
        :rows="8"
        :placeholder="$t('tools.jsonColor.input')"
        class="textarea-input"
      />

      <!-- 中间控制区（一行展示） -->
      <div class="control-bar">
        <span class="ctrl-label">{{ $t('tools.jsonColor.indent') }}</span>
        <el-select v-model="indent" class="ctrl-select" size="default">
          <el-option v-for="n in 6" :key="n" :label="`${n}`" :value="n" />
        </el-select>

        <el-checkbox v-model="showQuotes" class="ctrl-quote">{{ $t('tools.jsonColor.quotes') }}</el-checkbox>

        <el-checkbox v-model="displayControl">{{ $t('tools.jsonColor.displayControl') }}</el-checkbox>

        <template v-if="displayControl">
          <el-button :icon="allExpanded ? Fold : Expand" size="default" @click="toggleExpandAll">
            {{ allExpanded ? $t('tools.jsonColor.collapse') : $t('tools.jsonColor.expand') }}
          </el-button>
          <el-select
            v-model="expandLevel"
            class="ctrl-select ctrl-select-level"
            :placeholder="$t('tools.jsonColor.level')"
            clearable
            size="default"
            @change="onLevelChange"
          >
            <el-option v-for="n in [2, 3, 4, 5, 6, 7, 8]" :key="n" :label="`${n} ${$t('tools.jsonColor.levelUnit')}`" :value="n" />
          </el-select>
        </template>

        <el-button type="primary" :icon="Document" class="format-btn" @click="formatJson">
          {{ $t('buttons.format') }}
        </el-button>
      </div>

      <!-- 下方只读展示区 -->
      <div class="output-area" :class="{ 'no-interact': !interactive }">
        <template v-if="lines.length">
          <div
            v-for="(ln, i) in lines"
            :key="i"
            class="jline"
            :style="{ paddingLeft: ln.depth * indent * 8 + 'px' }"
          >
            <template v-if="ln.kind === 'entry'">
              <span v-if="ln.key !== null" class="jkey">{{ keyText(ln.key) }}</span>
              <span v-if="ln.key !== null" class="jpunct">: </span>
              <span v-if="ln.value && ln.value.type === 'prim'" class="jval">{{ ln.value.text }}</span>
              <template v-else-if="ln.value && ln.value.type === 'open'">
                <span class="jbr" :class="braceClass(ln.value.token)">{{ ln.value.token }}</span><span v-if="interactive" class="jtgl" @click="interactive && toggle(ln.value.node)">-</span>
              </template>
              <template v-else-if="ln.value && ln.value.type === 'collapsed'">
                <span class="jbr" :class="braceClass(ln.value.open)">{{ ln.value.open }}</span><span v-if="interactive" class="jtgl" @click="interactive && toggle(ln.value.node)">+</span>
                <span class="jdots"> ... </span>
                <span class="jbr" :class="braceClass(ln.value.close)">{{ ln.value.close }}</span>
              </template>
              <span v-if="ln.value && ln.value.type === 'prim'" class="jpunct">,</span>
            </template>
            <template v-else-if="ln.kind === 'prim'">
              <span class="jval">{{ ln.text }}</span>
            </template>
            <template v-else-if="ln.kind === 'open'">
              <span class="jbr" :class="braceClass(ln.token)">{{ ln.token }}</span><span v-if="interactive" class="jtgl" @click="interactive && toggle(ln.node)">-</span>
            </template>
            <template v-else-if="ln.kind === 'collapsed'">
              <span class="jbr" :class="braceClass(ln.open)">{{ ln.open }}</span><span v-if="interactive" class="jtgl" @click="interactive && toggle(ln.node)">+</span>
              <span class="jdots"> ... </span>
              <span class="jbr" :class="braceClass(ln.close)">{{ ln.close }}</span>
            </template>
            <template v-else-if="ln.kind === 'close'">
              <span class="jbr" :class="braceClass(ln.token)">{{ ln.token }}</span>
            </template>
          </div>
        </template>
        <div v-else class="output-empty">{{ $t('tools.jsonColor.outputEmpty') }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Document, Expand, Fold } from '@element-plus/icons-vue'

const { t } = useI18n()

const jsonInput = ref('')
const indent = ref(2)
const showQuotes = ref(true)
const displayControl = ref(true)
const expandLevel = ref(null)

let tree = null
const version = ref(0)
let expandedMap = new WeakMap()

const interactive = computed(() => displayControl.value)

const isContainer = (n) => n !== null && typeof n === 'object'

const walkContainers = (node, fn) => {
  if (!isContainer(node)) return
  fn(node)
  if (Array.isArray(node)) node.forEach((c) => walkContainers(c, fn))
  else Object.values(node).forEach((c) => walkContainers(c, fn))
}

// 按深度遍历容器：depth 从 1 开始（根为第 1 级）
const walkContainersWithDepth = (node, depth, fn) => {
  if (!isContainer(node)) return
  fn(node, depth)
  if (Array.isArray(node)) node.forEach((c) => walkContainersWithDepth(c, depth + 1, fn))
  else Object.values(node).forEach((c) => walkContainersWithDepth(c, depth + 1, fn))
}

const formatPrimitive = (v) => {
  if (v === null) return 'null'
  if (typeof v === 'string') return JSON.stringify(v)
  return String(v)
}

const keyText = (k) => (showQuotes.value ? JSON.stringify(k) : String(k))

const braceClass = (token) => (token === '{' || token === '}') ? 'jbrace' : 'jbracket'

const buildLines = (node, depth, out, attach) => {
  const isObj = node !== null && typeof node === 'object' && !Array.isArray(node)
  const isArr = Array.isArray(node)
  if (!isObj && !isArr) {
    const text = formatPrimitive(node)
    if (attach) attach.value = { type: 'prim', text }
    else out.push({ kind: 'prim', depth, text })
    return
  }
  const open = isObj ? '{' : '['
  const close = isObj ? '}' : ']'
  const expanded = interactive.value ? !!expandedMap.get(node) : true
  if (attach) {
    attach.value = expanded
      ? { type: 'open', token: open, node }
      : { type: 'collapsed', open, close, node }
  } else {
    out.push(expanded
      ? { kind: 'open', depth, token: open, node }
      : { kind: 'collapsed', depth, open, close, node })
  }
  if (!expanded) return
  if (isObj) {
    Object.keys(node).forEach((k) => {
      const entry = { kind: 'entry', depth: depth + 1, key: k, value: null, comma: true }
      out.push(entry)
      buildLines(node[k], depth + 1, out, entry)
    })
  } else {
    for (let i = 0; i < node.length; i++) {
      const entry = { kind: 'entry', depth: depth + 1, key: null, value: null, comma: true }
      out.push(entry)
      buildLines(node[i], depth + 1, out, entry)
    }
  }
  out.push({ kind: 'close', depth, token: close, node })
}

const lines = computed(() => {
  version.value
  if (!tree) return []
  const out = []
  buildLines(tree, 0, out, null)
  return out
})

const toggle = (node) => {
  if (!interactive.value) return
  expandedMap.set(node, !expandedMap.get(node))
  version.value++
}

const allExpanded = computed(() => {
  version.value
  if (!tree) return true
  let all = true
  walkContainers(tree, (n) => {
    if (!expandedMap.get(n)) all = false
  })
  return all
})

const toggleExpandAll = () => {
  if (!tree) return
  const target = !allExpanded.value
  walkContainers(tree, (n) => expandedMap.set(n, target))
  version.value++
}

const onLevelChange = (v) => {
  if (!tree) return
  if (v == null) {
    walkContainers(tree, (n) => expandedMap.set(n, true))
  } else {
    walkContainersWithDepth(tree, 1, (n, depth) => expandedMap.set(n, depth <= v))
  }
  version.value++
}

const formatJson = () => {
  if (!jsonInput.value.trim()) {
    ElMessage.warning(t('tools.jsonColor.inputEmpty'))
    return
  }
  let parsed
  try {
    parsed = JSON.parse(jsonInput.value)
  } catch (e) {
    ElMessage.error(t('tools.jsonColor.parseError'))
    return
  }
  tree = parsed
  expandLevel.value = null
  expandedMap = new WeakMap()
  walkContainers(tree, (n) => expandedMap.set(n, true))
  version.value++
}
</script>

<style scoped lang="scss">
.textarea-input {
  margin: 0;
  // 固定高度输入框：不随卡片撑满（覆盖全局 .textarea-input 的 flex: 1）
  flex: none;
}

// 中间控制区：一行展示
.control-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 16px 0;

  .ctrl-label {
    font-size: 14px;
    color: #606266;
  }

  .ctrl-select {
    width: 60px;
  }

  .ctrl-select-level {
    width: 100px;
  }

  .ctrl-quote {
    margin-right: 0;
  }

  .format-btn {
    margin-left: auto;
  }
}

// 下方只读展示区
.output-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Consolas', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre;
  color: #303133;
  box-sizing: border-box;

  .jline {
    white-space: pre;
    min-height: 1.7em;
  }

  .jbr {
    cursor: default;
    user-select: none;
  }

  .jtgl {
    color: #909399;
    cursor: pointer;
    user-select: none;
    display: inline-block;
    width: 14px;
    text-align: center;
    font-weight: 600;
  }

  &.no-interact {
    .jbr {
      cursor: default;
    }
    .jtgl {
      cursor: default;
    }
  }

  .jkey {
    color: #7c3aed;
    font-weight: 500;
  }

  .jval {
    color: #0a9d8c;
  }

  .jbrace {
    color: #e6a23c;
  }

  .jbracket {
    color: #409eff;
  }

  .jpunct {
    color: #303133;
  }

  .jdots {
    color: #909399;
  }

  .output-empty {
    color: #909399;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .control-bar {
    gap: 10px;

    .ctrl-select {
      width: 50px;
    }
    .ctrl-select-level {
      width: 85px;
    }

    // H5 下控制行按钮缩小
    :deep(.el-button) {
      height: 24px;
      padding: 0 10px;
      font-size: 12px;
    }

    // H5 下选择框整体变小（类似按钮 size=small）
    :deep(.el-select__wrapper) {
      height: 24px;
      min-height: 24px;
      font-size: 12px;
      padding: 0 8px;
    }
    :deep(.el-select__placeholder),
    :deep(.el-select__selected-item) {
      font-size: 12px;
    }
  }
}
</style>
