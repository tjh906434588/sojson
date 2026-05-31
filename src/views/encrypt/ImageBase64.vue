<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.imageBase64.title') }}</h1>
          <p class="tool-description">{{ $t('tools.imageBase64.description') }}</p>
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
          Drop file here or <em>click to upload</em>
        </div>
      </el-upload>
      
      <div v-if="previewUrl" class="preview-section">
        <img :src="previewUrl" alt="Preview" class="image-preview" />
      </div>
      
      <el-input
        v-if="base64Result"
        v-model="base64Result"
        type="textarea"
        :rows="6"
        readonly
      />
      
      <div v-if="base64Result" class="button-group">
        <el-button type="primary" @click="copy">Copy Base64</el-button>
        <el-button @click="download">Download as TXT</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const file = ref(null)
const previewUrl = ref('')
const base64Result = ref('')

const handleFileChange = (uploadFile) => {
  file.value = uploadFile.raw
  
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    base64Result.value = e.target.result
  }
  reader.readAsDataURL(file.value)
}

const copy = () => {
  navigator.clipboard.writeText(base64Result.value)
  ElMessage.success('Copied!')
}

const download = () => {
  const blob = new Blob([base64Result.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'image-base64.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped lang="scss">
.preview-section {
  margin: 20px 0;
  text-align: center;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}
</style>
