<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.contact.title') }}</h1>
          <p class="tool-description">{{ $t('tools.contact.description') }}</p>
        </div>
      </template>
      
      <div class="contact-content">
        <el-alert
          :title="$t('tools.contact.weLoveHear')"
          type="success"
          :closable="false"
          style="margin-bottom: 30px"
        />
        
        <el-form :model="form" label-width="120px">
          <el-form-item :label="$t('tools.contact.name')">
            <el-input v-model="form.name" :placeholder="$t('tools.contact.namePlaceholder')" />
          </el-form-item>
          
          <el-form-item :label="$t('tools.contact.email')">
            <el-input v-model="form.email" :placeholder="$t('tools.contact.emailPlaceholder')" />
          </el-form-item>
          
          <el-form-item :label="$t('tools.contact.subject')">
            <el-input v-model="form.subject" :placeholder="$t('tools.contact.subjectPlaceholder')" />
          </el-form-item>
          
          <el-form-item :label="$t('tools.contact.message')">
            <el-input v-model="form.message" type="textarea" :rows="6" :placeholder="$t('tools.contact.messagePlaceholder')" />
          </el-form-item>
          
          <el-form-item>
            <div class="button-group">
              <el-button type="primary" @click="submit">{{ $t('tools.contact.sendMessage') }}</el-button>
              <el-button @click="reset">{{ $t('common.reset') }}</el-button>
            </div>
          </el-form-item>
        </el-form>
        
        <el-divider />
        
        <div class="other-contact">
          <h3>{{ $t('tools.contact.otherWays') }}</h3>
          
          <div class="contact-item">
            <el-icon><Message /></el-icon>
            <span>{{ $t('tools.contact.email') }}: contact@onlinetoolbox.com</span>
          </div>
          
          <div class="contact-item">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ $t('tools.contact.support') }}: support@onlinetoolbox.com</span>
          </div>
          
          <div class="contact-item">
            <el-icon><Clock /></el-icon>
            <span>{{ $t('tools.contact.responseTime') }}: {{ $t('tools.contact.usuallyWithin') }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Message, ChatDotRound, Clock } from '@element-plus/icons-vue'

const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submit = () => {
  if (!form.name || !form.email || !form.message) {
    ElMessage.warning(t('tools.contact.fillRequired'))
    return
  }
  
  ElMessage.success(t('tools.contact.messageSent'))
  reset()
}

const reset = () => {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>

<style scoped lang="scss">
.contact-content {
  max-width: 600px;
  margin: 0 auto;
}

.other-contact {
  margin-top: 30px;
  
  h3 {
    margin-bottom: 20px;
    color: #303133;
  }
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #606266;
  
  .el-icon {
    font-size: 20px;
    color: #409eff;
  }
}
</style>
