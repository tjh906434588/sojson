<template>
  <div class="container entity-container">
    <el-card class="tool-card entity-card">
      <div class="content-area">
        <!-- 左/上：JSON 代码输入 -->
        <div class="pane pane-input">
          <el-input
            v-model="jsonInput"
            type="textarea"
            :rows="12"
            :placeholder="$t('tools.jsonEntity.inputPlaceholder')"
            class="textarea-input entity-textarea"
            :class="inputClass"
          />
          <div class="pane-status" :class="inputStatusClass">{{ inputStatusText }}</div>
        </div>

        <!-- 中/下：按钮组 -->
        <div class="controls-area">
          <el-select v-model="lang" class="lang-select">
            <el-option :label="$t('tools.jsonEntity.csharp')" value="csharp" />
            <el-option :label="$t('tools.jsonEntity.java')" value="java" />
            <el-option :label="$t('tools.jsonEntity.go')" value="go" />
          </el-select>

          <!-- JAVA 专属：fill 勾选 + package 输入，放在选择框右边 -->
          <template v-if="lang === 'java'">
            <el-checkbox v-model="useFill" class="fill-checkbox">
              {{ $t('tools.jsonEntity.fillMethod') }}
            </el-checkbox>
            <el-input
              v-model="packageName"
              :placeholder="$t('tools.jsonEntity.packagePlaceholder')"
              class="package-input"
              clearable
            />
          </template>

          <el-button type="primary" @click="generate" :icon="MagicStick">
            {{ $t('tools.jsonEntity.generate') }}
          </el-button>
          <el-button @click="copyResult" :icon="CopyDocument">
            {{ $t('tools.jsonEntity.copyResult') }}
          </el-button>
          <el-button type="danger" @click="clearAll" :icon="Delete">
            {{ $t('common.clear') }}
          </el-button>
        </div>

        <!-- 右/下：生成的实体类展示 -->
        <div class="pane pane-output">
          <el-input
            v-model="output"
            type="textarea"
            :rows="12"
            readonly
            :placeholder="$t('tools.jsonEntity.outputPlaceholder')"
            class="textarea-input entity-textarea output-textarea"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils'
import { MagicStick, CopyDocument, Delete } from '@element-plus/icons-vue'

const { t } = useI18n()

const jsonInput = ref('')
const output = ref('')
const lang = ref('csharp') // csharp | java | go
const useFill = ref(false) // JAVA fill 方法
const packageName = ref('') // JAVA package 路径
const inputState = ref(null) // null | valid | invalid

// 输入框格式校验（防抖）
let timer = null
watch(jsonInput, () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (!jsonInput.value || !jsonInput.value.trim()) {
      inputState.value = null
      return
    }
    try {
      JSON.parse(jsonInput.value)
      inputState.value = 'valid'
    } catch (e) {
      inputState.value = 'invalid'
    }
  }, 400)
})

const inputClass = computed(() => (inputState.value ? 'state-' + inputState.value : ''))
const inputStatusClass = computed(() => (inputState.value ? 'status-' + inputState.value : ''))
const inputStatusText = computed(() => {
  if (inputState.value === 'valid') return t('tools.jsonEntity.jsonValid')
  if (inputState.value === 'invalid') return t('tools.jsonEntity.jsonInvalid')
  return ''
})

// 本次生成过程中收集的类集合
const schema = { classes: [], used: {} }

const toPascal = (s) => {
  const clean = String(s)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
  return clean || 'Root'
}

const toCamel = (s) => {
  const p = toPascal(s)
  return p.charAt(0).toLowerCase() + p.slice(1)
}

const primitiveKind = (v) => {
  if (v === null || v === undefined) return { kind: 'null' }
  if (typeof v === 'string') return { kind: 'string' }
  if (typeof v === 'boolean') return { kind: 'bool' }
  if (typeof v === 'number') return { kind: Number.isInteger(v) ? 'int' : 'float' }
  return { kind: 'null' }
}

