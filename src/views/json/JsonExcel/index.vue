<template>
  <div class="container">
    <el-card class="tool-card">
      <el-input
        v-model="jsonInput"
        type="textarea"
        :rows="12"
        :placeholder="$t('tools.jsonExcel.inputPlaceholder')"
        class="textarea-input"
      />

      <div v-if="statusText" class="status-line" :class="statusClass">
        {{ statusText }}
      </div>

      <div class="button-group">
        <el-button :icon="Upload" @click="triggerUpload">
          {{ $t('tools.jsonExcel.uploadJson') }}
        </el-button>
        <el-button type="primary" :icon="Download" @click="convertDownload">
          {{ $t('tools.jsonExcel.convertDownload') }}
        </el-button>
        <el-button type="danger" :icon="Delete" @click="clearAll">
          {{ $t('tools.jsonExcel.clear') }}
        </el-button>
        <!-- 隐藏文件输入：由上传按钮触发 click，兼容手机浏览器与微信内置浏览器 -->
        <input
          ref="fileInput"
          type="file"
          accept=".json,application/json,text/plain"
          class="hidden-file"
          @change="onFileChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Upload, Download, Delete } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

const { t } = useI18n()

const jsonInput = ref('')
const fileInput = ref(null)
const inputState = ref(null) // null | valid | invalid

const statusClass = computed(() => (inputState.value ? 'status-' + inputState.value : ''))
const statusText = computed(() => {
  if (inputState.value === 'valid') return t('tools.jsonExcel.jsonValid')
  if (inputState.value === 'invalid') return t('tools.jsonExcel.jsonInvalid')
  return ''
})

const validateJson = (text) => {
  try {
    JSON.parse(text)
    return 'valid'
  } catch (e) {
    return 'invalid'
  }
}

watch(jsonInput, (val) => {
  if (!val || !val.trim()) {
    inputState.value = null
    return
  }
  inputState.value = validateJson(val)
})

// 上传 JSON 文件：读取内容并回填到输入框
const triggerUpload = () => {
  if (fileInput.value) fileInput.value.click()
}

const onFileChange = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const text = String(reader.result || '')
    jsonInput.value = text.trim()
    if (jsonInput.value) inputState.value = validateJson(jsonInput.value)
    if (inputState.value === 'valid') {
      ElMessage.success(t('tools.jsonExcel.fileLoaded'))
    } else {
      ElMessage.error(t('tools.jsonExcel.invalidJson'))
    }
    // 清空 input 值，允许用户重复选择同一个文件
    if (fileInput.value) fileInput.value.value = ''
  }
  reader.onerror = () => {
    ElMessage.error(t('tools.jsonExcel.fileReadError'))
  }
  reader.readAsText(file)
}

// 将任意 JSON 值拍平为一行（嵌套对象用 . 展开，对象数组用 [i] 展开，基本类型数组合并）
const flatten = (val, prefix = '', out = {}) => {
  if (val === null) {
    out[prefix || 'value'] = ''
    return out
  }
  if (Array.isArray(val)) {
    if (val.length === 0) {
      out[prefix || 'value'] = ''
      return out
    }
    if (val.every((x) => x && typeof x === 'object')) {
      val.forEach((item, i) => flatten(item, prefix + '[' + i + ']', out))
    } else {
      out[prefix || 'value'] = val.join(', ')
    }
    return out
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val)
    if (keys.length === 0) {
      out[prefix || 'value'] = ''
      return out
    }
    keys.forEach((k) => {
      const child = val[k]
      const p = prefix ? prefix + '.' + k : k
      if (child && typeof child === 'object') {
        flatten(child, p, out)
      } else {
        out[p] = child === null ? '' : child
      }
    })
    return out
  }
  out[prefix || 'value'] = val
  return out
}

const convertDownload = () => {
  if (!jsonInput.value || !jsonInput.value.trim()) {
    ElMessage.warning(t('tools.jsonExcel.inputEmpty'))
    return
  }
  let parsed
  try {
    parsed = JSON.parse(jsonInput.value)
  } catch (e) {
    inputState.value = 'invalid'
    ElMessage.error(t('tools.jsonExcel.invalidJson'))
    return
  }
  if (parsed === null || typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean') {
    ElMessage.warning(t('tools.jsonExcel.typeUnsupported'))
    return
  }
  const rows = Array.isArray(parsed) ? parsed : [parsed]
  if (rows.length === 0) {
    ElMessage.warning(t('tools.jsonExcel.emptyData'))
    return
  }

  const flatRows = rows.map((r) => flatten(r))
  const headers = []
  const seen = new Set()
  flatRows.forEach((fr) => {
    Object.keys(fr).forEach((k) => {
      if (!seen.has(k)) {
        seen.add(k)
        headers.push(k)
      }
    })
  })
  const aoa = [headers]
  flatRows.forEach((fr) => aoa.push(headers.map((h) => (fr[h] === undefined ? '' : fr[h]))))

  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  try {
    // SheetJS writeFile 内部自带跨浏览器兜底：Blob + a[download]，
    // 对不支持 download 的环境（部分手机/微信内置浏览器）会自动改用新窗口打开文件
    XLSX.writeFile(wb, 'json-data.xlsx')
    ElMessage.success(t('tools.jsonExcel.downloadStart'))
  } catch (err) {
    ElMessage.error(t('tools.jsonExcel.downloadFailed'))
  }
}

const clearAll = () => {
  jsonInput.value = ''
  inputState.value = null
}
</script>

<style scoped lang="scss">
.status-line {
  margin-top: 12px;
  font-size: var(--font-size-sm);

  &.status-valid {
    color: var(--color-success);
  }

  &.status-invalid {
    color: var(--color-danger);
  }
}
</style>
