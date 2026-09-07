<template>
  <div class="container">
    <el-card class="tool-card">
      <!-- 上：输入区 -->
      <div class="area input-area">
        <el-input
          v-model="input"
          type="textarea"
          class="textarea-input"
          :placeholder="$t('tools.jsEncryptDecrypt.input')"
        />
        <input ref="fileInput" type="file" accept=".js,.mjs,.txt" class="hidden-file" @change="handleFile" />
      </div>

      <!-- 中：选项 + 操作 -->
      <div class="control-area">
        <div class="options-row">
          <el-checkbox v-model="useEval">{{ $t('tools.jsEncryptDecrypt.useEval') }}</el-checkbox>
          <el-checkbox v-model="useShortNames">{{ $t('tools.jsEncryptDecrypt.useShortNames') }}</el-checkbox>
        </div>
        <div class="button-group">
          <el-button class="upload-btn" :icon="Upload" @click="triggerUpload">
            {{ $t('tools.jsEncryptDecrypt.upload') }}
          </el-button>
          <el-button @click="stripComments">{{ $t('tools.jsEncryptDecrypt.stripComments') }}</el-button>
          <el-button type="primary" @click="beautify">{{ $t('tools.jsEncryptDecrypt.beautify') }}</el-button>
          <el-button type="warning" @click="compress">{{ $t('tools.jsEncryptDecrypt.compress') }}</el-button>
          <el-button type="danger" @click="obfuscate">{{ $t('tools.jsEncryptDecrypt.obfuscate') }}</el-button>
          <el-button type="success" @click="decrypt">{{ $t('tools.jsEncryptDecrypt.decrypt') }}</el-button>
          <el-button type="info" @click="clear">{{ $t('tools.jsEncryptDecrypt.clear') }}</el-button>
        </div>
      </div>

      <!-- 下：输出区（只读） -->
      <div class="area output-area">
        <el-input
          v-model="output"
          type="textarea"
          readonly
          class="textarea-input output-textarea"
          :placeholder="$t('tools.jsEncryptDecrypt.output')"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { minify } from 'terser'
import JavaScriptObfuscator from 'javascript-obfuscator'

const { t } = useI18n()

const input = ref('')
const output = ref('')
const useEval = ref(false)
const useShortNames = ref(false)
const fileInput = ref(null)

const b64Encode = (str) => btoa(unescape(encodeURIComponent(str)))
const b64Decode = (str) => decodeURIComponent(escape(atob(str)))

const requireInput = () => {
  if (!input.value || !input.value.trim()) {
    ElMessage.warning(t('tools.jsEncryptDecrypt.inputEmpty'))
    return false
  }
  return true
}

const handleError = () => {
  ElMessage.error(t('tools.jsEncryptDecrypt.processFailed'))
}

// 勾选 eval 加密时，将结果用 eval + base64 包裹为可运行代码
const wrapEval = (code) => `eval(decodeURIComponent(escape(atob("${b64Encode(code)}"))))`

// terser 压缩/美化；mangle（变量缩短 a/b/c）由「缩短变量名」控制
const runTerser = async (code, { beautify = false } = {}) => {
  const result = await minify(code, {
    compress: beautify ? false : true,
    // 勾选「缩短变量名」时顶层与局部变量都缩短为 a/b/c 等简短名
    mangle: beautify ? false : (useShortNames.value ? { toplevel: true } : false),
    format: beautify ? { beautify: true } : undefined
  })
  const minifyResult = result as { code?: string; error?: unknown }
  if (minifyResult.error) throw minifyResult.error
  return minifyResult.code
}

// 去注释（正则方案，保留字符串与换行）
const stripComments = () => {
  if (!requireInput()) return
  output.value = input.value
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/\n{3,}/g, '\n\n')
}

// JS 美化
const beautify = async () => {
  if (!requireInput()) return
  try {
    output.value = await runTerser(input.value, { beautify: true })
  } catch (e) {
    handleError()
  }
}

// JS 压缩
const compress = async () => {
  if (!requireInput()) return
  try {
    const code = await runTerser(input.value)
    output.value = useEval.value ? wrapEval(code) : code
  } catch (e) {
    handleError()
  }
}

// JS 混淆加密
const obfuscate = () => {
  if (!requireInput()) return
  try {
    const result = JavaScriptObfuscator.obfuscate(input.value, {
      compact: true,
      // 勾选「缩短变量名」时生成 a/b/c 简短变量，否则生成 _0x 十六进制名
      identifierNamesGenerator: useShortNames.value ? 'mangled' : 'hexadecimal',
      renameGlobals: false
    })
    const code = result.getObfuscatedCode()
    output.value = useEval.value ? wrapEval(code) : code
  } catch (e) {
    handleError()
  }
}

// JS 解密：递归解码 eval(hex) / eval(base64) / 纯 base64
const decrypt = () => {
  if (!requireInput()) return
  let result = input.value.trim()
  let changed = true
  let guard = 0

  while (changed && guard < 50) {
    changed = false
    guard++

    // eval("\x68\x65...") / eval("\uXXXX...") 十六进制转义
    const hexMatch = result.match(/^eval\("((?:\\[xu][0-9a-fA-F]{2,4})*)"\)$/)
    if (hexMatch) {
      result = hexMatch[1]
        .replace(/\\x([0-9a-fA-F]{2})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
        .replace(/\\u([0-9a-fA-F]{4})/g, (m, u) => String.fromCharCode(parseInt(u, 16)))
      changed = true
      continue
    }

    // eval(decodeURIComponent(escape(atob("..."))) / eval(atob("...")) 包装
    const b64Match = result.match(/atob\("([A-Za-z0-9+/=]+)"\)/)
    if (b64Match) {
      try {
        result = b64Decode(b64Match[1])
        changed = true
        continue
      } catch (e) {
        /* 非合法 base64，继续 */
      }
    }

    // 纯 base64 字符串
    if (/^[A-Za-z0-9+/=]+$/.test(result) && result.length % 4 === 0 && result.length > 8) {
      try {
        const decoded = b64Decode(result)
        if (/[\u0020-\uFFFF]/.test(decoded)) {
          result = decoded
          changed = true
          continue
        }
      } catch (e) {
        /* 非合法 base64 */
      }
    }
  }

  output.value = result
}

// 上传 JS 文件解析到输入框
const triggerUpload = () => {
  if (fileInput.value) fileInput.value.click()
}

const handleFile = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    input.value = String(reader.result || '')
    ElMessage.success(t('tools.jsEncryptDecrypt.uploaded'))
  }
  reader.onerror = () => handleError()
  reader.readAsText(file)
  e.target.value = ''
}

const clear = () => {
  input.value = ''
  output.value = ''
}
</script>

<style scoped lang="scss">
// 卡片跟随内容区高度，上中下三段布局
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
    padding: 20px;
    gap: 16px;
  }
}

// 输入/输出区域
.area {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.input-area,
.output-area {
  flex: 1;
}

// 代码文本域撑满区域高度
.textarea-input {
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
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
  }
}

.hidden-file {
  display: none;
}

// 中间控制区
.control-area {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.options-row {
  display: flex;
  gap: 24px;
}

// 间距由 .control-area 的 gap 控制
.button-group {
  margin: 0;
}
</style>
