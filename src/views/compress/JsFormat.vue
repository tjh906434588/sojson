<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.jsFormat.title') }}</h1>
          <p class="tool-description">{{ $t('tools.jsFormat.description') }}</p>
        </div>
      </template>
      
      <el-input
        v-model="input"
        type="textarea"
        :rows="10"
        placeholder="Enter JavaScript code"
      />
      
      <div class="button-group">
        <el-button type="primary" @click="format">Format</el-button>
        <el-button type="success" @click="minify">Minify</el-button>
        <el-button @click="copy">Copy</el-button>
        <el-button @click="clear">Clear</el-button>
      </div>
      
      <el-input
        v-model="output"
        type="textarea"
        :rows="10"
        readonly
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const input = ref('')
const output = ref('')

const format = () => {
  if (!input.value) {
    ElMessage.warning('Please enter code')
    return
  }
  
  let formatted = ''
  let indent = 0
  const lines = input.value.replace(/\t/g, '  ').split('\n')
  
  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    
    if (trimmed.startsWith('}') || trimmed.startsWith(')')) {
      indent = Math.max(0, indent - 1)
    }
    
    formatted += '  '.repeat(indent) + trimmed + '\n'
    
    if (trimmed.endsWith('{') || trimmed.endsWith('(')) {
      indent++
    }
  })
  
  output.value = formatted.trim()
}

const minify = () => {
  if (!input.value) {
    ElMessage.warning('Please enter code')
    return
  }
  
  output.value = input.value
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,:])\s*/g, '$1')
    .trim()
}

const copy = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
    ElMessage.success('Copied!')
  }
}

const clear = () => {
  input.value = ''
  output.value = ''
}
</script>

<style scoped lang="scss">
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>