// 注册一个类；同名类已生成过则直接复用（避免递归/重复）
const addClass = (name, obj) => {
  if (schema.used[name]) return name
  schema.used[name] = true
  const fields = Object.keys(obj).map((k) => ({
    name: k,
    typeRef: typeRefOf(k, obj[k])
  }))
  schema.classes.push({ name, fields })
  return name
}

// 推断字段类型：对象/数组会递归注册子类
const typeRefOf = (key, value) => {
  if (Array.isArray(value)) {
    const first = value.length ? value[0] : null
    if (first !== null && typeof first === 'object') {
      const className = addClass(toPascal(key), first)
      return { kind: 'array', elem: { kind: 'object', ref: className } }
    }
    if (first !== null && Array.isArray(first)) {
      return { kind: 'array', elem: typeRefOf(key, first) }
    }
    return { kind: 'array', elem: primitiveKind(first) }
  }
  if (value !== null && typeof value === 'object') {
    const className = addClass(toPascal(key), value)
    return { kind: 'object', ref: className }
  }
  return primitiveKind(value)
}

const hasArray = (tr) => {
  if (tr.kind === 'array') return true
  if (tr.elem && typeof tr.elem === 'object') return hasArray(tr.elem)
  return false
}

// ---------- 语言类型映射 ----------
const csharpType = (tr) => {
  switch (tr.kind) {
    case 'string': return 'string'
    case 'int': return 'int'
    case 'float': return 'double'
    case 'bool': return 'bool'
    case 'null': return 'string'
    case 'object': return tr.ref
    case 'array': return `List<${csharpType(tr.elem)}>`
    default: return 'string'
  }
}

const javaType = (tr) => {
  switch (tr.kind) {
    case 'string': return 'String'
    case 'int': return 'Integer'
    case 'float': return 'Double'
    case 'bool': return 'Boolean'
    case 'null': return 'Object'
    case 'object': return tr.ref
    case 'array': return `List<${javaType(tr.elem)}>`
    default: return 'String'
  }
}

const goType = (tr) => {
  switch (tr.kind) {
    case 'string': return 'string'
    case 'int': return 'int'
    case 'float': return 'float64'
    case 'bool': return 'bool'
    case 'null': return 'interface{}'
    case 'object': return `*${tr.ref}`
    case 'array': return `[]${goType(tr.elem)}`
    default: return 'string'
  }
}

// ---------- 各语言渲染 ----------
const renderCSharp = () => {
  const usesList = schema.classes.some((cls) => cls.fields.some((f) => hasArray(f.typeRef)))
  const head = usesList ? 'using System.Collections.Generic;\n\n' : ''
  const body = schema.classes
    .map((cls) => {
      const fields = cls.fields
        .map((f) => `    public ${csharpType(f.typeRef)} ${toPascal(f.name)} { get; set; }`)
        .join('\n')
      return `public class ${cls.name}\n{\n${fields}\n}`
    })
    .join('\n\n')
  return head + body
}

const renderJava = (rootName, withFill) => {
  const parts = []
  if (packageName.value.trim()) {
    parts.push('package ' + packageName.value.trim() + ';')
    parts.push('')
  }
  if (withFill) {
    parts.push('import com.alibaba.fastjson.JSON;')
    parts.push('')
  }
  const body = schema.classes
    .map((cls) => {
      const fields = cls.fields
        .map((f) => `    private ${javaType(f.typeRef)} ${toCamel(f.name)};`)
        .join('\n')
      if (withFill && cls.name === rootName) {
        const fill = `    public static ${cls.name} fromJson(String json) {\n        return JSON.parseObject(json, ${cls.name}.class);\n    }`
        return `public class ${cls.name} {\n${fields}\n\n${fill}\n}`
      }
      return `public class ${cls.name} {\n${fields}\n}`
    })
    .join('\n\n')
  parts.push(body)
  return parts.filter(Boolean).join('\n')
}

