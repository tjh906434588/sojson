<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.webColors.title') }}</h1>
          <p class="tool-description">{{ $t('tools.webColors.description') }}</p>
        </div>
      </template>
      
      <div class="color-grid">
        <div 
          v-for="color in webColors" 
          :key="color.hex" 
          class="color-item"
          :style="{ backgroundColor: color.hex }"
        >
          <div class="color-info">
            <span class="color-name">{{ color.name }}</span>
            <span class="color-hex">{{ color.hex }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const webColors = ref([
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#008000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Lime', hex: '#00FF00' },
  { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Violet', hex: '#EE82EE' },
  { name: 'Salmon', hex: '#FA8072' },
  { name: 'Turquoise', hex: '#40E0D0' }
])
</script>

<style scoped lang="scss">
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.color-item {
  height: 100px;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
  }
  
  .color-info {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    text-align: center;
    width: 100%;
    
    .color-name {
      display: block;
      font-size: 14px;
      font-weight: bold;
    }
    
    .color-hex {
      display: block;
      font-size: 12px;
      margin-top: 4px;
      font-family: monospace;
    }
  }
}
</style>
