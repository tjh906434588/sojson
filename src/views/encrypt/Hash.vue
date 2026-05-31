<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.hash.title') }}</h1>
          <p class="tool-description">{{ $t('tools.hash.description') }}</p>
        </div>
      </template>
      
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        placeholder="Enter text to hash"
      />
      
      <div class="button-group">
        <el-button type="primary" @click="generateHash('md5')">MD5</el-button>
        <el-button type="success" @click="generateHash('sha1')">SHA-1</el-button>
        <el-button type="warning" @click="generateHash('sha256')">SHA-256</el-button>
        <el-button type="info" @click="generateHash('sha512')">SHA-512</el-button>
      </div>
      
      <div v-if="hashes" class="hash-results">
        <el-descriptions :column="1" border>
          <el-descriptions-item v-for="(hash, algo) in hashes" :key="algo" :label="algo.toUpperCase()">
            <div class="hash-value">
              {{ hash }}
              <el-button size="small" @click="copyHash(hash)">Copy</el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const input = ref('')
const hashes = ref(null)

async function generateHash(type) {
  if (!input.value) {
    ElMessage.warning('Please enter text to hash')
    return
  }
  
  const msgUint8 = new TextEncoder().encode(input.value)
  const hashBuffer = await crypto.subtle.digest(type.toUpperCase().replace('-', '_'), msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  hashes.value = {
    [type]: hashHex
  }
}

const copyHash = (hash) => {
  navigator.clipboard.writeText(hash)
  ElMessage.success('Copied!')
}
</script>

<style scoped lang="scss">
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.hash-results {
  margin-top: 20px;
}

.hash-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: monospace;
  word-break: break-all;
}
</style>
