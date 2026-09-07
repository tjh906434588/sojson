<template>
  <div class="container">
    <el-card class="tool-card">
      <div class="encrypt-layout">
        <!-- 左：明文 -->
        <div class="panel left-panel">
          <div class="panel-title">{{ $t('tools.encryptDecrypt.plaintext') }}</div>
          <el-input
            v-model="plainText"
            type="textarea"
            class="textarea-input"
            :placeholder="$t('tools.encryptDecrypt.plaintext')"
          />
        </div>

        <!-- 中：加密方式 + 密钥 -->
        <div class="panel mid-panel">
          <div class="mid-control-row">
            <div class="mid-col">
              <div class="panel-title">{{ $t('tools.encryptDecrypt.algorithm') }}</div>
              <el-select v-model="algorithm" class="mid-select">
                <el-option v-for="a in algorithms" :key="a" :label="a" :value="a" />
              </el-select>
            </div>
            <div v-if="algorithm !== 'MD5'" class="mid-col">
              <div class="panel-title">{{ $t('tools.encryptDecrypt.key') }}</div>
              <el-input v-model="secretKey" :placeholder="$t('tools.encryptDecrypt.keyPlaceholder')" show-password />
            </div>
            <div v-else class="mid-col">
              <div class="panel-title">{{ $t('tools.encryptDecrypt.key') }}</div>
              <el-alert type="info" :closable="false" :title="$t('tools.encryptDecrypt.md5NoKey')" />
            </div>
          </div>

          <div class="mid-buttons">
            <el-button type="primary" @click="process('encrypt')">{{ $t('tools.encryptDecrypt.encrypt') }}<span class="btn-arrow"> ></span></el-button>
            <el-button type="success" @click="process('decrypt')"><span class="btn-arrow">< </span>{{ $t('tools.encryptDecrypt.decrypt') }}</el-button>
            <el-button @click="copyResult">{{ $t('tools.encryptDecrypt.copy') }}</el-button>
            <el-button @click="clearAll">{{ $t('tools.encryptDecrypt.clear') }}</el-button>
          </div>
        </div>

        <!-- 右：密文 -->
        <div class="panel right-panel">
          <div class="panel-title">{{ $t('tools.encryptDecrypt.ciphertext') }}</div>
          <template v-if="algorithm === 'MD5'">
            <div class="md5-panel">
              <el-input
                v-model="md5Input"
                type="textarea"
                class="textarea-input md5-input"
                :placeholder="$t('tools.encryptDecrypt.md5InputPlaceholder')"
              />
              <div class="md5-results">
                <div v-for="r in md5Results" :key="r.label" class="md5-row">
                  <span class="md5-label">{{ r.label }}</span>
                  <span class="md5-value">{{ r.value }}</span>
                  <el-button size="small" class="md5-copy" @click="copyText(r.value)">{{ $t('tools.encryptDecrypt.copy') }}</el-button>
                </div>
                <div v-if="!md5Results.length" class="md5-empty">{{ $t('tools.encryptDecrypt.md5Empty') }}</div>
              </div>
            </div>
          </template>
          <el-input
            v-else
            v-model="cipherText"
            type="textarea"
            class="textarea-input"
            :placeholder="$t('tools.encryptDecrypt.ciphertext')"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils'
import CryptoJS from 'crypto-js'

const { t } = useI18n()

const algorithms = ['AES', 'DES', 'RC4', 'Rabbit', 'MD5', 'TripleDes']
const algorithm = ref('AES')
const secretKey = ref('')
const plainText = ref('')
const cipherText = ref('')
const md5Input = ref('')
const md5Results = ref([])

// 生成 MD5 四种形式（32/16 位、大小写）
const toMd5Results = (md5) => {
  const md5_16 = md5.slice(8, 24)
  md5Results.value = [
    { label: t('tools.encryptDecrypt.md5Lower32'), value: md5 },
    { label: t('tools.encryptDecrypt.md5Upper32'), value: md5.toUpperCase() },
    { label: t('tools.encryptDecrypt.md5Lower16'), value: md5_16 },
    { label: t('tools.encryptDecrypt.md5Upper16'), value: md5_16.toUpperCase() }
  ]
}

// 提取用户输入的 MD5：支持 32 位或 16 位十六进制（大小写、0x 前缀均可）
const extractMd5 = (s) => {
  const hex = s.trim().toLowerCase().replace(/^0x/, '')
  if (hex.length === 32 && /^[0-9a-f]{32}$/.test(hex)) return { md5: hex }
  if (hex.length === 16 && /^[0-9a-f]{16}$/.test(hex)) return { md5: null, md5_16: hex }
  return null
}

