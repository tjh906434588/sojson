<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.sentenceTrans.title') }}</h1>
          <p class="tool-description">{{ $t('tools.sentenceTrans.description') }}</p>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('tools.sentenceTrans.sourceLang')">
          <el-select v-model="form.sourceLang">
            <el-option :label="$t('tools.sentenceTrans.auto')" value="auto" />
            <el-option :label="$t('tools.sentenceTrans.english')" value="en" />
            <el-option :label="$t('tools.sentenceTrans.chinese')" value="zh" />
            <el-option :label="$t('tools.sentenceTrans.japanese')" value="ja" />
            <el-option :label="$t('tools.sentenceTrans.korean')" value="ko" />
            <el-option :label="$t('tools.sentenceTrans.french')" value="fr" />
            <el-option :label="$t('tools.sentenceTrans.german')" value="de" />
            <el-option :label="$t('tools.sentenceTrans.spanish')" value="es" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('tools.sentenceTrans.targetLang')">
          <el-select v-model="form.targetLang">
            <el-option :label="$t('tools.sentenceTrans.english')" value="en" />
            <el-option :label="$t('tools.sentenceTrans.chinese')" value="zh" />
            <el-option :label="$t('tools.sentenceTrans.japanese')" value="ja" />
            <el-option :label="$t('tools.sentenceTrans.korean')" value="ko" />
            <el-option :label="$t('tools.sentenceTrans.french')" value="fr" />
            <el-option :label="$t('tools.sentenceTrans.german')" value="de" />
            <el-option :label="$t('tools.sentenceTrans.spanish')" value="es" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('tools.sentenceTrans.sourceText')">
          <el-input v-model="form.sourceText" type="textarea" :rows="4" />
        </el-form-item>
        
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="translate">{{ $t('tools.sentenceTrans.translate') }}</el-button>
            <el-button @click="swap">{{ $t('tools.sentenceTrans.swap') }}</el-button>
            <el-button @click="clear">{{ $t('tools.sentenceTrans.clear') }}</el-button>
          </div>
        </el-form-item>
        
        <el-form-item :label="$t('tools.sentenceTrans.targetText')">
          <el-input v-model="form.translatedText" type="textarea" :rows="4" readonly />
        </el-form-item>
      </el-form>
      
      <el-alert
        :title="$t('tools.sentenceTrans.note')"
        type="info"
        :closable="false"
        style="margin-top: 20px"
      />
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const form = reactive({
  sourceLang: 'auto',
  targetLang: 'en',
  sourceText: '',
  translatedText: ''
})

const translations = {
  'zh-en': {
    '你好': 'Hello',
    '世界': 'World',
    '谢谢': 'Thank you',
    '再见': 'Goodbye'
  },
  'en-zh': {
    'hello': '你好',
    'world': '世界',
    'thank you': '谢谢',
    'goodbye': '再见'
  }
}

const translate = () => {
  if (!form.sourceText) {
    ElMessage.warning(t('tools.sentenceTrans.pleaseEnterText'))
    return
  }
  
  const key = `${form.sourceLang}-${form.targetLang}`
  const translation = translations[key]
  
  if (translation) {
    const lowerText = form.sourceText.toLowerCase().trim()
    form.translatedText = translation[lowerText] || `[Translation from ${form.sourceLang} to ${form.targetLang}]`
  } else {
    form.translatedText = `[Translation from ${form.sourceLang} to ${form.targetLang}]`
  }
  
  ElMessage.success(t('tools.sentenceTrans.translationCompleted'))
}

const swap = () => {
  const temp = form.sourceLang
  form.sourceLang = form.targetLang === 'auto' ? 'en' : form.targetLang
  form.targetLang = temp === 'auto' ? 'en' : temp
  
  const tempText = form.sourceText
  form.sourceText = form.translatedText
  form.translatedText = tempText
}

const clear = () => {
  form.sourceText = ''
  form.translatedText = ''
}
</script>
