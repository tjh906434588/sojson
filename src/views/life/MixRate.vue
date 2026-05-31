<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.mixRate.title') }}</h1>
          <p class="tool-description">{{ $t('tools.mixRate.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item label="Component A">
          <el-input-number v-model="form.a" :min="0" /> %
        </el-form-item>
        
        <el-form-item label="Component B">
          <el-input-number v-model="form.b" :min="0" /> %
        </el-form-item>
        
        <el-form-item label="Component C">
          <el-input-number v-model="form.c" :min="0" /> %
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="calculate">Calculate Total</el-button>
          <el-button @click="normalize">Normalize</el-button>
          <el-button @click="reset">Reset</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="total !== null" class="result-section">
        <el-progress 
          :text-inside="true" 
          :stroke-width="26" 
          :percentage="100"
          :format="formatProgress"
        >
          <div class="progress-content">
            <span>Total: {{ total }}%</span>
          </div>
        </el-progress>
        
        <el-alert
          v-if="total !== 100"
          :title="total < 100 ? 'Below 100% - can add more' : 'Above 100% - reduce amounts'"
          :type="total < 100 ? 'warning' : 'error'"
          style="margin-top: 20px"
        />
      </div>
      
      <div v-if="normalized.length" class="result-section">
        <h3>Normalized (totals to 100%)</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item v-for="(item, index) in normalized" :key="index" :label="'Component ' + String.fromCharCode(65 + index)">
            {{ item.toFixed(2) }}%
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  a: 0,
  b: 0,
  c: 0
})

const total = ref(null)
const normalized = ref([])

const calculate = () => {
  total.value = form.a + form.b + form.c
}

const normalize = () => {
  const sum = form.a + form.b + form.c
  if (sum === 0) {
    normalized.value = [0, 0, 0]
  } else {
    normalized.value = [
      (form.a / sum) * 100,
      (form.b / sum) * 100,
      (form.c / sum) * 100
    ]
  }
  calculate()
}

const reset = () => {
  form.a = 0
  form.b = 0
  form.c = 0
  total.value = null
  normalized.value = []
}

const formatProgress = () => `${total.value || 0}%`
</script>

<style scoped lang="scss">
.result-section {
  margin-top: 30px;
}

.progress-content {
  width: 100%;
  text-align: center;
}
</style>