const process = (action) => {
  const source = algorithm.value === 'MD5'
    ? (action === 'encrypt' ? plainText.value : md5Input.value)
    : (action === 'encrypt' ? plainText.value : cipherText.value)
  if (!source || !source.trim()) {
    ElMessage.warning(t('tools.encryptDecrypt.inputEmpty'))
    return
  }

  // MD5：无需密钥；加密生成四种，解密对输入的 MD5 值做格式转换
  if (algorithm.value === 'MD5') {
    if (action === 'encrypt') {
      toMd5Results(CryptoJS.MD5(source).toString())
    } else {
      const parsed = extractMd5(source)
      if (!parsed) {
        ElMessage.warning(t('tools.encryptDecrypt.md5Invalid'))
        return
      }
      if (parsed.md5) {
        toMd5Results(parsed.md5)
      } else {
        const v = parsed.md5_16
        md5Results.value = [
          { label: t('tools.encryptDecrypt.md5Lower16'), value: v },
          { label: t('tools.encryptDecrypt.md5Upper16'), value: v.toUpperCase() }
        ]
      }
    }
    return
  }

  // 对称算法：必须填写密钥
  if (!secretKey.value) {
    ElMessage.warning(t('tools.encryptDecrypt.keyEmpty'))
    return
  }

  const Ciphers = {
    AES: CryptoJS.AES,
    DES: CryptoJS.DES,
    RC4: CryptoJS.RC4,
    Rabbit: CryptoJS.Rabbit,
    TripleDes: CryptoJS.TripleDES
  }
  const cipher = Ciphers[algorithm.value]

  try {
    if (action === 'encrypt') {
      cipherText.value = cipher.encrypt(source, secretKey.value).toString()
    } else {
      const decrypted = cipher.decrypt(source, secretKey.value).toString(CryptoJS.enc.Utf8)
      if (!decrypted) {
        ElMessage.warning(t('tools.encryptDecrypt.decryptFailed'))
        return
      }
      plainText.value = decrypted
    }
  } catch (e) {
    ElMessage.error(t('tools.encryptDecrypt.processingFailed'))
  }
}

const copyText = (text) => {
  if (!text) {
    ElMessage.warning(t('tools.encryptDecrypt.copyEmpty'))
    return
  }
  copyToClipboard(text, t('common.copied'))
}

const copyResult = () => {
  if (algorithm.value === 'MD5') {
    if (!md5Results.value.length) {
      ElMessage.warning(t('tools.encryptDecrypt.copyEmpty'))
      return
    }
    copyText(md5Results.value.map((r) => r.label + ': ' + r.value).join('\n'))
    return
  }
  copyText(cipherText.value)
}

const clearAll = () => {
  plainText.value = ''
  cipherText.value = ''
  secretKey.value = ''
  md5Input.value = ''
  md5Results.value = []
}
</script>

<style scoped lang="scss">
// 卡片跟随内容区高度
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
  }
}

// 左中右三栏布局
.encrypt-layout {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.left-panel,
.right-panel {
  flex: 1;
}

// 中间控制栏：内容垂直居中
.mid-panel {
  width: 220px;
  flex-shrink: 0;
  justify-content: center;
}

.mid-control-row {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mid-col {
  width: 100%;
}

.panel-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}

.mid-select {
  width: 100%;
}

.mid-buttons {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .el-button {
    margin-left: 0;
    width: calc(50% - 5px); // 一排两个
  }
}

// 明文/密文输入框撑满面板剩余高度
.textarea-input {
  margin: 0; // 覆盖全局 .textarea-input 的 margin: 20px 0
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-textarea) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  :deep(.el-textarea__inner) {
    flex: 1;
    height: auto;
    min-height: 0;
  }
}

// MD5：输入框 + 四种结果
.md5-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;

  .md5-input {
    flex-shrink: 0;
    height: 40%;
  }
}

.md5-results {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.md5-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  .md5-label {
    flex-shrink: 0;
    width: 72px;
    font-size: 12px;
    line-height: 24px;
    color: #909399;
  }

  .md5-value {
    flex: 1;
    word-break: break-all;
    font-family: Consolas, Monaco, 'Courier New', monospace;
    font-size: 12px;
    line-height: 24px;
    color: #303133;
  }

  .md5-copy {
    flex-shrink: 0;
    margin-left: auto;
  }
}

.md5-empty {
  color: #909399;
  font-size: 13px;
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  // H5：去除加密/解密按钮的箭头符号
  .btn-arrow {
    display: none;
  }

  .encrypt-layout {
    flex-direction: column;
  }

  .mid-panel {
    width: 100%;
  }

  // H5：加密方式和密钥放在一行
  .mid-control-row {
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;

    .mid-col {
      flex: 1;
    }
  }

  .mid-buttons {
    flex-direction: row;
    flex-wrap: wrap;

    .el-button {
      width: auto;
      flex: 1;
    }
  }
}
</style>
