<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.publicDns.title') }}</h1>
          <p class="tool-description">{{ $t('tools.publicDns.description') }}</p>
        </div>
      </template>
      
      <el-table :data="dnsServers" stripe style="width: 100%">
        <el-table-column prop="provider" :label="$t('tools.publicDns.provider')" width="180" />
        <el-table-column prop="primary" :label="$t('tools.publicDns.primary')" />
        <el-table-column prop="secondary" :label="$t('tools.publicDns.secondary')" />
        <el-table-column prop="location" :label="$t('tools.publicDns.location')" width="120" />
        <el-table-column :label="$t('tools.publicDns.action')" width="100">
          <template #default="scope">
            <el-button size="small" @click="copyDNS(scope.row.primary)">{{ $t('common.copy') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const dnsServers = ref([
  { provider: 'Google DNS', primary: '8.8.8.8', secondary: '8.8.4.4', location: 'Global' },
  { provider: 'Cloudflare DNS', primary: '1.1.1.1', secondary: '1.0.0.1', location: 'Global' },
  { provider: 'OpenDNS', primary: '208.67.222.222', secondary: '208.67.220.220', location: 'Global' },
  { provider: 'Quad9 DNS', primary: '9.9.9.9', secondary: '149.112.112.112', location: 'Global' },
  { provider: 'Ali DNS', primary: '223.5.5.5', secondary: '223.6.6.6', location: 'China' },
  { provider: 'Tencent DNS', primary: '119.29.29.29', secondary: '182.254.116.116', location: 'China' },
  { provider: '114 DNS', primary: '114.114.114.114', secondary: '114.114.115.115', location: 'China' },
  { provider: 'DNSpod', primary: '119.29.29.29', secondary: '182.254.116.116', location: 'China' }
])

const copyDNS = (dns) => {
  navigator.clipboard.writeText(dns)
  ElMessage.success(t('tools.publicDns.dnsCopied'))
}
</script>
