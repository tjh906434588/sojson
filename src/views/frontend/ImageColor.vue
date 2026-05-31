<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.imageColor.title') }}</h1>
          <p class="tool-description">{{ $t('tools.imageColor.description') }}</p>
        </div>
      </template>
      
      <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          {{ $t('tools.imageColor.dropText') }} <em>{{ $t('tools.imageColor.clickText') }}</em>
        </div>
      </el-upload>
      
      <canvas ref="canvas" @click="pickColor" class="image-canvas" v-if="imageUrl"></canvas>
      
      <div v-if="pickedColors.length" class="picked-colors">
        <h3>{{ $t('tools.imageColor.pickedColors') }}</h3>
        <div class="color-list">
          <div v-for="(color, index) in pickedColors" :key="index" class="picked-color-item">
            <div class="color-swatch" :style="{ backgroundColor: color }"></div>
            <span>{{ color }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const canvas = ref(null)
const imageUrl = ref('')
const pickedColors = ref([])

const handleFileChange = (uploadFile) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    pickedColors.value = []
    setTimeout(() => drawImage(), 100)
  }
  reader.readAsDataURL(uploadFile.raw)
}

const drawImage = () => {
  const img = new Image()
  img.onload = () => {
    const canvasEl = canvas.value
    canvasEl.width = img.width
    canvasEl.height = img.height
    const ctx = canvasEl.getContext('2d')
    ctx.drawImage(img, 0, 0)
  }
  img.src = imageUrl.value
}

const pickColor = (event) => {
  const canvasEl = canvas.value
  const rect = canvasEl.getBoundingClientRect()
  const scaleX = canvasEl.width / rect.width
  const scaleY = canvasEl.height / rect.height
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const ctx = canvasEl.getContext('2d')
  const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data
  const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
  
  pickedColors.value.push(color.toUpperCase())
}
</script>

<style scoped lang="scss">
.image-canvas {
  max-width: 100%;
  margin: 20px 0;
  cursor: crosshair;
  border-radius: 8px;
}

.picked-colors {
  margin-top: 20px;
  
  h3 {
    margin-bottom: 15px;
  }
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.picked-color-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  
  .color-swatch {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  span {
    font-family: monospace;
  }
}
</style>
