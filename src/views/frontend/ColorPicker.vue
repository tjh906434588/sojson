<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.colorPicker.title') }}</h1>
          <p class="tool-description">{{ $t('tools.colorPicker.description') }}</p>
        </div>
      </template>
      
      <div class="color-picker-container">
        <el-color-picker v-model="selectedColor" size="large" />
        
        <div class="color-values">
          <el-form label-width="80px">
            <el-form-item :label="$t('tools.colorSelector.hex')">
              <el-input v-model="hexValue" @change="updateFromHex" />
            </el-form-item>
            <el-form-item :label="$t('tools.colorSelector.rgb')">
              <el-input v-model="rgbValue" @change="updateFromRgb" />
            </el-form-item>
            <el-form-item :label="$t('tools.rgbColor.hsl')">
              <el-input v-model="hslValue" @change="updateFromHsl" />
            </el-form-item>
          </el-form>
        </div>
        
        <div class="color-preview" :style="{ backgroundColor: selectedColor }"></div>
        
        <div class="preset-colors">
          <h3>{{ $t('tools.colorPicker.presetColors') }}</h3>
          <div class="color-presets">
            <div 
              v-for="color in presetColors" 
              :key="color"
              class="preset-color"
              :style="{ backgroundColor: color }"
              @click="selectedColor = color"
            ></div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const selectedColor = ref('#409EFF')
const hexValue = ref('#409EFF')
const rgbValue = ref('rgb(64, 158, 255)')
const hslValue = ref('hsl(210, 100%, 62%)')

const presetColors = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
  '#FFFFFF', '#C0C0C0', '#808080', '#000000', '#800000', '#008000', '#000080',
  '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#C71585', '#FF69B4'
]

watch(selectedColor, (newColor) => {
  hexValue.value = newColor
  rgbValue.value = hexToRgb(newColor)
  hslValue.value = rgbToHsl(hexToRgbObj(newColor))
})

const updateFromHex = () => {
  if (/^#[0-9A-Fa-f]{6}$/.test(hexValue.value)) {
    selectedColor.value = hexValue.value
  }
}

const updateFromRgb = () => {
  const match = rgbValue.value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match) {
    const r = parseInt(match[1])
    const g = parseInt(match[2])
    const b = parseInt(match[3])
    selectedColor.value = rgbToHex(r, g, b)
  }
}

const updateFromHsl = () => {
  const match = hslValue.value.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/)
  if (match) {
    const h = parseInt(match[1])
    const s = parseInt(match[2])
    const l = parseInt(match[3])
    const rgb = hslToRgb(h, s, l)
    selectedColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
  }
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
  }
  return ''
}

const hexToRgbObj = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
  }
  return { r: 0, g: 0, b: 0 }
}

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

const rgbToHsl = (rgb) => {
  const { r, g, b } = rgb
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
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
}

const hslToRgb = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}
</script>

<style scoped lang="scss">
.color-picker-container {
  text-align: center;
}

.color-values {
  margin: 30px auto;
  max-width: 400px;
  text-align: left;
}

.color-preview {
  width: 200px;
  height: 100px;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.preset-colors {
  margin-top: 30px;
  
  h3 {
    margin-bottom: 15px;
  }
}

.color-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.preset-color {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.1);
  }
}
</style>
