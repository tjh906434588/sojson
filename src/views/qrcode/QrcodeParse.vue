<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.qrcodeParse.title') }}</h1>
          <p class="tool-description">{{ $t('tools.qrcodeParse.description') }}</p>
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
          {{ $t('tools.qrcodeParse.dropText') }} <em>{{ $t('tools.qrcodeParse.clickText') }}</em>
        </div>
      </el-upload>
      
      <div v-if="previewUrl" class="preview-section">
        <img :src="previewUrl" alt="QR Code" class="qr-preview" />
      </div>
      
      <div v-if="result" class="result-section">
        <h3>{{ $t('tools.qrcodeParse.decodedContent') }}</h3>
        <el-input v-model="result" type="textarea" :rows="4" readonly />
        <div class="button-group">
          <el-button type="primary" @click="copyResult">{{ $t('tools.qrcodeParse.copy') }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const { t } = useI18n()

const previewUrl = ref('')
const result = ref('')

const handleFileChange = async (uploadFile) => {
  const file = uploadFile.raw
  previewUrl.value = URL.createObjectURL(file)
  
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const img = new Image()
      img.src = e.target.result
      await new Promise(resolve => { img.onload = resolve })
      
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      result.value = t('tools.qrcodeParse.successMessage')
    } catch (err) {
      ElMessage.error(t('tools.qrcodeParse.errorMessage'))
    }
  }
  reader.readAsDataURL(file)
}

const copyResult = () => {
  if (result.value) {
    navigator.clipboard.writeText(result.value)
    ElMessage.success(t('common.copied'))
  }
}
</script>

<style scoped lang="scss">
.preview-section {
  text-align: center;
  margin: 20px 0;
}

.qr-preview {
  max-width: 300px;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: white;
}

.result-section {
  margin-top: 20px;
  
  h3 {
    margin-bottom: 10px;
  }
}
</style>
