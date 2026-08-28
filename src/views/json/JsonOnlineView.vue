<template>
  <div class="container">
    <el-card class="tool-card">
      <div class="split-panel">
        <!-- 左侧：输入区 -->
        <div class="left-panel">
          <div class="panel-buttons">
            <el-button type="primary" :icon="Document" @click="formatLeft">
              {{ $t('tools.jsonOnlineView.formatJson') }}
            </el-button>
            <el-button type="success" :icon="Minus" @click="compressLeft">
              {{ $t('tools.jsonOnlineView.compressJson') }}
            </el-button>
            <el-button type="warning" :icon="CaretRight" @click="parseToRight">
              {{ $t('tools.jsonOnlineView.parseJson') }}
            </el-button>
          </div>
          <el-input
            v-model="leftInput"
            type="textarea"
            :placeholder="$t('tools.jsonOnlineView.inputEmpty')"
            class="panel-textarea"
          />
        </div>


        <!-- 右侧：可视化编辑区 -->
        <div class="right-panel">
          <div class="panel-buttons panel-buttons-right">
            <div class="panel-buttons-left">
              <el-button :icon="allExpanded ? ArrowUp : ArrowDown" @click="toggleExpandAll">
                {{ allExpanded ? $t('tools.jsonOnlineView.collapse') : $t('tools.jsonOnlineView.expand') }}
              </el-button>
              <el-button type="primary" :icon="EditPen" @click="syncToLeft">
                {{ $t('tools.jsonOnlineView.modify') }}
              </el-button>
              <el-button :icon="RefreshLeft" :disabled="!canUndo" @click="undo">
                {{ $t('tools.jsonOnlineView.undo') }}
              </el-button>
              <el-button :icon="RefreshRight" :disabled="!canRedo" @click="redo">
                {{ $t('tools.jsonOnlineView.redo') }}
              </el-button>
            </div>
            <div class="panel-search">
              <el-input
                v-model="searchText"
                :placeholder="$t('tools.jsonOnlineView.search')"
                class="search-input"
                clearable
                @input="onSearch"
                @clear="onSearch"
              >
                <template #suffix>
                  <span v-if="searchText.trim()" class="search-count">
                    {{ $t('tools.jsonOnlineView.found', { count: matchCount }) }}
                  </span>
                  <span
                    class="search-nav"
                    :class="{ 'is-disabled': matchCount === 0 }"
                    :title="$t('tools.jsonOnlineView.prevMatch')"
                    @click="goPrev"
                  >
                    <el-icon><ArrowUp /></el-icon>
                  </span>
                  <span
                    class="search-nav"
                    :class="{ 'is-disabled': matchCount === 0 }"
                    :title="$t('tools.jsonOnlineView.nextMatch')"
                    @click="goNext"
                  >
                    <el-icon><ArrowDown /></el-icon>
                  </span>
                </template>
              </el-input>
            </div>
          </div>
          <div class="tree-wrap">
            <div v-if="!treeRoot" class="tree-empty" @click="createEmptyRoot">
              <el-icon class="tree-empty-icon"><Plus /></el-icon>
              <span>{{ $t('tools.jsonOnlineView.clickToAdd') }}</span>
            </div>
            <JsonViewTree
              v-else
              ref="treeRef"
              :root="treeRoot"
              :active-match="activeMatch"
              @update="onTreeUpdate"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  Document, Minus, CaretRight, ArrowDown, ArrowUp,
  EditPen, RefreshLeft, RefreshRight, Plus
} from '@element-plus/icons-vue'
import JsonViewTree from './JsonViewTree.vue'

const { t } = useI18n()

const leftInput = ref('')
const treeRef = ref(null)
const searchText = ref('')

// 初始示例树
const treeRoot = ref(null)

// 撤销重做历史
const history = ref([])
const historyIndex = ref(-1)

const canUndo = computed(() => historyIndex.value > 0)

function createEmptyRoot() {
  treeRoot.value = reactive(createRoot())
  history.value = [deepClone(treeRoot.value)]
  historyIndex.value = 0
  onSearch()
}
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

