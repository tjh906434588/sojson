<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.feedback.title') }}</h1>
          <p class="tool-description">{{ $t('tools.feedback.description') }}</p>
        </div>
      </template>
      
      <div class="feedback-content">
        <form :name="FEEDBACK_FORM_NAME" method="POST" data-netlify="true" @submit.prevent="submit">
          <input type="hidden" name="form-name" :value="FEEDBACK_FORM_NAME" />
          <el-form :model="form" label-width="120px">
            <el-form-item
              v-for="field in visibleFields"
              :key="field.key"
              :label="$t(field.labelKey)"
            >
              <el-select v-if="field.kind === 'select'" v-model="form[field.key]" :name="field.name">
                <el-option
                  v-for="option in field.options"
                  :key="option.value"
                  :label="$t(option.labelKey)"
                  :value="option.value"
                />
              </el-select>

              <el-rate
                v-else-if="field.kind === 'rate'"
                v-model="form[field.key]"
                show-text
                :texts="rateText"
              />

              <input
                v-if="field.kind === 'rate'"
                type="hidden"
                :name="field.name"
                :value="form[field.key]"
              />

              <el-input
                v-if="field.kind === 'input' || field.kind === 'textarea'"
                v-model="form[field.key]"
                :name="field.name"
                :type="field.kind === 'textarea' ? 'textarea' : 'text'"
                :rows="field.rows"
                :placeholder="field.placeholderKey ? $t(field.placeholderKey) : ''"
              />
            </el-form-item>
            
            <el-form-item>
              <div class="button-group">
                <el-button type="primary" native-type="submit">{{ $t('tools.feedback.submit') }}</el-button>
                <el-button @click="reset">{{ $t('common.reset') }}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </form>
        
        <el-divider />
        
        <div class="faq-section">
          <h3>{{ $t('tools.feedback.faq') }}</h3>
          
          <el-collapse>
            <el-collapse-item :title="$t('tools.feedback.howReportBug')" name="1">
              <p>{{ $t('tools.feedback.bugReportAnswer') }}</p>
            </el-collapse-item>
            
            <el-collapse-item :title="$t('tools.feedback.howSuggestTool')" name="2">
              <p>{{ $t('tools.feedback.suggestToolAnswer') }}</p>
            </el-collapse-item>
            
            <el-collapse-item :title="$t('tools.feedback.keepPrivate')" name="3">
              <p>{{ $t('tools.feedback.privacyAnswer') }}</p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

import { FEEDBACK_FORM_NAME, createFeedbackFormState, feedbackFields } from '../../config/feedbackForm'

const { t } = useI18n()

const rateText = computed(() => [
  t('tools.feedback.veryPoor'),
  t('tools.feedback.poor'),
  t('tools.feedback.average'),
  t('tools.feedback.good'),
  t('tools.feedback.excellent')
])

const form = reactive(createFeedbackFormState())

const visibleFields = computed(() => {
  return feedbackFields.filter((field) => !field.visibleWhen || field.visibleWhen(form))
})

const submit = async () => {
  const requiredField = feedbackFields.find((field) => field.required && !form[field.key])
  if (requiredField) {
    ElMessage.warning(t('tools.feedback.provideFeedback'))
    return
  }
  
  const formData = new URLSearchParams()
  formData.append('form-name', FEEDBACK_FORM_NAME)
  feedbackFields.forEach((field) => {
    formData.append(field.name, form[field.key])
  })
  
  await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  })
  
  ElMessage.success(t('tools.feedback.thankYou'))
  reset()
}

const reset = () => {
  Object.assign(form, createFeedbackFormState())
}
</script>

<style scoped lang="scss">
.feedback-content {
  max-width: 700px;
  margin: 0 auto;
}

.faq-section {
  margin-top: 30px;
  
  h3 {
    margin-bottom: 20px;
    color: #303133;
  }
  
  p {
    color: #606266;
    line-height: 1.6;
  }
}
</style>
