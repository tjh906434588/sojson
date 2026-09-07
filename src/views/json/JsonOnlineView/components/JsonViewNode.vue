<template>
  <div
    class="jvt-node"
    :class="{ 'jvt-root': isRoot, 'jvt-dragging': node.id === draggedId, 'jvt-drop-inside': dragOverId === node.id && dragPosition === 'inside' }"
    @dragover="onNodeDragOver"
    @drop="onNodeDrop"
  >
    <!-- 拖拽占位指示 -->
    <div
      v-if="dragOverId === node.id && dragPosition === 'before'"
      class="jvt-drop-line jvt-drop-before"
    />

    <div class="jvt-row" :style="{ '--indent': depth * 18 + 'px' }">
      <!-- 左侧拖拽手柄（非根节点） -->
      <div v-if="!isRoot" class="jvt-drag-handle" title="拖动" draggable="true" @dragstart="$emit('drag-start', node)" @dragend="$emit('drag-end')">
        <span v-for="i in 6" :key="i" class="jvt-dot" />
      </div>
      <div v-else class="jvt-drag-placeholder" />

      <!-- 层级缩进 spacer -->
      <div class="jvt-indent" :style="{ width: depth * 18 + 'px' }" />

      <!-- 展开/折叠箭头（对象/数组） -->
      <span
        v-if="isContainer"
        class="jvt-arrow"
        @click="$emit('toggle', node)"
      >
        {{ node.expanded ? '▾' : '▸' }}
      </span>
      <span v-else class="jvt-arrow-placeholder" />

      <!-- Key 输入（对象）或索引（数组） -->
      <textarea
        v-if="!isRoot && parent && parent.type === 'object'"
        v-model="node.key"
        class="jvt-key-input jvt-area"
        :class="{ 'jvt-key-match': node._keyMatch, 'jvt-match-active': isActiveKey }"
        :data-active-match="isActiveKey ? 'yes' : undefined"
        rows="1"
        :cols="Math.max(displayWidth(String(node.key || '')) + 1, 2)"
        :ref="setAreaEl"
        @input="onKeyInput"
      />
      <span
        v-else-if="!isRoot"
        class="jvt-key"
        :class="{ 'jvt-key-match': node._keyMatch, 'jvt-match-active': isActiveKey }"
        :data-active-match="isActiveKey ? 'yes' : undefined"
      >{{ node.key }}</span>

      <span v-if="!isRoot" class="jvt-colon">:</span>

      <!-- 值输入（基础类型） -->
      <textarea
        v-if="!isContainer && !isRoot"
        v-model="node.value"
        class="jvt-value-input jvt-area"
        :class="[valueClass, { 'jvt-value-match': node._valueMatch, 'jvt-match-active': isActiveValue }]"
        :data-active-match="isActiveValue ? 'yes' : undefined"
        rows="1"
        :ref="setAreaEl"
        @input="onValueInput"
      />

      <!-- 最外层：类型标签 + 括号（展开/折叠始终显示） -->
      <template v-else-if="isRoot">
        <span class="jvt-type-label">{{ node.type }}</span>
        <span v-if="isContainer" class="jvt-bracket" @click="$emit('toggle', node)">
          {{ node.type === 'object' ? '{' + childCount + '}' : '[' + childCount + ']' }}
        </span>
        <textarea
          v-else
          v-model="node.value"
          class="jvt-value-input jvt-area"
          :class="[valueClass, { 'jvt-value-match': node._valueMatch, 'jvt-match-active': isActiveValue }]"
          :data-active-match="isActiveValue ? 'yes' : undefined"
          rows="1"
          :ref="setAreaEl"
          @input="onValueInput"
        />
      </template>

      <!-- 对象/数组括号（展开/折叠始终显示） -->
      <span v-else-if="isContainer" class="jvt-summary" @click="$emit('toggle', node)">
        {{ node.type === 'object' ? '{' + childCount + '}' : '[' + childCount + ']' }}
      </span>

      <!-- 右侧工具按钮 -->
      <div class="jvt-tools">
        <el-dropdown trigger="click" @command="(cmd) => $emit('change-type', node, cmd)">
          <span class="jvt-tool jvt-type-icon" :title="$t('tools.jsonOnlineView.type')">
            {{ typeIcon }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="auto"><span class="jvt-menu-icon">{{ typeIconOf('auto') }}</span>{{ $t('tools.jsonOnlineView.auto') }}</el-dropdown-item>
              <el-dropdown-item command="string"><span class="jvt-menu-icon">{{ typeIconOf('string') }}</span>{{ $t('tools.jsonOnlineView.string') }}</el-dropdown-item>
              <el-dropdown-item command="object"><span class="jvt-menu-icon">{{ typeIconOf('object') }}</span>{{ $t('tools.jsonOnlineView.object') }}</el-dropdown-item>
              <el-dropdown-item command="array"><span class="jvt-menu-icon">{{ typeIconOf('array') }}</span>{{ $t('tools.jsonOnlineView.array') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="jvt-tool jvt-copy" :class="{ 'jvt-hidden': isRoot }" :title="$t('tools.jsonOnlineView.copy')" @click="$emit('copy', node)">
          <el-icon><DocumentCopy /></el-icon>
        </span>
        <span class="jvt-tool jvt-delete" :class="{ 'jvt-hidden': isRoot }" :title="$t('tools.jsonOnlineView.delete')" @click="$emit('delete', node)">
          <el-icon><Close /></el-icon>
        </span>
      </div>
    </div>

    <!-- 子节点 -->
    <div v-if="isContainer && node.expanded" class="jvt-children">
      <JsonViewNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :is-root="false"
        :parent="node"
        :dragged-id="draggedId"
        :drag-over-id="dragOverId"
        :drag-position="dragPosition"
        :active-match="activeMatch"
        @toggle="$emit('toggle', $event)"
        @update-key="$emit('update-key', $event, $event.key)"
        @update-value="$emit('update-value', $event, $event.value)"
        @change-type="(nd, cmd) => $emit('change-type', nd, cmd)"
        @copy="$emit('copy', $event)"
        @delete="$emit('delete', $event)"
        @add="$emit('add', $event)"
        @drag-start="$emit('drag-start', $event)"
        @drag-end="$emit('drag-end')"
        @drag-over-item="(nd, pos) => $emit('drag-over-item', nd, pos)"
        @drop-item="(nd, pos) => $emit('drop-item', nd, pos)"
      />
      <!-- 添加按钮：仅点击图标时添加 -->
      <div
        class="jvt-add-row"
        :style="{ paddingLeft: (depth + 1) * 18 + 40 + 'px' }"
      >
        <span class="jvt-add-icon" @click="$emit('add', node)">
          <el-icon><Plus /></el-icon>
        </span>
      </div>
    </div>

    <div
      v-if="dragOverId === node.id && dragPosition === 'after'"
      class="jvt-drop-line jvt-drop-after"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DocumentCopy, Close, Plus } from '@element-plus/icons-vue'

defineOptions({ name: 'JsonViewNode' })

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  isRoot: { type: Boolean, default: false },
  parent: { type: Object, default: null },
  draggedId: { type: String, default: null },
  dragOverId: { type: String, default: null },
  dragPosition: { type: String, default: 'inside' },
  activeMatch: { type: Object, default: null }
})

