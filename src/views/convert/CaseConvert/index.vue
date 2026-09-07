<template>
  <div class="container">
    <el-card class="tool-card">
      <!-- 输入内容 -->
      <el-input
        v-model="input"
        type="textarea"
        :placeholder="$t('tools.caseConvert.input')"
        class="textarea-input"
      />

      <!-- 选择器 + 操作按钮 -->
      <div class="controls-row">
        <div class="select-group">
          <div class="select-item">
            <span class="select-label">{{ $t('tools.caseConvert.convertType') }}</span>
            <el-select v-model="convertType" class="select-control">
              <el-option
                v-for="opt in convertTypeOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>
          <div class="select-item">
            <span class="select-label">{{ $t('tools.caseConvert.hyphenType') }}</span>
            <el-select v-model="hyphenType" class="select-control">
              <el-option
                v-for="opt in hyphenOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>

        <div class="button-group">
          <el-button type="primary" :icon="Check" @click="convert">
            {{ $t('tools.caseConvert.convert') }}
          </el-button>
          <el-button :icon="CopyDocument" @click="copy">
            {{ $t('tools.caseConvert.copyResult') }}
          </el-button>
          <el-button type="danger" :icon="Delete" @click="clear">
            {{ $t('tools.caseConvert.clearText') }}
          </el-button>
          <el-button type="info" :icon="Download" @click="exportText">
            {{ $t('tools.caseConvert.exportText') }}
          </el-button>
        </div>
      </div>

      <!-- 转换结果（只读展示） -->
      <el-input
        v-model="output"
        type="textarea"
        readonly
        :placeholder="$t('tools.caseConvert.output')"
        class="textarea-output"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Check, CopyDocument, Delete, Download } from '@element-plus/icons-vue'

const { t } = useI18n()

const input = ref('')
const output = ref('')
// 默认选中第一个选项
const convertType = ref('uppercase')
const hyphenType = ref('keep')

const convertTypeOptions = computed(() => [
  { value: 'uppercase', label: t('tools.caseConvert.typeUppercase') },
  { value: 'lowercase', label: t('tools.caseConvert.typeLowercase') },
  { value: 'capitalize', label: t('tools.caseConvert.typeCapitalize') },
  { value: 'lowerFirst', label: t('tools.caseConvert.typeLowerFirst') },
  { value: 'sentence', label: t('tools.caseConvert.typeSentence') },
  { value: 'title', label: t('tools.caseConvert.typeTitle') },
  { value: 'toggle', label: t('tools.caseConvert.typeToggle') },
  { value: 'camel', label: t('tools.caseConvert.typeCamel') },
  { value: 'snake', label: t('tools.caseConvert.typeSnake') }
])

const hyphenOptions = computed(() => [
  { value: 'keep', label: t('tools.caseConvert.hyphenKeep') },
  { value: 'capitalize', label: t('tools.caseConvert.hyphenCapitalize') },
  { value: 'ignore', label: t('tools.caseConvert.hyphenIgnore') }
])

// 单词首字母大写，其余小写
const capWord = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
// 单词首字母小写，其余大写
const lowerFirstWord = (w) => w.charAt(0).toLowerCase() + w.slice(1).toUpperCase()

// 按空白分词；忽略连字符模式会先去连字符再分词
const splitWords = (text, mode) => {
  if (mode === 'ignore') {
    return text.replace(/-/g, '').split(/\s+/).filter(Boolean)
  }
  return text.split(/\s+/).filter(Boolean)
}

// 首字母大写
const toCapitalize = (text, mode) => {
  if (mode === 'capitalize') {
    // 每个连字符部分都首字母大写：well-known → Well-Known
    return text.split(/\s+/).filter(Boolean)
      .map((w) => w.split('-').map(capWord).join('-')).join(' ')
  }
  // keep：保留连字符，只处理单词首字符；ignore：去连字符后处理
  return splitWords(text, mode).map(capWord).join(' ')
}

// 首字母小写
const toLowerFirst = (text, mode) => {
  if (mode === 'capitalize') {
    // 每个连字符部分首字母小写：Hello-World → hELLO-wORLD
    return text.split(/\s+/).filter(Boolean)
      .map((w) => w.split('-').map(lowerFirstWord).join('-')).join(' ')
  }
  return splitWords(text, mode).map(lowerFirstWord).join(' ')
}

