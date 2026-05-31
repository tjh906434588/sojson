<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.algebra.title') }}</h1>
          <p class="tool-description">{{ $t('tools.algebra.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item label="Operation">
          <el-select v-model="form.operation">
            <el-option label="Solve Quadratic" value="quadratic" />
            <el-option label="Factorial" value="factorial" />
            <el-option label="Prime Check" value="prime" />
            <el-option label="Fibonacci" value="fibonacci" />
            <el-option label="Power" value="power" />
            <el-option label="Square Root" value="sqrt" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Number A" v-if="needsA">
          <el-input-number v-model="form.a" :precision="2" />
        </el-form-item>
        
        <el-form-item label="Number B" v-if="needsB">
          <el-input-number v-model="form.b" :precision="2" />
        </el-form-item>
        
        <el-form-item label="Number C" v-if="needsC">
          <el-input-number v-model="form.c" :precision="2" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="calculate">Calculate</el-button>
          <el-button @click="clear">Clear</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="result !== null" class="result-section">
        <el-alert :title="'Result: ' + result" type="success" :closable="false" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const form = reactive({
  operation: 'sqrt',
  a: 0,
  b: 0,
  c: 0
})

const result = ref(null)

const needsA = computed(() => ['quadratic', 'factorial', 'prime', 'fibonacci', 'power', 'sqrt'].includes(form.operation))
const needsB = computed(() => ['quadratic', 'power'].includes(form.operation))
const needsC = computed(() => form.operation === 'quadratic')

const calculate = () => {
  switch (form.operation) {
    case 'quadratic':
      const a = form.a, b = form.b, c = form.c
      const discriminant = b * b - 4 * a * c
      if (discriminant < 0) {
        result.value = 'No real roots'
      } else if (discriminant === 0) {
        result.value = `x = ${(-b / (2 * a)).toFixed(2)}`
      } else {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
        result.value = `x1 = ${x1.toFixed(2)}, x2 = ${x2.toFixed(2)}`
      }
      break
    case 'factorial':
      result.value = factorial(form.a)
      break
    case 'prime':
      result.value = isPrime(form.a) ? 'Prime' : 'Not Prime'
      break
    case 'fibonacci':
      result.value = fibonacci(form.a)
      break
    case 'power':
      result.value = Math.pow(form.a, form.b)
      break
    case 'sqrt':
      result.value = Math.sqrt(form.a)
      break
  }
}

const factorial = (n) => {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

const isPrime = (n) => {
  if (n <= 1) return false
  if (n <= 3) return true
  if (n % 2 === 0 || n % 3 === 0) return false
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }
  return true
}

const fibonacci = (n) => {
  let a = 0, b = 1
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b]
  }
  return a
}

const clear = () => {
  result.value = null
}
</script>

<style scoped lang="scss">
.result-section {
  margin-top: 20px;
}
</style>
