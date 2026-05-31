<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.imageTool.title') }}</h1>
          <p class="tool-description">{{ $t('tools.imageTool.description') }}</p>
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
          Drop image here or <em>click to upload</em>
        </div>
      </el-upload>
      
      <div v-if="imageUrl" class="image-preview">
        <img :src="imageUrl" alt="Preview" />
      </div>
      
      <div v-if="imageUrl" class="tool-options">
        <el-form label-width="120px">
          <el-form-item label="Brightness">
            <el-slider v-model="filters.brightness" :min="0" :max="200" @change="applyFilters" />
          </el-form-item>
          
          <el-form-item label="Contrast">
            <el-slider v-model="filters.contrast" :min="0" :max="200" @change="applyFilters" />
          </el-form-item>
          
          <el-form-item label="Grayscale">
            <el-switch v-model="filters.grayscale" @change="applyFilters" />
          </el-form-item>
          
          <el-form-item label="Blur">
            <el-slider v-model="filters.blur" :min="0" :max="20" @change="applyFilters" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="download">Download</el-button>
            <el-button @click="reset">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const imageUrl = ref('')
const originalImageUrl = ref('')

const filters = reactive({
  brightness: 100,
  contrast: 100,
  grayscale: false,
  blur: 0
})

const handleFileChange = (uploadFile) => {
  originalImageUrl.value = URL.createObjectURL(uploadFile.raw)
  imageUrl.value = originalImageUrl.value
  reset()
}

const applyFilters = () => {
  if (!originalImageUrl.value) return
  
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale ? 100 : 0}%) blur(${filters.blur}px)`
    ctx.drawImage(img, 0, 0)
    
    imageUrl.value = canvas.toDataURL()
  }
  img.src = originalImageUrl.value
}

const download = () => {
  if (!imageUrl.value) return
  const link = document.createElement('a')
  link.download = 'edited-image.png'
  link.href = imageUrl.value
  link.click()
}

const reset = () => {
  filters.brightness = 100
  filters.contrast = 100
  filters.grayscale = false
  filters.blur = 0
  imageUrl.value = originalImageUrl.value
}
</script>

<style scoped lang="scss">
.image-preview {
  text-align: center;
  margin: 20px 0;
  
  img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.tool-options {
  margin-top: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
