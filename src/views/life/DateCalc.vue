<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.dateCalc.title') }}</h1>
          <p class="tool-description">{{ $t('tools.dateCalc.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="140px">
        <el-form-item :label="$t('tools.dateCalc.startDate')">
          <el-date-picker v-model="form.startDate" type="date" :placeholder="$t('common.selectDate')" />
        </el-form-item>
        
        <el-form-item :label="$t('tools.dateCalc.endDate')">
          <el-date-picker v-model="form.endDate" type="date" :placeholder="$t('common.selectDate')" />
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="calculate">{{ $t('tools.dateCalc.calculate') }}</el-button>
            <el-button @click="addDays">{{ $t('tools.dateCalc.addDays') }}</el-button>
            <el-button @click="subtractDays">{{ $t('tools.dateCalc.subtractDays') }}</el-button>
          </div>
        </el-form-item>
        
        <el-form-item :label="$t('tools.dateCalc.daysToAdd')" v-if="showDaysInput">
          <el-input-number v-model="form.days" :min="0" />
        </el-form-item>
      </el-form>
      
      <div v-if="result" class="result-section">
        <el-descriptions :column="1" border v-if="result.daysDifference !== undefined">
          <el-descriptions-item :label="$t('tools.dateCalc.daysDifference')">
            {{ result.daysDifference }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('tools.dateCalc.weeksDifference')">
            {{ result.weeksDifference }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('tools.dateCalc.hoursDifference')">
            {{ result.hoursDifference }}
          </el-descriptions-item>
        </el-descriptions>
        
        <el-descriptions :column="1" border v-if="result.newDate">
          <el-descriptions-item :label="$t('tools.dateCalc.newDate')">
            {{ result.newDate }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  startDate: null,
  endDate: null,
  days: 0
})

const showDaysInput = ref(false)
const result = ref(null)

const calculate = () => {
  if (!form.startDate || !form.endDate) return
  
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)
  const diff = Math.abs(end - start)
  
  result.value = {
    daysDifference: Math.floor(diff / (1000 * 60 * 60 * 24)),
    weeksDifference: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)),
    hoursDifference: Math.floor(diff / (1000 * 60 * 60))
  }
  showDaysInput.value = false
}

const addDays = () => {
  showDaysInput.value = true
  if (!form.startDate || !form.days) return
  
  const start = new Date(form.startDate)
  start.setDate(start.getDate() + form.days)
  
  result.value = {
    newDate: start.toLocaleDateString()
  }
}

const subtractDays = () => {
  showDaysInput.value = true
  if (!form.startDate || !form.days) return
  
  const start = new Date(form.startDate)
  start.setDate(start.getDate() - form.days)
  
  result.value = {
    newDate: start.toLocaleDateString()
  }
}
</script>

<style scoped lang="scss">
.result-section {
  margin-top: 30px;
}
</style>
