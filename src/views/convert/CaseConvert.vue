<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.caseConvert.title') }}</h1>
          <p class="tool-description">{{ $t('tools.caseConvert.description') }}</p>
        </div>
      </template>
      
      <el-input
        v-model="input"
        type="textarea"
        :rows="6"
        :placeholder="$t('tools.caseConvert.input')"
        class="textarea-input"
      />
      
      <div class="button-group">
        <el-button @click="toUpperCase">{{ $t('tools.caseConvert.uppercase') }}</el-button>
        <el-button @click="toLowerCase">{{ $t('tools.caseConvert.lowercase') }}</el-button>
        <el-button @click="toCapitalize">{{ $t('tools.caseConvert.capitalize') }}</el-button>
        <el-button @click="toTitleCase">{{ $t('tools.caseConvert.titleCase') }}</el-button>
        <el-button @click="toCamelCase">{{ $t('tools.caseConvert.camelCase') }}</el-button>
        <el-button @click="toPascalCase">{{ $t('tools.caseConvert.pascalCase') }}</el-button>
        <el-button @click="toSnakeCase">{{ $t('tools.caseConvert.snakeCase') }}</el-button>
        <el-button @click="toKebabCase">{{ $t('tools.caseConvert.kebabCase') }}</el-button>
      </div>
      
      <el-input
        v-model="output"
        type="textarea"
        :rows="6"
        readonly
        class="textarea-output"
      />
      
      <div class="button-group">
        <el-button @click="copy">{{ $t('common.copy') }}</el-button>
        <el-button @click="clear">{{ $t('common.clear') }}</el-button>
      </div>
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

const toUpperCase = () => {
  output.value = input.value.toUpperCase()
}

const toLowerCase = () => {
  output.value = input.value.toLowerCase()
}

const toCapitalize = () => {
  output.value = input.value.charAt(0).toUpperCase() + input.value.slice(1).toLowerCase()
}

const toTitleCase = () => {
  output.value = input.value.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

const toCamelCase = () => {
  output.value = input.value.split(/[\s_-]+/).map((word, i) => 
    i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('')
}

const toPascalCase = () => {
  output.value = input.value.split(/[\s_-]+/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('')
}

const toSnakeCase = () => {
  output.value = input.value.split(/[\s-]+/).map(word => word.toLowerCase()).join('_')
}

const toKebabCase = () => {
  output.value = input.value.split(/[\s_]+/).map(word => word.toLowerCase()).join('-')
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
