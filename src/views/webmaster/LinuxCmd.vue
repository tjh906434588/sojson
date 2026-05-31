<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.linuxCmd.title') }}</h1>
          <p class="tool-description">{{ $t('tools.linuxCmd.description') }}</p>
        </div>
      </template>
      
      <el-table :data="commands" stripe style="width: 100%">
        <el-table-column prop="command" :label="$t('tools.linuxCmd.command')" width="200" />
        <el-table-column prop="description" :label="$t('tools.linuxCmd.descriptionCol')" />
        <el-table-column prop="example" :label="$t('tools.linuxCmd.example')" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const commands = computed(() => [
  { command: 'ls', description: t('tools.linuxCmd.lsDesc'), example: 'ls -la' },
  { command: 'cd', description: t('tools.linuxCmd.cdDesc'), example: 'cd /path/to/dir' },
  { command: 'pwd', description: t('tools.linuxCmd.pwdDesc'), example: 'pwd' },
  { command: 'mkdir', description: t('tools.linuxCmd.mkdirDesc'), example: 'mkdir newdir' },
  { command: 'rm', description: t('tools.linuxCmd.rmDesc'), example: 'rm -rf dirname' },
  { command: 'cp', description: t('tools.linuxCmd.cpDesc'), example: 'cp source dest' },
  { command: 'mv', description: t('tools.linuxCmd.mvDesc'), example: 'mv old new' },
  { command: 'cat', description: t('tools.linuxCmd.catDesc'), example: 'cat file.txt' },
  { command: 'grep', description: t('tools.linuxCmd.grepDesc'), example: 'grep "pattern" file' },
  { command: 'chmod', description: t('tools.linuxCmd.chmodDesc'), example: 'chmod 755 file' },
  { command: 'chown', description: t('tools.linuxCmd.chownDesc'), example: 'chown user:group file' },
  { command: 'tar', description: t('tools.linuxCmd.tarDesc'), example: 'tar -czvf archive.tar.gz dir' },
  { command: 'zip', description: t('tools.linuxCmd.zipDesc'), example: 'zip archive.zip files' },
  { command: 'unzip', description: t('tools.linuxCmd.unzipDesc'), example: 'unzip archive.zip' },
  { command: 'find', description: t('tools.linuxCmd.findDesc'), example: 'find . -name "*.txt"' },
  { command: 'ps', description: t('tools.linuxCmd.psDesc'), example: 'ps aux' },
  { command: 'kill', description: t('tools.linuxCmd.killDesc'), example: 'kill PID' },
  { command: 'df', description: t('tools.linuxCmd.dfDesc'), example: 'df -h' },
  { command: 'du', description: t('tools.linuxCmd.duDesc'), example: 'du -sh *' },
  { command: 'top', description: t('tools.linuxCmd.topDesc'), example: 'top' }
])
</script>