function pushHistory() {
  const snap = deepClone(treeRoot.value)
  // 如果当前不在末尾，截断后续
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push(snap)
  historyIndex.value++
}

function undo() {
  if (!canUndo.value) return
  historyIndex.value--
  treeRoot.value = reactive(deepClone(history.value[historyIndex.value]))
  onSearch()
}

function redo() {
  if (!canRedo.value) return
  historyIndex.value++
  treeRoot.value = reactive(deepClone(history.value[historyIndex.value]))
  onSearch()
}

function onTreeUpdate() {
  pushHistory()
  onSearch()
}

// 左侧按钮
function formatLeft() {
  if (!leftInput.value.trim()) {
    ElMessage.warning(t('tools.jsonOnlineView.inputEmpty'))
    return
  }
  try {
    leftInput.value = JSON.stringify(JSON.parse(leftInput.value), null, 2)
  } catch (e) {
    ElMessage.error(t('tools.jsonOnlineView.parseError'))
  }
}

function compressLeft() {
  if (!leftInput.value.trim()) {
    ElMessage.warning(t('tools.jsonOnlineView.inputEmpty'))
    return
  }
  try {
    leftInput.value = JSON.stringify(JSON.parse(leftInput.value))
  } catch (e) {
    ElMessage.error(t('tools.jsonOnlineView.parseError'))
  }
}

function parseToRight() {
  if (!leftInput.value.trim()) {
    ElMessage.warning(t('tools.jsonOnlineView.inputEmpty'))
    return
  }
  try {
    const data = JSON.parse(leftInput.value)
    treeRoot.value = reactive(valueToNode(data, 'root'))
    history.value = [deepClone(treeRoot.value)]
    historyIndex.value = 0
    onSearch()
  } catch (e) {
    ElMessage.error(t('tools.jsonOnlineView.parseError'))
  }
}

function syncToLeft() {
  if (!treeRef.value) return
  const data = treeRef.value.nodeToJson()
  if (data === undefined) return
  leftInput.value = JSON.stringify(data, null, 2)
  ElMessage.success(t('tools.jsonOnlineView.copied'))
}

function toggleExpandAll() {
  if (!treeRoot.value) return
  setExpanded(treeRoot.value, !allExpanded.value)
}

const allExpanded = computed(() => {
  return treeRoot.value ? checkAllExpanded(treeRoot.value) : false
})

function checkAllExpanded(node) {
  if ((node.type === 'object' || node.type === 'array') && !node.expanded) return false
  if (node.children) {
    for (const c of node.children) {
      if (!checkAllExpanded(c)) return false
    }
  }
  return true
}

function setExpanded(node, val) {
  if (node.type === 'object' || node.type === 'array') {
    node.expanded = val
  }
  if (node.children) {
    node.children.forEach((c) => setExpanded(c, val))
  }
}

// 搜索高亮 + 自动展开
const matchList = ref([])          // 有序匹配项：[{ id, field: 'key' | 'value' }]
const matchIndex = ref(0)          // 当前选中项下标
const matchCount = computed(() => matchList.value.length)
const activeMatch = computed(() => matchList.value[matchIndex.value] || null)

function onSearch() {
  if (!treeRoot.value) return
  const kw = searchText.value.trim().toLowerCase()
  clearMatch(treeRoot.value)
  matchList.value = []
  matchIndex.value = 0
  if (!kw) return
  markMatch(treeRoot.value, kw)
  if (matchList.value.length) {
    // 展开所有包含匹配的祖先路径
    expandParents(treeRoot.value, kw)
    scrollToActive()
  }
}

function clearMatch(node) {
  node._keyMatch = false
  node._valueMatch = false
  if (node.children) node.children.forEach(clearMatch)
}

function markMatch(node, kw) {
  // 根节点的 key 不参与匹配（界面上不显示根 key）
  const isRootNode = node === treeRoot.value
  const k = isRootNode ? '' : String(node.key).toLowerCase()
  const v = node.value !== undefined ? String(node.value).toLowerCase() : ''
  node._keyMatch = k.includes(kw)
  node._valueMatch = v !== '' && v.includes(kw)
  if (node._keyMatch) matchList.value.push({ id: node.id, field: 'key' })
  if (node._valueMatch) matchList.value.push({ id: node.id, field: 'value' })
  if (node.children) node.children.forEach((c) => markMatch(c, kw))
}

