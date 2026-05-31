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
        <el-form :model="form" label-width="120px">
          <el-form-item :label="$t('tools.feedback.type')">
            <el-select v-model="form.type">
              <el-option :label="$t('tools.feedback.bugReport')" value="bug" />
              <el-option :label="$t('tools.feedback.featureRequest')" value="feature" />
              <el-option :label="$t('tools.feedback.general')" value="general" />
              <el-option :label="$t('tools.feedback.toolSuggestion')" value="suggestion" />
            </el-select>
          </el-form-item>
          
          <el-form-item :label="$t('tools.feedback.toolName')" v-if="form.type !== 'general'">
            <el-input v-model="form.toolName" :placeholder="$t('tools.feedback.toolNamePlaceholder')" />
          </el-form-item>
          
          <el-form-item :label="$t('tools.feedback.rating')">
            <el-rate v-model="form.rating" show-text :texts="rateText" />
          </el-form-item>
          
          <el-form-item :label="$t('tools.feedback.feedback')">
            <el-input 
              v-model="form.feedback" 
              type="textarea" 
              :rows="6" 
              :placeholder="$t('tools.feedback.feedbackPlaceholder')"
            />
          </el-form-item>
          
          <el-form-item :label="$t('tools.feedback.email')">
            <el-input v-model="form.email" :placeholder="$t('tools.feedback.emailPlaceholder')" />
          </el-form-item>
          
          <el-form-item>
            <div class="button-group">
              <el-button type="primary" @click="submit">{{ $t('tools.feedback.submit') }}</el-button>
              <el-button @click="reset">{{ $t('common.reset') }}</el-button>
            </div>
          </el-form-item>
        </el-form>
        
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

const { t } = useI18n()

const rateText = computed(() => [
  t('tools.feedback.veryPoor'),
  t('tools.feedback.poor'),
  t('tools.feedback.average'),
  t('tools.feedback.good'),
  t('tools.feedback.excellent')
])

const form = reactive({
  type: 'general',
  toolName: '',
  rating: 0,
  feedback: '',
  email: ''
})

const submit = () => {
  if (!form.feedback) {
    ElMessage.warning(t('tools.feedback.provideFeedback'))
    return
  }
  
  ElMessage.success(t('tools.feedback.thankYou'))
  reset()
}

const reset = () => {
  form.type = 'general'
  form.toolName = ''
  form.rating = 0
  form.feedback = ''
  form.email = ''
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
