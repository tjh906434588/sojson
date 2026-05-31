<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.seoTool.title') }}</h1>
          <p class="tool-description">{{ $t('tools.seoTool.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('tools.seoTool.url')">
          <el-input v-model="form.url" :placeholder="$t('tools.seoTool.urlPlaceholder')" />
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="analyze">{{ $t('tools.seoTool.analyze') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <div v-if="analysis" class="analysis-results">
        <el-descriptions :column="1" border>
          <el-descriptions-item :label="$t('tools.seoTool.urlValid')">
            <el-tag :type="analysis.isValid ? 'success' : 'danger'">
              {{ analysis.isValid ? $t('tools.seoTool.yes') : $t('tools.seoTool.no') }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('tools.seoTool.hasProtocol')">
            <el-tag :type="analysis.hasProtocol ? 'success' : 'warning'">
              {{ analysis.hasProtocol ? $t('tools.seoTool.yes') : $t('tools.seoTool.no') }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('tools.seoTool.domain')">
            {{ analysis.domain || $t('tools.seoTool.notAvailable') }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('tools.seoTool.charCount')">
            {{ analysis.charCount }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  url: ''
})

const analysis = ref(null)

const analyze = () => {
  const url = form.url
  
  analysis.value = {
    isValid: /^https?:\/\/.+/.test(url),
    hasProtocol: /^https?:\/\//.test(url),
    domain: url ? new URL(url).hostname : '',
    charCount: url.length
  }
}
</script>

<style scoped lang="scss">
.analysis-results {
  margin-top: 30px;
}
</style>
