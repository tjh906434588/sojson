<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.qrcodeGen.title') }}</h1>
          <p class="tool-description">{{ $t('tools.qrcodeGen.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('tools.qrcodeGen.content')">
          <el-input v-model="form.content" type="textarea" :rows="4" :placeholder="$t('tools.qrcodeGen.inputPlaceholder')" />
        </el-form-item>
        
        <el-form-item :label="$t('tools.qrcodeGen.size')">
          <el-slider v-model="form.size" :min="100" :max="400" :step="10" show-stops />
        </el-form-item>
        
        <el-form-item :label="$t('tools.qrcodeGen.errorLevel')">
          <el-select v-model="form.errorLevel">
            <el-option :label="$t('tools.qrcodeGen.lowLabel')" value="L" />
            <el-option :label="$t('tools.qrcodeGen.mediumLabel')" value="M" />
            <el-option :label="$t('tools.qrcodeGen.quartileLabel')" value="Q" />
            <el-option :label="$t('tools.qrcodeGen.highLabel')" value="H" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="generateQR">{{ $t('tools.qrcodeGen.generateQrBtn') }}</el-button>
            <el-button @click="downloadQR" :disabled="!qrDataUrl">{{ $t('tools.qrcodeGen.download') }}</el-button>
            <el-button @click="clear">{{ $t('common.clear') }}</el-button>
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
  content: '',
  size: 200,
  errorLevel: 'M'
})

const qrDataUrl = ref('')

const generateQR = async () => {
  if (!form.content) {
    return
  }
  
  try {
    qrDataUrl.value = await QRCode.toDataURL(form.content, {
      width: form.size,
      errorCorrectionLevel: form.errorLevel,
      margin: 2
    })
  } catch (err) {
    console.error(err)
  }
}

const downloadQR = () => {
  if (!qrDataUrl.value) return
  
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrDataUrl.value
  link.click()
}

const clear = () => {
  form.content = ''
  qrDataUrl.value = ''
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
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
