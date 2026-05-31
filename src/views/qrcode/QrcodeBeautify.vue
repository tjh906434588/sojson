<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.qrcodeBeautify.title') }}</h1>
          <p class="tool-description">{{ $t('tools.qrcodeBeautify.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('tools.qrcodeBeautify.content')">
          <el-input v-model="form.content" type="textarea" :rows="3" />
        </el-form-item>
        
        <el-form-item :label="$t('tools.qrcodeBeautify.foreground')">
          <el-color-picker v-model="form.fgColor" />
        </el-form-item>
        
        <el-form-item :label="$t('tools.qrcodeBeautify.background')">
          <el-color-picker v-model="form.bgColor" />
        </el-form-item>
        
        <el-form-item :label="$t('tools.qrcodeBeautify.logo')">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleLogoChange"
          >
            <el-button>{{ $t('tools.qrcodeBeautify.uploadLogo') }}</el-button>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="generateQR">{{ $t('tools.qrcodeBeautify.generate') }}</el-button>
            <el-button @click="downloadQR" :disabled="!qrDataUrl">{{ $t('tools.qrcodeBeautify.download') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <div v-if="qrDataUrl" class="qr-result">
        <img :src="qrDataUrl" alt="QR Code" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import QRCode from 'qrcode'

const form = reactive({
  content: 'https://example.com',
  fgColor: '#000000',
  bgColor: '#ffffff'
})

const qrDataUrl = ref('')
const logoDataUrl = ref('')

const handleLogoChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    logoDataUrl.value = e.target.result
    generateQR()
  }
  reader.readAsDataURL(file.raw)
}

const generateQR = async () => {
  if (!form.content) return
  
  try {
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, form.content, {
      width: 300,
      margin: 2,
      color: {
        dark: form.fgColor,
        light: form.bgColor
      }
    })
    
    if (logoDataUrl.value) {
      const ctx = canvas.getContext('2d')
      const logoSize = 60
      const logo = new Image()
      logo.src = logoDataUrl.value
      await new Promise(resolve => {
        logo.onload = resolve
      })
      
      const x = (canvas.width - logoSize) / 2
      const y = (canvas.height - logoSize) / 2
      ctx.fillStyle = form.bgColor
      ctx.fillRect(x, y, logoSize, logoSize)
      ctx.drawImage(logo, x, y, logoSize, logoSize)
    }
    
    qrDataUrl.value = canvas.toDataURL()
  } catch (err) {
    console.error(err)
  }
}

const downloadQR = () => {
  if (!qrDataUrl.value) return
  const link = document.createElement('a')
  link.download = 'qrcode-beautified.png'
  link.href = qrDataUrl.value
  link.click()
}
</script>

<style scoped lang="scss">
.qr-result {
  text-align: center;
  margin-top: 20px;
  
  img {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background: white;
  }
}
</style>
