<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.jsonCompress.title') }}</h1>
          <p class="tool-description">{{ $t('tools.jsonCompress.description') }}</p>
        </div>
      </template>
      
      <el-input
        v-model="input"
        type="textarea"
        :rows="8"
        :placeholder="$t('tools.jsonCompress.input')"
        class="textarea-input"
      />
      
      <div class="button-group">
        <el-button type="primary" @click="compress">{{ $t('tools.jsonCompress.compress') }}</el-button>
        <el-button type="success" @click="escape">{{ $t('tools.jsonCompress.escape') }}</el-button>
        <el-button type="warning" @click="unescape">{{ $t('tools.jsonCompress.unescape') }}</el-button>
        <el-button @click="copy">{{ $t('tools.jsonCompress.copy') }}</el-button>
        <el-button type="info" @click="clear">{{ $t('tools.jsonCompress.clear') }}</el-button>
      </div>
      
      <el-input
        v-model="output"
        type="textarea"
        :rows="8"
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

const compress = () => {
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e) {
    ElMessage.error(t('tools.jsonCompress.invalidJson'))
  }
}

const escape = () => {
  output.value = input.value.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
}

const unescape = () => {
  output.value = output.value.replace(/\\([\\"'])/g, '$1').replace(/\\0/g, '\0')
}

const copy = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
    ElMessage.success(t('tools.jsonCompress.copied'))
  }
}

const clear = () => {
  input.value = ''
  output.value = ''
}
</script>

<style scoped lang="scss">
</style>
