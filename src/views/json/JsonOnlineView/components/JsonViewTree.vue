<template>
  <div class="jvt-tree" @dragover="onTreeDragOver" @drop="onTreeDrop">
    <JsonViewNode
      :node="root"
      :depth="0"
      :is-root="true"
      :active-match="activeMatch"
      :dragged-id="draggedId"
      :drag-over-id="state.dragOverId"
      :drag-position="state.dragPosition"
      @toggle="toggleNode"
      @update-key="updateKey"
      @update-value="updateValue"
      @change-type="changeType"
      @copy="copyNode"
      @delete="deleteNode"
      @add="addChild"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
      @drag-over-item="onDragOverItem"
      @drop-item="onDropItem"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import JsonViewNode from './JsonViewNode.vue'

const props = defineProps({
  root: { type: Object, required: true },
  activeMatch: { type: Object, default: null }
})

const emit = defineEmits(['update'])

const draggedId = computed(() => state.draggedId)

const state = reactive({
  draggedId: null,
  dragOverId: null,
  dragPosition: 'inside' // 'before' | 'inside' | 'after'
})

const toggleNode = (node) => {
  node.expanded = !node.expanded
  emit('update')
}

const updateKey = (node, newKey) => {
  node.key = newKey
  emit('update')
}

const updateValue = (node, newValue) => {
  node.value = newValue
  if (node.type === 'auto') {
    // auto 模式下根据新值推断真实类型，但保持 type 为 auto
  }
  emit('update')
}

const changeType = (node, newType) => {
  const oldType = node.type
  if (newType === 'object') {
    node.type = 'object'
    node.value = undefined
    node.children = node.children || []
    // 数组转对象：下标即 key（保留原 value）
    if (oldType === 'array') {
      node.children.forEach((c, i) => { c.key = String(i) })
    }
    node.expanded = true
  } else if (newType === 'array') {
    node.type = 'array'
    node.value = undefined
    node.children = node.children || []
    // 对象转数组：只保留 value，key 改为数组下标
    if (oldType === 'object') {
      node.children.forEach((c, i) => { c.key = String(i) })
    }
    node.expanded = true
  } else if (newType === 'string') {
    node.type = 'string'
    if (node.children && node.children.length) {
      node.value = JSON.stringify(nodeToJson(node))
    } else if (node.value === undefined || node.value === null) {
      node.value = ''
    } else {
      node.value = String(node.value)
    }
    node.children = undefined
  } else if (newType === 'auto') {
    node.type = 'auto'
    // 保持当前值，序列化时自动推断
  }
  emit('update')
}

const copyNode = (node) => {
  const parent = findParent(props.root, node.id)
  if (!parent) return
  const clone = deepCloneNode(node)
  clone.id = genId()
  regenerateIds(clone)
  const idx = parent.children.findIndex((c) => c.id === node.id)
  parent.children.splice(idx + 1, 0, clone)
  if (parent.type === 'array') reindexArray(parent)
  emit('update')
}

const deleteNode = (node) => {
  const parent = findParent(props.root, node.id)
  if (!parent) return
  parent.children = parent.children.filter((c) => c.id !== node.id)
  if (parent.type === 'array') reindexArray(parent)
  emit('update')
}

const addChild = (parentNode) => {
  const newNode = {
    id: genId(),
    key: parentNode.type === 'array' ? String(parentNode.children.length) : 'newKey',
    value: '',
    type: 'string',
    expanded: false,
    children: undefined
  }
  parentNode.children = parentNode.children || []
  parentNode.children.push(newNode)
  if (parentNode.type === 'array') reindexArray(parentNode)
  parentNode.expanded = true
  emit('update')
}

// 拖拽逻辑
const onDragStart = (node) => {
  state.draggedId = node.id
}

const onDragEnd = () => {
  state.draggedId = null
  state.dragOverId = null
}

const onDragOverItem = (node, position) => {
  state.dragOverId = node.id
  state.dragPosition = position
}

