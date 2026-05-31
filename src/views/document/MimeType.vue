<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.mimeType.title') }}</h1>
          <p class="tool-description">{{ $t('tools.mimeType.description') }}</p>
        </div>
      </template>
      
      <el-table :data="mimeTypes" stripe style="width: 100%">
        <el-table-column prop="extension" :label="$t('tools.mimeType.extension')" width="120" />
        <el-table-column prop="mimeType" :label="$t('tools.mimeType.mimeType')" />
        <el-table-column prop="description" :label="$t('tools.mimeType.descriptionCol')" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mimeTypes = ref([
  { extension: '.html', mimeType: 'text/html', description: 'HTML document' },
  { extension: '.css', mimeType: 'text/css', description: 'Cascading Style Sheets' },
  { extension: '.js', mimeType: 'application/javascript', description: 'JavaScript' },
  { extension: '.json', mimeType: 'application/json', description: 'JSON format' },
  { extension: '.xml', mimeType: 'application/xml', description: 'XML document' },
  { extension: '.pdf', mimeType: 'application/pdf', description: 'PDF document' },
  { extension: '.zip', mimeType: 'application/zip', description: 'ZIP archive' },
  { extension: '.png', mimeType: 'image/png', description: 'PNG image' },
  { extension: '.jpg', mimeType: 'image/jpeg', description: 'JPEG image' },
  { extension: '.gif', mimeType: 'image/gif', description: 'GIF image' },
  { extension: '.svg', mimeType: 'image/svg+xml', description: 'SVG image' },
  { extension: '.mp4', mimeType: 'video/mp4', description: 'MP4 video' },
  { extension: '.mp3', mimeType: 'audio/mpeg', description: 'MP3 audio' },
  { extension: '.wav', mimeType: 'audio/wav', description: 'WAV audio' },
  { extension: '.txt', mimeType: 'text/plain', description: 'Plain text' }
])
</script>
