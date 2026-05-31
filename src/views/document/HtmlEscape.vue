<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.htmlEscape.title') }}</h1>
          <p class="tool-description">{{ $t('tools.htmlEscape.description') }}</p>
        </div>
      </template>
      
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        :placeholder="$t('tools.htmlEscape.inputPlaceholder')"
      />
      
      <div class="button-group">
        <el-button type="primary" @click="escape">{{ $t('tools.htmlEscape.escape') }}</el-button>
        <el-button type="success" @click="unescape">{{ $t('tools.htmlEscape.unescape') }}</el-button>
        <el-button @click="copy">{{ $t('common.copy') }}</el-button>
        <el-button @click="clear">{{ $t('common.clear') }}</el-button>
      </div>
      
      <el-input
        v-model="output"
        type="textarea"
        :rows="4"
        readonly
      />
      
      <el-divider />
      
      <h3>{{ $t('tools.htmlEscape.commonEntities') }}</h3>
      <el-table :data="entities" stripe style="width: 100%">
        <el-table-column prop="character" :label="$t('tools.htmlEscape.character')" width="120" />
        <el-table-column prop="entity" :label="$t('tools.htmlEscape.entity')" width="150" />
        <el-table-column prop="code" :label="$t('tools.htmlEscape.code')" />
      </el-table>
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

const entities = ref([
  { character: '<', entity: '&lt;', code: '&#60;' },
  { character: '>', entity: '&gt;', code: '&#62;' },
  { character: '&', entity: '&amp;', code: '&#38;' },
  { character: '"', entity: '&quot;', code: '&#34;' },
  { character: "'", entity: '&apos;', code: '&#39;' },
  { character: ' ', entity: '&nbsp;', code: '&#160;' },
  { character: '©', entity: '&copy;', code: '&#169;' },
  { character: '®', entity: '&reg;', code: '&#174;' },
  { character: '™', entity: '&trade;', code: '&#8482;' }
])

const escape = () => {
  const div = document.createElement('div')
  div.textContent = input.value
  output.value = div.innerHTML
}

const unescape = () => {
  const div = document.createElement('div')
  div.innerHTML = input.value
  output.value = div.textContent
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

<style scoped lang="scss">
</style>
