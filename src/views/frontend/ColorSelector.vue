<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.colorSelector.title') }}</h1>
          <p class="tool-description">{{ $t('tools.colorSelector.description') }}</p>
        </div>
      </template>
      
      <div class="selector-container">
        <div class="color-preview-large" :style="{ backgroundColor: selectedColor }"></div>
        
        <div class="slider-group">
          <div class="slider-item">
            <label>R ({{ r }})</label>
            <el-slider v-model="r" :min="0" :max="255" @change="updateColor" />
          </div>
          <div class="slider-item">
            <label>G ({{ g }})</label>
            <el-slider v-model="g" :min="0" :max="255" @change="updateColor" />
          </div>
          <div class="slider-item">
            <label>B ({{ b }})</label>
            <el-slider v-model="b" :min="0" :max="255" @change="updateColor" />
          </div>
        </div>
        
        <div class="color-output">
          <el-form label-width="80px">
            <el-form-item label="HEX">
              <el-input v-model="hexValue" readonly />
            </el-form-item>
            <el-form-item label="RGB">
              <el-input v-model="rgbString" readonly />
            </el-form-item>
            <el-form-item label="HSL">
              <el-input v-model="hslString" readonly />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const r = ref(64)
const g = ref(158)
const b = ref(255)
const selectedColor = ref('rgb(64, 158, 255)')

const hexValue = computed(() => {
  return `#${r.value.toString(16).padStart(2, '0')}${g.value.toString(16).padStart(2, '0')}${b.value.toString(16).padStart(2, '0')}`.toUpperCase()
})

const rgbString = computed(() => `rgb(${r.value}, ${g.value}, ${b.value})`)

const hslString = computed(() => {
  const rNorm = r.value / 255
  const gNorm = g.value / 255
  const bNorm = b.value / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
})

const updateColor = () => {
  selectedColor.value = rgbString.value
}
</script>

<style scoped lang="scss">
.selector-container {
  max-width: 600px;
  margin: 0 auto;
}

.color-preview-large {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.slider-group {
  margin-bottom: 30px;
}

.slider-item {
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
