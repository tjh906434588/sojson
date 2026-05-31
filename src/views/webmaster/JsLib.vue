<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.jsLib.title') }}</h1>
          <p class="tool-description">{{ $t('tools.jsLib.description') }}</p>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="lib in libraries" :key="lib.name">
          <el-card class="lib-card" shadow="hover">
            <h3>{{ lib.name }}</h3>
            <p>{{ lib.description }}</p>
            <el-tag size="small">{{ lib.category }}</el-tag>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const libraries = computed(() => [
  { name: 'Vue.js', description: t('tools.jsLib.vueDesc'), category: t('tools.jsLib.framework') },
  { name: 'React', description: t('tools.jsLib.reactDesc'), category: t('tools.jsLib.framework') },
  { name: 'Angular', description: t('tools.jsLib.angularDesc'), category: t('tools.jsLib.framework') },
  { name: 'Lodash', description: t('tools.jsLib.lodashDesc'), category: t('tools.jsLib.utilities') },
  { name: 'Axios', description: t('tools.jsLib.axiosDesc'), category: t('tools.jsLib.http') },
  { name: 'Day.js', description: t('tools.jsLib.dayjsDesc'), category: t('tools.jsLib.date') },
  { name: 'Moment.js', description: t('tools.jsLib.momentDesc'), category: t('tools.jsLib.date') },
  { name: 'Chart.js', description: t('tools.jsLib.chartjsDesc'), category: t('tools.jsLib.charts') },
  { name: 'ECharts', description: t('tools.jsLib.echartsDesc'), category: t('tools.jsLib.charts') },
  { name: 'D3.js', description: t('tools.jsLib.d3Desc'), category: t('tools.jsLib.visualization') },
  { name: 'Express', description: t('tools.jsLib.expressDesc'), category: t('tools.jsLib.backend') },
  { name: 'jQuery', description: t('tools.jsLib.jqueryDesc'), category: t('tools.jsLib.dom') }
])
</script>

<style scoped lang="scss">
.lib-card {
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 10px;
    color: #409eff;
  }
  
  p {
    color: #606266;
    margin: 10px 0;
    font-size: 14px;
  }
}
</style>