function expandParents(node, kw) {
  if (!node.children) return false
  let childMatched = false
  node.children.forEach((c) => {
    const cm = c._keyMatch || c._valueMatch
    // 始终递归子节点，避免匹配的容器自身短路导致更深层匹配无法展开
    const subMatched = expandParents(c, kw)
    if (cm || subMatched) {
      childMatched = true
      // 子节点内有更深层匹配时，展开该子节点
      if (subMatched) {
        c.expanded = true
      }
    }
  })
  if (childMatched) {
    node.expanded = true
  }
  return childMatched
}

// 上一个 / 下一个匹配项
function goNext() {
  if (!matchList.value.length) return
  matchIndex.value = (matchIndex.value + 1) % matchList.value.length
  revealActive()
}

function goPrev() {
  if (!matchList.value.length) return
  matchIndex.value = (matchIndex.value - 1 + matchList.value.length) % matchList.value.length
  revealActive()
}

function revealActive() {
  const m = activeMatch.value
  if (!m) return
  // 展开选中项所在的所有祖先，并滚动到可视区
  if (treeRoot.value) expandAncestors(treeRoot.value, m.id)
  scrollToActive()
}

function expandAncestors(node, id) {
  if (!node.children) return false
  let found = false
  node.children.forEach((c) => {
    if (c.id === id || expandAncestors(c, id)) {
      node.expanded = true
      found = true
    }
  })
  return found
}

function scrollToActive() {
  nextTick(() => {
    const el = document.querySelector('[data-active-match]')
    if (el) el.scrollIntoView({ block: 'nearest' })
  })
}

// 工具函数
function createRoot() {
  return {
    id: 'root',
    key: 'root',
    type: 'object',
    expanded: true,
    children: []
  }
}

function valueToNode(value, key) {
  const node = {
    id: genId(),
    key: String(key),
    type: inferType(value),
    expanded: true,
    value: undefined,
    children: undefined
  }
  if (node.type === 'object') {
    node.children = Object.entries(value).map(([k, v]) => valueToNode(v, k))
  } else if (node.type === 'array') {
    node.children = value.map((v, i) => valueToNode(v, i))
  } else {
    node.value = String(value)
  }
  return node
}

function inferType(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return 'auto'
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return 'auto'
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

const genId = (() => {
  let n = 0
  return () => `n-${Date.now()}-${++n}`
})()

</script>

<style scoped lang="scss">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.tool-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0;
  margin-bottom: 0;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px;
  }
}

.split-panel {
  flex: 1;
  display: flex;
  min-height: 0;
  gap: 20px;
}

.left-panel,
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}


.panel-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.panel-buttons-right {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-buttons-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;

  .el-button {
    padding: 8px 12px;
  }
}

.panel-search {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.panel-textarea,
.tree-wrap {
  flex: 1;
  min-height: 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.tree-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #909399;
  cursor: pointer;
  user-select: none;
  transition: color 0.15s;

  &:hover {
    color: #409eff;
  }
}

.tree-empty-icon {
  font-size: 30px;
}

.panel-textarea {
  :deep(.el-textarea) {
    height: 100%;
  }

  :deep(.el-textarea__inner) {
    height: 100%;
    resize: none;
  }
}

.search-input {
  width: 200px;
}

.search-count {
  font-size: 12px;
  color: #909399;
  margin-right: 4px;
  white-space: nowrap;
}

.search-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 2px;
  cursor: pointer;
  color: #606266;
  border-radius: 3px;

  &:hover {
    background: #e4e7ed;
    color: #409eff;
  }

  &.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      color: #c0c4cc;
    }
  }
}

@media (max-width: 768px) {
  .split-panel {
    flex-direction: column;
    gap: 16px;
  }


  .search-input {
    width: 140px;
  }

  // H5 下不显示“找到 N 个结果”文案
  .search-count {
    display: none;
  }
}
</style>
