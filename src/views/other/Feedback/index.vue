<template>
  <div class="container">
    <el-card class="tool-card">
      <div class="feedback-content">
        <el-form :model="form" label-position="top" class="feedback-form">
          <el-form-item :label="$t('tools.feedback.type')">
            <el-radio-group v-model="form.type">
              <el-radio label="bug">{{ $t('tools.feedback.typeBug') }}</el-radio>
              <el-radio label="suggestion">{{ $t('tools.feedback.typeSuggestion') }}</el-radio>
              <el-radio label="question">{{ $t('tools.feedback.typeQuestion') }}</el-radio>
              <el-radio label="other">{{ $t('tools.feedback.typeOther') }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="$t('tools.feedback.toolName')">
            <el-input v-model="form.toolName" :placeholder="$t('tools.feedback.toolNamePlaceholder')" />
          </el-form-item>

          <el-form-item :label="$t('tools.feedback.rating')">
            <el-rate v-model="form.rating" />
          </el-form-item>

          <el-form-item :label="$t('tools.feedback.content')">
            <el-input v-model="form.content" type="textarea" :rows="6" :placeholder="$t('tools.feedback.contentPlaceholder')" />
          </el-form-item>

          <el-form-item :label="$t('tools.feedback.email')">
            <el-input v-model="form.email" :placeholder="$t('tools.feedback.emailPlaceholder')" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="submitFeedback">
              {{ $t('tools.feedback.submit') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { FEEDBACK_FORM_NAME } from '@/config/feedbackForm'

const { t } = useI18n()
const submitting = ref(false)

const form = reactive({
  type: 'bug',
  toolName: '',
  rating: 5,
  content: '',
  email: ''
})

const submitFeedback = async () => {
  if (!form.content.trim()) {
    ElMessage.warning(t('tools.feedback.contentEmpty'))
    return
  }
  if (form.email && !/^[\w.-]+@[\w-]+(.[\w-]+)+$/.test(form.email)) {
    ElMessage.warning(t('tools.feedback.emailInvalid'))
    return
  }
  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('form-name', FEEDBACK_FORM_NAME)
    fd.append('feedback-type', form.type)
    fd.append('tool-name', form.toolName)
    fd.append('rating', String(form.rating))
    fd.append('feedback-content', form.content)
    fd.append('email', form.email)
    await fetch('/', {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    })
    ElMessage.success(t('tools.feedback.submitSuccess'))
    form.type = 'bug'
    form.toolName = ''
    form.rating = 5
    form.content = ''
    form.email = ''
  } catch (e) {
    ElMessage.error(t('tools.feedback.submitFailed'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.feedback-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  max-width: 760px; // 表单过宽时限制行宽，提升可读性
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.feedback-form {
  width: 100%;

  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>