const emit = defineEmits([
  'toggle', 'update-key', 'update-value', 'change-type', 'copy', 'delete', 'add',
  'drag-start', 'drag-end', 'drag-over-item', 'drop-item'
])

const isContainer = computed(() => {
  return props.node.type === 'object' || props.node.type === 'array'
})


const childCount = computed(() => props.node.children ? props.node.children.length : 0)

// 内容显示宽度：CJK 等宽字符按 2 计，用于 key 输入框自适应宽度
const displayWidth = (s) => {
  s = String(s || '')
  let w = 0
  for (let i = 0; i < s.length; i++) w += s.charCodeAt(i) > 255 ? 2 : 1
  return w
}

// 类型图标：object→{}，array→[]，auto→A，string→""
const typeIconOf = (t) => {
  if (t === 'object') return '{}'
  if (t === 'array') return '[]'
  if (t === 'auto') return 'A'
  return '""'
}

const typeIcon = computed(() => typeIconOf(props.node.type))

const isActiveKey = computed(
  () => props.activeMatch && props.activeMatch.id === props.node.id && props.activeMatch.field === 'key'
)
const isActiveValue = computed(
  () => props.activeMatch && props.activeMatch.id === props.node.id && props.activeMatch.field === 'value'
)

const valueClass = computed(() => {
  const t = props.node.type
  if (t === 'auto') {
    const v = String(props.node.value)
    if (v === 'null') return 'jvt-null'
    if (v === 'true' || v === 'false') return 'jvt-bool'
    if (/^-?\d+(\.\d+)?$/.test(v)) return 'jvt-number'
    return 'jvt-string'
  }
  return 'jvt-string'
})

// 文本域自适应高度：长内容换行后完整显示
const autoGrow = (el) => {
  if (!el) return
  el.style.height = 'auto'
  const h = el.scrollHeight
  if (h > 0) el.style.height = h + 'px'
}

const setAreaEl = (el) => {
  if (!el) return
  requestAnimationFrame(() => autoGrow(el))
}

const onKeyInput = (e) => {
  autoGrow(e.target)
  emit('update-key', props.node, props.node.key)
}