const onDropItem = (targetNode, position) => {
  const draggedNode = findNode(props.root, state.draggedId)
  if (!draggedNode || draggedNode.id === props.root.id) return
  // 不能拖到自己上面或自己子树里
  if (targetNode.id === draggedNode.id) return
  if (isAncestor(draggedNode, targetNode.id)) return

  const oldParent = findParent(props.root, draggedNode.id)
  if (!oldParent) return

  // 先校验目标位置合法性，避免移除后再失败导致节点丢失
  if (position === 'inside') {
    if (targetNode.type !== 'object' && targetNode.type !== 'array') return
  } else if (!findParent(props.root, targetNode.id)) {
    return
  }

  // 记录旧索引并移除
  const oldIdx = oldParent.children.findIndex((c) => c.id === draggedNode.id)
  oldParent.children.splice(oldIdx, 1)
  if (oldParent.type === 'array') reindexArray(oldParent)

  let newParent = null
  let insertIndex = -1

  if (position === 'inside') {
    newParent = targetNode
    newParent.children = newParent.children || []
    insertIndex = newParent.children.length
  } else {
    newParent = findParent(props.root, targetNode.id)
    insertIndex = newParent ? newParent.children.findIndex((c) => c.id === targetNode.id) : -1
    if (insertIndex === -1) {
      // 回退：放回原来位置
      oldParent.children.splice(Math.min(oldIdx, oldParent.children.length), 0, draggedNode)
      if (oldParent.type === 'array') reindexArray(oldParent)
      emit('update')
      return
    }
    if (position === 'after') insertIndex += 1
  }

  newParent.children.splice(insertIndex, 0, draggedNode)
  if (newParent.type === 'array') reindexArray(newParent)
  // 从数组拖到对象时，索引 key 重置为默认键名
  if (newParent.type === 'object' && oldParent.type === 'array') {
    draggedNode.key = 'newKey'
  }

  state.draggedId = null
  state.dragOverId = null
  emit('update')
}

const onTreeDragOver = (e) => {
  e.preventDefault()
}

const onTreeDrop = (e) => {
  e.preventDefault()
}

// 工具函数
const genId = (() => {
  let n = 0
  return () => `n-${Date.now()}-${++n}`
})()

const findNode = (root, id) => {
  if (root.id === id) return root
  if (root.children) {
    for (const c of root.children) {
      const r = findNode(c, id)
      if (r) return r
    }
  }
  return null
}

const findParent = (root, id) => {
  if (!root.children) return null
  for (const c of root.children) {
    if (c.id === id) return root
    const r = findParent(c, id)
    if (r) return r
  }
  return null
}

const isAncestor = (node, id) => {
  if (!node.children) return false
  for (const c of node.children) {
    if (c.id === id) return true
    if (isAncestor(c, id)) return true
  }
  return false
}

const reindexArray = (node) => {
  if (node.type !== 'array' || !node.children) return
  node.children.forEach((c, i) => {
    c.key = String(i)
  })
}

const deepCloneNode = (node) => {
  return JSON.parse(JSON.stringify(node))
}

const regenerateIds = (node) => {
  node.id = genId()
  if (node.children) {
    node.children.forEach(regenerateIds)
  }
}

const nodeToJson = (node) => {
  return nodeToValue(node || props.root)
}

const nodeToValue = (node) => {
  if (node.type === 'object') {
    const obj = {}
    if (node.children) {
      node.children.forEach((c) => {
        obj[c.key] = nodeToValue(c)
      })
    }
    return obj
  }
  if (node.type === 'array') {
    const arr = []
    if (node.children) {
      node.children.forEach((c) => {
        arr.push(nodeToValue(c))
      })
    }
    return arr
  }
  if (node.type === 'auto') {
    return parseAutoValue(node.value)
  }
  // string
  return node.value
}

const parseAutoValue = (val) => {
  if (val === 'null') return null
  if (val === 'true') return true
  if (val === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(val)) {
    const n = Number(val)
    return Number.isFinite(n) ? n : val
  }
  return val
}

defineExpose({ nodeToJson })

</script>

<style scoped lang="scss">
.jvt-tree {
  height: 100%;
  overflow: auto;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 13px;
  line-height: 22px;
  color: #303133;
  padding: 10px;
}
</style>
