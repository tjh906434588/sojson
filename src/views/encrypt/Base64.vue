<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.base64.title') }}</h1>
          <p class="tool-description">{{ $t('tools.base64.description') }}</p>
        </div>
      </template>
      
      <el-input
        v-model="input"
        type="textarea"
        :rows="6"
        :placeholder="$t('tools.base64.input')"
        class="textarea-input"
      />
      
      <div class="button-group">
        <el-button type="primary" @click="encode">{{ $t('tools.base64.encode') }}</el-button>
        <el-button type="success" @click="decode">{{ $t('tools.base64.decode') }}</el-button>
        <el-button @click="copy">{{ $t('common.copy') }}</el-button>
        <el-button @click="clear">{{ $t('common.clear') }}</el-button>
      </div>
      
      <el-input
        v-model="output"
        type="textarea"
        :rows="6"
        readonly
        class="textarea-output"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const input = ref('')
const output = ref('')

const encode = () => {
  try {
    output.value = btoa(unescape(encodeURIComponent(input.value)))
  } catch (e) {
    ElMessage.error(t('tools.base64.encodingFailed'))
  }
}

const decode = () => {
  try {
    output.value = decodeURIComponent(escape(atob(input.value)))
  } catch (e) {
    ElMessage.error(t('tools.base64.decodingFailed'))
  }
}

const copy = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
    ElMessage.success(t('common.copied'))
  }
}

const clear = () => {
  input.value = ''
  output.value = ''
}
</script>
