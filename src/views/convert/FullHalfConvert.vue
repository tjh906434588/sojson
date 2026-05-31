<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.fullHalfConvert.title') }}</h1>
          <p class="tool-description">{{ $t('tools.fullHalfConvert.description') }}</p>
        </div>
      </template>
      
      <el-input
        v-model="input"
        type="textarea"
        :rows="6"
        :placeholder="$t('tools.fullHalfConvert.input')"
        class="textarea-input"
      />
      
      <div class="button-group">
        <el-button type="primary" @click="toFullWidth">{{ $t('tools.fullHalfConvert.toFullWidth') }}</el-button>
        <el-button type="success" @click="toHalfWidth">{{ $t('tools.fullHalfConvert.toHalfWidth') }}</el-button>
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

const toFullWidth = () => {
  let result = ''
  for (let i = 0; i < input.value.length; i++) {
    const char = input.value[i]
    if (char >= '!' && char <= '~') {
      result += String.fromCharCode(char.charCodeAt(0) + 0xFEE0)
    } else if (char === ' ') {
      result += '\u3000'
    } else {
      result += char
    }
  }
  output.value = result
}

const toHalfWidth = () => {
  let result = ''
  for (let i = 0; i < input.value.length; i++) {
    const char = input.value[i]
    if (char >= '\uFF01' && char <= '\uFF5E') {
      result += String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
    } else if (char === '\u3000') {
      result += ' '
    } else {
      result += char
    }
  }
  output.value = result
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