const renderGo = () => {
  return schema.classes
    .map((cls) => {
      const maxName = Math.max(1, ...cls.fields.map((f) => toPascal(f.name).length))
      const maxType = Math.max(1, ...cls.fields.map((f) => goType(f.typeRef).length))
      const fields = cls.fields
        .map((f) => {
          const name = toPascal(f.name)
          const type = goType(f.typeRef)
          return `    ${name.padEnd(maxName)} ${type.padEnd(maxType)} \`json:"${f.name}"\``
        })
        .join('\n')
      return `type ${cls.name} struct {\n${fields}\n}`
    })
    .join('\n\n')
}

// ---------- 操作 ----------
const requireJson = () => {
  if (!jsonInput.value || !jsonInput.value.trim()) {
    ElMessage.warning(t('tools.jsonEntity.inputEmpty'))
    return false
  }
  return true
}

const generate = () => {
  if (!requireJson()) return
  let data
  try {
    data = JSON.parse(jsonInput.value)
  } catch (e) {
    inputState.value = 'invalid'
    ElMessage.error(t('tools.jsonEntity.invalidJson'))
    return
  }
  inputState.value = 'valid'

  schema.classes = []
  schema.used = {}

  // 推导根类名：仅当根对象只有一个对象/数组值键时以其命名，否则用默认名
  let rootClassName = 'RootEntity'
  let rootValue = data
  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data)
    if (keys.length === 1 && data[keys[0]] !== null && typeof data[keys[0]] === 'object') {
      rootClassName = toPascal(keys[0])
      rootValue = data[keys[0]]
    }
  }
  if (Array.isArray(rootValue)) rootValue = rootValue[0]
  if (rootValue === null || typeof rootValue !== 'object') rootValue = {}

  addClass(rootClassName, rootValue)

  if (lang.value === 'java') {
    output.value = renderJava(rootClassName, useFill.value)
  } else if (lang.value === 'go') {
    output.value = renderGo()
  } else {
    output.value = renderCSharp()
  }
  ElMessage.success(t('tools.jsonEntity.generated'))
}

const copyResult = () => {
  if (!output.value) {
    ElMessage.warning(t('tools.jsonEntity.copyEmpty'))
    return
  }
  copyToClipboard(output.value, t('common.success'))
}

const clearAll = () => {
  jsonInput.value = ''
  output.value = ''
  inputState.value = null
  lang.value = 'csharp'
  useFill.value = false
  packageName.value = ''
}
</script>

<style scoped lang="scss">
// web：上（左 JSON / 右实体）下（按钮组）两块布局
.content-area {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 16px;
  grid-template-areas:
    'input output'
    'controls controls';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
}

.pane {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.pane-input {
  grid-area: input;
}

.pane-output {
  grid-area: output;
}

.controls-area {
  grid-area: controls;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  .lang-select {
    width: 160px;
    flex-shrink: 0;
  }

  .fill-checkbox {
    margin-right: 0;
    white-space: nowrap;
  }

  .package-input {
    width: 220px;
    flex-shrink: 0;
  }
}

// 输入/输出框：代码字体 + 禁止拖拽缩放（撑满布局由全局 .textarea-input 提供）
.entity-textarea {
  :deep(.el-textarea__inner) {
    font-family: var(--font-code);
    resize: none;
  }
}

// JSON 输入框格式校验边框
.entity-textarea.state-valid :deep(.el-textarea__inner) {
  border-color: var(--color-success);
}

.entity-textarea.state-invalid :deep(.el-textarea__inner) {
  border-color: var(--color-danger);
}

// 输入框下方状态提示
.pane-status {
  flex-shrink: 0;
  min-height: 20px;
  margin-top: 4px;
  font-size: var(--font-size-sm);
  line-height: 20px;
  color: transparent;

  &.status-valid {
    color: var(--color-success);
  }

  &.status-invalid {
    color: var(--color-danger);
  }
}

// H5：上（JSON）/中（按钮）/下（实体）布局
@media (max-width: 768px) {
  .content-area {
    grid-template-areas:
      'input'
      'controls'
      'output';
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto 1fr;
  }

  .controls-area {
    .lang-select {
      width: 130px;
    }

    .package-input {
      flex: 1;
      min-width: 150px;
    }
  }
}
</style>