// 句子首字母大写
const toSentence = (text, mode) => {
  let s = text
  if (mode === 'ignore') s = s.replace(/-/g, '')
  const leading = (s.match(/^\s*/) || [''])[0]
  s = s.trim().toLowerCase()
  // 文本开头或句号/问号/感叹号后的字母大写
  s = s.replace(/(^|[.!?。！？]+\s*)([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase())
  if (mode === 'capitalize') {
    // 每个连字符部分首字母大写
    s = s.replace(/-([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase())
  }
  return leading + s
}

// 标题大小写（虚词小写，首尾词除外）
const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'with', 'as', 'if']

const toTitle = (text, mode) => {
  let s = text
  if (mode === 'ignore') s = s.replace(/-/g, '')
  const words = s.split(/\s+/).filter(Boolean)
  return words.map((word, i, arr) => {
    const first = i === 0
    const last = i === arr.length - 1
    if (mode === 'capitalize') {
      return word.split('-').map((part) => {
        const lower = part.toLowerCase()
        if (!first && !last && smallWords.includes(lower)) return lower
        return capWord(part)
      }).join('-')
    }
    const lower = word.toLowerCase()
    if (!first && !last && smallWords.includes(lower)) return lower
    return capWord(word)
  }).join(' ')
}

// 驼峰命名法
const toCamel = (text, mode) => {
  let s = text
  if (mode === 'ignore') s = s.replace(/-/g, '')
  // 空白与连字符均作为分词边界
  const words = s.split(/[\s-]+/).filter(Boolean)
  return words.map((w, i) => (i === 0 ? w.toLowerCase() : capWord(w))).join('')
}

// 蛇形命名法
const toSnake = (text, mode) => {
  let s = text
  if (mode === 'ignore') s = s.replace(/-/g, '')
  const words = s.split(/[\s-]+/).filter(Boolean)
  return words.map((w) => w.toLowerCase()).join('_')
}

// 大小写切换
const toToggle = (text) =>
  text.split('').map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('')

const convert = () => {
  if (!input.value || !input.value.trim()) {
    ElMessage.warning(t('tools.caseConvert.inputEmpty'))
    return
  }
  const text = input.value
  const mode = hyphenType.value
  switch (convertType.value) {
    case 'uppercase': output.value = text.toUpperCase(); break
    case 'lowercase': output.value = text.toLowerCase(); break
    case 'capitalize': output.value = toCapitalize(text, mode); break
    case 'lowerFirst': output.value = toLowerFirst(text, mode); break
    case 'sentence': output.value = toSentence(text, mode); break
    case 'title': output.value = toTitle(text, mode); break
    case 'toggle': output.value = toToggle(text); break
    case 'camel': output.value = toCamel(text, mode); break
    case 'snake': output.value = toSnake(text, mode); break
    default: output.value = text
  }
}

const copy = () => {
  if (!output.value) {
    ElMessage.warning(t('tools.caseConvert.copyEmpty'))
    return
  }
  navigator.clipboard.writeText(output.value)
  ElMessage.success(t('common.copied'))
}

const clear = () => {
  input.value = ''
  output.value = ''
}

const exportText = () => {
  if (!output.value) {
    ElMessage.warning(t('tools.caseConvert.noResult'))
    return
  }
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  // 微信内置浏览器对 a[download] + Blob 下载支持不稳定，改为新窗口打开供长按复制/保存
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    ElMessage.success(t('tools.caseConvert.exported'))
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = 'case-convert-result.txt'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('tools.caseConvert.exported'))
}
</script>

<style scoped lang="scss">
// 参考 JSON 解析页：卡片白色区域跟随内容高度（内容区 = 视口 - 菜单栏 - 底部栏 - 上下 20px）
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

// 输入/输出文本框撑满卡片剩余空间
.textarea-input,
.textarea-output {
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
  }
}

// 选择器 + 按钮区域（上下留白，避免与输入/输出文本框紧贴）
.controls-row {
  margin: 16px 0;
}

// Web：选择器与按钮放在同一排
@media (min-width: 769px) {
  .controls-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .select-group {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .select-item {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .select-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .select-control {
    flex: 1;
    width: 100%;
    min-width: 0;
  }

  .button-group {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    margin: 0;
    flex-shrink: 0;

    .el-button {
      min-width: 0;
    }
  }
}

// H5：两个选择器放在一行，按钮换行
@media (max-width: 768px) {
  .controls-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .select-group {
    display: flex;
    width: 100%;
    gap: 12px;
  }

  .select-item {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .select-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .select-control {
    flex: 1;
    width: 100%;
    min-width: 0;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    margin: 0;

    .el-button {
      flex: 1 1 calc(33.333% - 6px);
      min-width: 0;
    }
  }
}
</style>
