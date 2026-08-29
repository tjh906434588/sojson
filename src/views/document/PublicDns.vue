<template>
  <div class="container">
    <el-card class="tool-card">
      <div class="table-section">
        <h2 class="section-title">{{ $t('tools.publicDns.onlineTitle') }}</h2>
        <div class="table-wrap">
          <el-table
            :data="dnsServers"
            stripe
            height="100%"
            class="dns-table"
            :span-method="spanMethod"
          >
            <el-table-column
              class-name="col-provider"
              prop="provider"
              :label="$t('tools.publicDns.provider')"
              min-width="90"
            />
            <el-table-column
              class-name="col-dns1"
              :label="$t('tools.publicDns.dns1')"
              min-width="130"
            >
              <template #default="{ row }">
                <span class="copyable" :title="$t('common.copy')" @click="copyDNS(row.dns1)">
                  <el-icon class="copy-icon"><CopyDocument /></el-icon>
                  {{ row.dns1 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              class-name="col-dns2"
              :label="$t('tools.publicDns.dns2')"
              min-width="130"
            >
              <template #default="{ row }">
                <span class="copyable" :title="$t('common.copy')" @click="copyDNS(row.dns2)">
                  <el-icon class="copy-icon"><CopyDocument /></el-icon>
                  {{ row.dns2 }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="table-section">
        <h2 class="section-title">{{ $t('tools.publicDns.regionalTitle') }}</h2>
        <div class="table-wrap">
          <el-table
            :data="regionalDns"
            stripe
            height="100%"
            class="regional-table"
            :key="isMobile"
            :empty-text="$t('tools.publicDns.pending')"
          >
            <el-table-column
              class-name="col-start"
              prop="startIp"
              :label="$t('tools.publicDns.startIp')"
              :width="isMobile ? undefined : ipColWidth"
              :min-width="isMobile ? 100 : undefined"
            />
            <el-table-column
              class-name="col-end"
              prop="endIp"
              :label="$t('tools.publicDns.endIp')"
              :width="isMobile ? undefined : ipColWidth"
              :min-width="isMobile ? 100 : undefined"
            />
            <el-table-column
              class-name="col-addr"
              prop="serverAddr"
              :label="$t('tools.publicDns.serverAddr')"
              min-width="140"
            />
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'
import regionalDnsData from './regionalDns.js'

const { t } = useI18n()

// H5 断点检测（≤768px）：桌面端 IP 列固定窄宽，H5 保持自适应
const isMobile = ref(false)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
updateIsMobile()
window.addEventListener('resize', updateIsMobile)
onUnmounted(() => window.removeEventListener('resize', updateIsMobile))

// 桌面端 IP 列宽：最长 IP 文本(15字符/14px) 100px + 单元格 padding 24px + 少量余量
const ipColWidth = 128

// dnspai 行：dns1/dns2 合并为一个单元格（对应源表格的 colspan=2）
const spanMethod = ({ row, columnIndex }) => {
  if (row.provider === 'dnspai' && columnIndex === 1) return { rowspan: 1, colspan: 2 }
  if (row.provider === 'dnspai' && columnIndex === 2) return { rowspan: 0, colspan: 0 }
}

// 在线免费公共DNS列表
const dnsServers = ref([
  { provider: '阿里云', dns1: '223.5.5.5', dns2: '223.6.6.6' },
  { provider: '百度智能云', dns1: '180.76.76.76', dns2: '2400:da00::6666（IPv6）' },
  {
    provider: '华为云',
    dns1: '122.112.208.1\n114.115.192.11\n116.205.5.30\n139.159.208.206',
    dns2: '139.9.23.90\n116.205.5.1\n122.112.208.175'
  },
  { provider: 'OpenDNS', dns1: '208.67.222.222', dns2: '208.67.220.220' },
  {
    provider: 'Google',
    dns1: '8.8.8.8（IPv4）\n2001:4860:4860::8888（IPv6）',
    dns2: '8.8.4.4（IPv4）\n2001:4860:4860::8844（IPv6）'
  },
  { provider: '114 DNS', dns1: '114.114.114.114', dns2: '114.114.115.115' },
  {
    provider: 'Cloudflare',
    dns1: '1.1.1.1（IPv4）\n2606:4700:4700::1111（IPv6）',
    dns2: '1.0.0.1（IPv4）\n2606:4700:4700::1001（IPv6）'
  },
  { provider: 'IBM Quad9', dns1: '9.9.9.9', dns2: '149.112.112.112' },
  { provider: 'DNSPod', dns1: '119.29.29.29', dns2: '182.254.116.116' },
  { provider: 'CNNIC sdns', dns1: '1.2.4.8', dns2: '210.2.4.8' },
  { provider: 'V2EXDNS', dns1: '199.91.73.222', dns2: '178.79.131.110' },
  { provider: 'onedns', dns1: '117.50.11.11', dns2: '117.50.22.22' },
  { provider: 'yandex', dns1: '77.88.8.8', dns2: '77.88.8.1' },
  {
    provider: 'dnspai',
    dns1: '电信：首选：101.226.4.6\n联通：首选：123.125.81.6\n移动：首选：101.226.4.6\n铁通：首选：101.226.4.6',
    dns2: ''
  }
])

// 各地公共DNS列表（数据见 regionalDns.js，共 381 条）
const regionalDns = ref(regionalDnsData)

// 点击 dns1/dns2 列内容复制
const copyDNS = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
  } else {
    // 兼容非安全上下文（如 http 环境）的回退方案
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  ElMessage.success(t('tools.publicDns.dnsCopied'))
}
</script>

<style scoped lang="scss">
// 参考 MimeType 页面样式：内容区全高、卡片撑满、表格填充并内部滚动
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
    padding: 20px;
    gap: 20px;
  }
}

.table-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.table-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  :deep(.el-table) {
    flex: 1;
    width: 100%;
  }
}

// dns1/dns2 列内容：点击可复制，多行地址按行展示
.copyable {
  cursor: pointer;
  display: inline-flex;
  align-items: flex-start;
  gap: 6px;
  color: var(--el-color-primary);
  white-space: pre-line;
  word-break: break-all;
  transition: color 0.2s;

  &:hover {
    color: var(--el-color-primary-light-3);
  }

  .copy-icon {
    flex-shrink: 0;
    font-size: 14px;
    margin-top: 2px;
  }
}
</style>
