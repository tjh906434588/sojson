<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.jsonParser.title') }}</h1>
          <p class="tool-description">{{ $t('tools.jsonParser.description') }}</p>
        </div>
      </template>

      <el-input
        v-model="jsonInput"
        type="textarea"
        :rows="10"
        :placeholder="$t('tools.jsonParser.input')"
        class="textarea-input"
      />

      <div class="button-group">
        <el-button type="primary" @click="formatJson" :icon="Document">
          {{ $t('buttons.format') }}
        </el-button>
        <el-button type="success" @click="compressJson" :icon="Minus">
          {{ $t('buttons.compress') }}
        </el-button>
        <el-button type="warning" @click="validateJson" :icon="CircleCheck">
          {{ $t('buttons.validate') }}
        </el-button>
        <el-button @click="copyJson" :icon="CopyDocument">
          {{ $t('common.copy') }}
        </el-button>
        <el-button type="danger" @click="clearJson" :icon="Delete">
          {{ $t('common.clear') }}
        </el-button>
      </div>

      <el-input
        v-model="jsonOutput"
        type="textarea"
        :rows="10"
        readonly
        class="textarea-output"
      />

      <el-alert
        v-if="message"
        :title="message"
        :type="messageType"
        :closable="false"
        style="margin-top: 20px"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Document, Minus, CircleCheck, CopyDocument, Delete } from '@element-plus/icons-vue'

const { t } = useI18n()

const jsonInput = ref('')
const jsonOutput = ref('')
const message = ref('')
const messageType = ref('success')

const formatJson = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsed, null, 2)
    message.value = ''
  } catch (e) {
    message.value = t('tools.jsonParser.error')
    messageType.value = 'error'
    jsonOutput.value = ''
  }
}

const compressJson = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsed)
    message.value = ''
  } catch (e) {
    message.value = t('tools.jsonParser.error')
    messageType.value = 'error'
    jsonOutput.value = ''
  }
}

const validateJson = () => {
  try {
    JSON.parse(jsonInput.value)
    message.value = t('tools.jsonParser.success')
    messageType.value = 'success'
  } catch (e) {
    message.value = t('tools.jsonParser.error')
    messageType.value = 'error'
  }
}

const copyJson = () => {
  if (jsonOutput.value) {
    navigator.clipboard.writeText(jsonOutput.value)
    ElMessage.success(t('common.success'))
  }
}

const clearJson = () => {
  jsonInput.value = ''
  jsonOutput.value = ''
  message.value = ''
}
</script>

<style scoped lang="scss">
/* 样式已在全局样式中定义，此处不再重复 */
</style>
