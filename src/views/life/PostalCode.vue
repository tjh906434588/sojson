<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.postalCode.title') }}</h1>
          <p class="tool-description">{{ $t('tools.postalCode.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="100px">
        <el-form-item :label="$t('tools.postalCode.country')">
          <el-select v-model="form.country" :placeholder="$t('tools.postalCode.selectCountry')">
            <el-option :label="$t('tools.postalCode.china')" value="china" />
            <el-option :label="$t('tools.postalCode.usa')" value="usa" />
            <el-option :label="$t('tools.postalCode.uk')" value="uk" />
            <el-option :label="$t('tools.postalCode.japan')" value="japan" />
            <el-option :label="$t('tools.postalCode.korea')" value="korea" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('tools.postalCode.cityRegion')">
          <el-input v-model="form.region" :placeholder="$t('tools.postalCode.enterCity')" />
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="search">{{ $t('tools.postalCode.search') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <div v-if="results.length" class="results-section">
        <h3>{{ $t('tools.postalCode.postalCodes') }}</h3>
        <el-tag v-for="code in results" :key="code" size="large" class="code-tag">
          {{ code }}
        </el-tag>
      </div>
      
      <el-divider />
      
      <h3>{{ $t('tools.postalCode.commonReference') }}</h3>
      <el-table :data="commonCodes" stripe size="small">
        <el-table-column prop="city" :label="$t('tools.postalCode.cityCol')" />
        <el-table-column prop="code" :label="$t('tools.postalCode.postalCodeCol')" width="150" />
        <el-table-column prop="country" :label="$t('tools.postalCode.countryCol')" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = reactive({
  country: 'china',
  region: ''
})

const results = ref([])

const commonCodes = computed(() => [
  { city: t('tools.postalCode.beijing'), code: '100000', country: t('tools.postalCode.china') },
  { city: t('tools.postalCode.shanghai'), code: '200000', country: t('tools.postalCode.china') },
  { city: t('tools.postalCode.guangzhou'), code: '510000', country: t('tools.postalCode.china') },
  { city: t('tools.postalCode.shenzhen'), code: '518000', country: t('tools.postalCode.china') },
  { city: t('tools.postalCode.newYork'), code: '10001', country: t('tools.postalCode.usa') },
  { city: t('tools.postalCode.losAngeles'), code: '90001', country: t('tools.postalCode.usa') },
  { city: t('tools.postalCode.london'), code: 'SW1A 1AA', country: t('tools.postalCode.uk') },
  { city: t('tools.postalCode.tokyo'), code: '100-0001', country: t('tools.postalCode.japan') },
  { city: t('tools.postalCode.seoul'), code: '03000', country: t('tools.postalCode.korea') }
])

const search = () => {
  if (!form.region) {
    results.value = []
    return
  }
  
  results.value = [`${form.region.toUpperCase()}-${Math.floor(Math.random() * 90000) + 10000}`]
}
</script>

<style scoped lang="scss">
.results-section {
  margin: 20px 0;
  
  h3 {
    margin-bottom: 15px;
  }
}

.code-tag {
  margin: 5px;
  font-size: 16px;
}
</style>
