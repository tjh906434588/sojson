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

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CopyDocument } from '@element-plus/icons-vue'
import regionalDnsData from '@/config/regionalDns'
import { useIsMobile, copyToClipboard } from '@/utils'

const { t } = useI18n()

// H5 断点检测：桌面端 IP 列固定窄宽，H5 保持自适应
const isMobile = useIsMobile()

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

// 各地公共DNS列表（数据见 src/config/regionalDns.ts，共 381 条）
const regionalDns = ref(regionalDnsData)

// 点击 dns1/dns2 列内容复制
const copyDNS = (text) => {
  copyToClipboard(text, t('tools.publicDns.dnsCopied'))
}
</script>

<style scoped lang="scss">
.tool-card {
  // 全局 .tool-card 提供撑满布局，此处仅补充卡片内容区上下分区间距
  :deep(.el-card__body) {
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