const onValueInput = (e) => {
  autoGrow(e.target)
  emit('update-value', props.node, props.node.value)
}

// 拖拽位置计算与转发
const calcDragPosition = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const y = e.clientY - rect.top
  const h = rect.height || 1
  if (y < h * 0.25) return 'before'
  if (y > h * 0.75) return 'after'
  return 'inside'
}

const onNodeDragOver = (e) => {
  emit('drag-over-item', props.node, calcDragPosition(e))
  e.preventDefault()
  e.stopPropagation()
}

const onNodeDrop = (e) => {
  emit('drop-item', props.node, calcDragPosition(e))
  e.preventDefault()
  e.stopPropagation()
}
</script>

<style scoped lang="scss">
.jvt-node {
  position: relative;
}

.jvt-row {
  --indent: 0px;
  --avail: calc(100% - var(--indent) - 143px);
  --half: max(60px, calc(var(--avail) / 2));
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  min-height: 28px;
  padding: 2px 4px;
  border-radius: 3px;
  transition: background 0.15s;
  overflow: hidden;

  &:hover {
    background: #f5f7fa;
  }
}

.jvt-key-input.jvt-key-match,
.jvt-key.jvt-key-match,
.jvt-value-input.jvt-value-match {
  background: #fff1b8;
  border-radius: 2px;
}

.jvt-key-input.jvt-match-active,
.jvt-key.jvt-match-active,
.jvt-value-input.jvt-match-active {
  background: #ffc53d;
  box-shadow: 0 0 0 1px #ffc53d;
  border-radius: 2px;
}

.jvt-drag-handle {
  width: 14px;
  height: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  margin-right: 6px;
  cursor: grab;
  opacity: 0.4;

  &:hover {
    opacity: 0.8;
  }
}

.jvt-dot {
  width: 3px;
  height: 3px;
  background: #909399;
  border-radius: 50%;
}

.jvt-drag-placeholder {
  width: 20px;
}

.jvt-indent {
  flex-shrink: 0;
}

.jvt-arrow,
.jvt-arrow-placeholder {
  display: inline-block;
  width: 16px;
  text-align: center;
  color: #606266;
  cursor: pointer;
  user-select: none;
}

.jvt-key-input,
.jvt-value-input {
  border: 1px solid transparent;
  background: transparent;
  padding: 0 4px;
  font-family: inherit;
  font-size: inherit;
  line-height: 20px;
  outline: none;

  &:focus {
    border-color: #409eff;
    background: #fff;
  }
}

.jvt-key-input {
  color: #d73a49;
  flex: 0 0 auto;
  min-width: 2ch;
  max-width: var(--half, 100%);
}

.jvt-key {
  color: #303133;
  margin-right: 2px;
}

.jvt-colon {
  color: #606266;
  margin-right: 4px;
}

.jvt-value-input {
  flex: 1 0 0%;
  min-width: var(--half, 60px);
  max-width: 100%;
  margin-right: 20px;
  color: #22863a;
}

.jvt-area {
  resize: none;
  overflow: hidden;
  height: auto;
  min-height: 20px;
  display: block;
  white-space: pre-wrap;
  word-break: break-all;
  vertical-align: top;
}

.jvt-summary {
  color: #606266;
  cursor: pointer;
}

.jvt-type-label {
  color: #409eff;
  font-weight: 600;
  margin-right: 4px;
}

.jvt-bracket {
  color: #606266;
  cursor: pointer;
  margin-right: 4px;
}

.jvt-tools {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding-left: 4px;
  flex-shrink: 0;
}

.jvt-tool {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #909399;
  border-radius: 3px;

  &:hover {
    background: #e4e7ed;
    color: #606266;
  }
}

.jvt-type-icon {
  font-size: 11px;
  font-weight: 600;
}

.jvt-menu-icon {
  display: inline-block;
  min-width: 16px;
  margin-right: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #606266;
  text-align: center;
}

.jvt-hidden {
  visibility: hidden;
  pointer-events: none;
}

.jvt-add-row {
  display: flex;
  align-items: center;
  height: 24px;
}

.jvt-add-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #909399;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    color: #409eff;
    background: #e4e7ed;
  }
}

.jvt-drop-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #409eff;
  z-index: 2;
}

.jvt-drop-before {
  top: -1px;
}

.jvt-drop-after {
  bottom: -1px;
}

.jvt-drop-inside > .jvt-row {
  background: #ecf5ff;
  box-shadow: inset 0 0 0 1px #409eff;
}

.jvt-dragging {
  opacity: 0.4;
}

.jvt-string { color: #22863a; }
.jvt-number { color: #005cc5; }
.jvt-bool { color: #6f42c1; }
.jvt-null { color: #6a737d; font-style: italic; }
</style>
