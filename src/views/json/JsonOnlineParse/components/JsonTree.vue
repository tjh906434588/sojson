<template>
  <div class="jt-node" :class="{ 'jt-no-highlight': !highlight }">
    <!-- 对象节点 -->
    <div v-if="node.type === 'object'" class="jt-block">
      <div class="jt-line jt-fold" @click.stop="toggle">
        <span v-if="node.key !== null" class="jt-key">&quot;{{ node.key }}&quot;</span>
        <span v-if="node.key !== null" class="jt-colon">:</span>
        <span v-else-if="showIndex && node.index !== null" class="jt-idx">{{ circle(node.index) }}</span>
        <span class="jt-arrow">{{ expanded ? '▾' : '▸' }}</span>
        <span class="jt-bracket">{{ expanded ? '{' : '{ … }' }}</span>
        <span v-if="showType" class="jt-type">[object]</span>
      </div>
      <div v-show="expanded" class="jt-children">
        <JsonTree
          v-for="(child, i) in node.children"
          :key="i"
          :node="child"
          :highlight="highlight"
          :show-type="showType"
          :show-index="showIndex"
        />
      </div>
      <div v-show="expanded" class="jt-line jt-close">
        <span class="jt-bracket">}</span>
      </div>
    </div>

    <!-- 数组节点 -->
    <div v-else-if="node.type === 'array'" class="jt-block">
      <div class="jt-line jt-fold" @click.stop="toggle">
        <span v-if="node.key !== null" class="jt-key">&quot;{{ node.key }}&quot;</span>
        <span v-if="node.key !== null" class="jt-colon">:</span>
        <span v-else-if="showIndex && node.index !== null" class="jt-idx">{{ circle(node.index) }}</span>
        <span class="jt-arrow">{{ expanded ? '▾' : '▸' }}</span>
        <span class="jt-bracket">{{ expanded ? '[' : '[ … ]' }}</span>
        <span v-if="showType" class="jt-type">[array]</span>
      </div>
      <div v-show="expanded" class="jt-children">
        <JsonTree
          v-for="(child, i) in node.children"
          :key="i"
          :node="child"
          :highlight="highlight"
          :show-type="showType"
          :show-index="showIndex"
        />
      </div>
      <div v-show="expanded" class="jt-line jt-close">
        <span class="jt-bracket">]</span>
      </div>
    </div>

    <!-- 基础值节点 -->
    <div v-else class="jt-line">
      <span v-if="node.key !== null" class="jt-key">&quot;{{ node.key }}&quot;</span>
      <span v-if="node.key !== null" class="jt-colon">:</span>
      <span v-else-if="showIndex && node.index !== null" class="jt-idx">{{ circle(node.index) }}</span>
      <span class="jt-value" :class="valueClass">{{ valueText }}</span>
      <span v-if="showType" class="jt-type">[{{ typeText }}]</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({ name: 'JsonTree' })

const props = defineProps({
  node: { type: Object, required: true },
  highlight: { type: Boolean, default: true },
  showType: { type: Boolean, default: false },
  showIndex: { type: Boolean, default: true }
})

const expanded = ref(true)
const toggle = () => {
  expanded.value = !expanded.value
}

// 圈数字角标：1-20 用 ①②③…，超过 20 退回普通数字
// 圈数字角标从 0 开始（⓪①…），超过 20 退回普通数字
const CIRCLES = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']
const circle = (i) => (CIRCLES[i] !== undefined ? CIRCLES[i] : String(i + 1))

const typeText = computed(() => {
  const v = props.node.value
  if (v === null) return 'null'
  if (typeof v === 'string') return 'string'
  if (typeof v === 'number') return 'number'
  if (typeof v === 'boolean') return 'boolean'
  return typeof v
})
const valueClass = computed(() => {
  const v = props.node.value
  if (v === null) return 'jt-null'
  if (typeof v === 'string') return 'jt-string'
  if (typeof v === 'number') return 'jt-number'
  if (typeof v === 'boolean') return 'jt-bool'
  return ''
})
const valueText = computed(() => {
  const v = props.node.value
  if (typeof v === 'string') return `"${v}"`
  return String(v)
})
</script>

<style scoped lang="scss">
.jt-node {
  font-family: var(--font-code);
  font-size: var(--font-size-md);
  line-height: 22px;
  color: var(--text-primary);
}

.jt-line {
  white-space: pre;
  word-break: break-all;
  padding: 1px 0;
}

// 可折叠行
.jt-fold {
  cursor: pointer;
  user-select: none;
  border-radius: 3px;

  &:hover {
    background: #f0f2f5;
  }
}

.jt-children {
  padding-left: 18px;
}

.jt-key {
  color: #d73a49;
}

.jt-colon {
  color: var(--text-primary);
  margin-right: 2px;
}

// 数组圈数字角标：橙色加粗，与内容明显区分
.jt-idx {
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 15px;
  line-height: 1;
  vertical-align: middle;
  margin-right: 4px;
}

.jt-bracket {
  color: var(--text-primary);
  font-weight: 600;
}

.jt-arrow {
  display: inline-block;
  width: 14px;
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

.jt-string {
  color: #22863a;
}

.jt-number {
  color: #005cc5;
}

.jt-bool {
  color: #6f42c1;
}

.jt-null {
  color: #6a737d;
  font-style: italic;
}

.jt-type {
  color: var(--color-warning);
  font-size: var(--font-size-xs);
}

// 关闭高亮时统一内容颜色；角标与数据类型颜色保持不变，便于区分
.jt-no-highlight {
  .jt-key,
  .jt-string,
  .jt-number,
  .jt-bool,
  .jt-null,
  .jt-bracket,
  .jt-colon,
  .jt-arrow {
    color: var(--text-primary);
  }
}
</style>
