<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.webSafeColor.title') }}</h1>
          <p class="tool-description">{{ $t('tools.webSafeColor.description') }}</p>
        </div>
      </template>
      
      <div class="color-grid">
        <div 
          v-for="color in webSafeColors" 
          :key="color" 
          class="color-item"
          :style="{ backgroundColor: color }"
        >
          <span class="color-label">{{ color }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const webSafeColors = ref([
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00',
  '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00', '#00FF33',
  '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
  '#0066FF', '#0033FF', '#0000FF', '#3300FF', '#6600FF', '#9900FF',
  '#CC00FF', '#FF00FF', '#FF00CC', '#FF0099', '#FF0066', '#FF0033'
])
</script>

<style scoped lang="scss">
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

.color-item {
  height: 60px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.1);
  }
  
  .color-label {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 11px;
    font-family: monospace;
  }
}
</style>
