<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.rgbColor.title') }}</h1>
          <p class="tool-description">{{ $t('tools.rgbColor.description') }}</p>
        </div>
      </template>
      
      <el-color-picker v-model="selectedColor" @change="onColorChange" />
      
      <el-input v-model="rgbValue" :placeholder="$t('tools.rgbColor.rgbValue')" style="margin-top: 20px" />
      <el-input v-model="hexValue" :placeholder="$t('tools.rgbColor.hexValue')" style="margin-top: 10px" />
      
      <el-divider />
      
      <div class="color-grid">
        <div 
          v-for="color in colors" 
          :key="color.hex" 
          class="color-item"
          :style="{ backgroundColor: color.hex }"
          @click="selectColor(color)"
        >
          <span class="color-label">{{ color.name }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const selectedColor = ref('#409EFF')
const rgbValue = ref('rgb(64, 158, 255)')
const hexValue = ref('#409EFF')

const colors = computed(() => [
  { name: t('tools.rgbColor.red'), hex: '#FF0000' },
  { name: t('tools.rgbColor.green'), hex: '#00FF00' },
  { name: t('tools.rgbColor.blue'), hex: '#0000FF' },
  { name: t('tools.rgbColor.yellow'), hex: '#FFFF00' },
  { name: t('tools.rgbColor.cyan'), hex: '#00FFFF' },
  { name: t('tools.rgbColor.magenta'), hex: '#FF00FF' },
  { name: t('tools.rgbColor.black'), hex: '#000000' },
  { name: t('tools.rgbColor.white'), hex: '#FFFFFF' },
  { name: t('tools.rgbColor.orange'), hex: '#FFA500' },
  { name: t('tools.rgbColor.purple'), hex: '#800080' },
  { name: t('tools.rgbColor.pink'), hex: '#FFC0CB' },
  { name: t('tools.rgbColor.brown'), hex: '#A52A2A' },
  { name: t('tools.rgbColor.gray'), hex: '#808080' },
  { name: t('tools.rgbColor.navy'), hex: '#000080' },
  { name: t('tools.rgbColor.teal'), hex: '#008080' },
  { name: t('tools.rgbColor.olive'), hex: '#808000' }
])

const onColorChange = (color) => {
  hexValue.value = color
  rgbValue.value = hexToRgb(color)
}

const selectColor = (color) => {
  selectedColor.value = color.hex
  hexValue.value = color.hex
  rgbValue.value = hexToRgb(color.hex)
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
  }
  return ''
}
</script>

<style scoped lang="scss">
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.color-item {
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
  }
  
  .color-label {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
}
</style>
