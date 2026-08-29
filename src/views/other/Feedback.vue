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

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { FEEDBACK_FORM_NAME } from '../../config/feedbackForm'

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
// 参考其他二级菜单页面：内容区全高、卡片撑满、内容在卡片内滚动
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px; // 覆盖全局 .container 的 padding，仅保留左右边距
}

.tool-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0; // 覆盖全局 .tool-card 的 padding: 24px
  margin-bottom: 0; // 覆盖全局 .tool-card 的 margin-bottom: 20px

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px; // 卡片内容内边距
  }
}

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