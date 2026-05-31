<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.encrypt.title') }}</h1>
          <p class="tool-description">{{ $t('tools.encrypt.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('tools.encrypt.algorithm')">
          <el-select v-model="form.algorithm" @change="onAlgorithmChange">
            <el-option :label="$t('tools.encrypt.base64')" value="base64" />
            <el-option :label="$t('tools.encrypt.rot13')" value="rot13" />
            <el-option :label="$t('tools.encrypt.caesar')" value="caesar" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('tools.encrypt.mode')">
          <el-radio-group v-model="form.mode">
            <el-radio label="encrypt">{{ $t('tools.encrypt.encrypt') }}</el-radio>
            <el-radio label="decrypt">{{ $t('tools.encrypt.decrypt') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item :label="$t('tools.encrypt.shift')" v-if="form.algorithm === 'caesar'">
          <el-input-number v-model="form.shift" :min="1" :max="25" />
        </el-form-item>
        
        <el-form-item :label="$t('tools.encrypt.input')">
          <el-input v-model="form.input" type="textarea" :rows="4" />
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="process">{{ $t('tools.encrypt.process') }}</el-button>
            <el-button @click="copy">{{ $t('tools.encrypt.copyResult') }}</el-button>
            <el-button @click="clear">{{ $t('common.clear') }}</el-button>
          </div>
        </el-form-item>
        
        <el-form-item :label="$t('tools.encrypt.output')">
          <el-input v-model="form.output" type="textarea" :rows="4" readonly />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const form = reactive({
  algorithm: 'base64',
  mode: 'encrypt',
  shift: 3,
  input: '',
  output: ''
})

const onAlgorithmChange = () => {
  form.output = ''
}

const process = () => {
  if (!form.input) {
    ElMessage.warning(t('tools.encrypt.pleaseEnterText'))
    return
  }
  
  try {
    if (form.algorithm === 'base64') {
      form.output = form.mode === 'encrypt' 
        ? btoa(unescape(encodeURIComponent(form.input)))
        : decodeURIComponent(escape(atob(form.input)))
    } else if (form.algorithm === 'rot13') {
      form.output = form.input.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97
        return String.fromCharCode((char.charCodeAt(0) - base + 13) % 26 + base)
      })
    } else if (form.algorithm === 'caesar') {
      const shift = form.mode === 'encrypt' ? form.shift : -form.shift
      form.output = form.input.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97
        return String.fromCharCode((char.charCodeAt(0) - base + shift + 26) % 26 + base)
      })
    }
  } catch (e) {
    ElMessage.error(t('tools.encrypt.processingFailed'))
  }
}

const copy = () => {
  if (form.output) {
    navigator.clipboard.writeText(form.output)
    ElMessage.success(t('common.copied'))
  }
}

const clear = () => {
  form.input = ''
  form.output = ''
}
</script>
