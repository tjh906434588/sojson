<template>
  <div class="home">
    <div class="container">
      <el-card class="welcome-card">
        <template #header>
          <div class="welcome-header">
            <el-icon :size="32" color="#409eff"><HomeFilled /></el-icon>
            <h1>{{ $t('common.title') }}</h1>
          </div>
        </template>
        <p class="welcome-text">{{ $t('tools.jsonParser.description') }}</p>
      </el-card>
      
      <el-row :gutter="20" class="tool-grid">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="tool in tools" :key="tool.path">
          <router-link :to="tool.path" class="tool-link">
            <el-card class="tool-card-item" shadow="hover">
              <div class="tool-item-content">
                <el-icon :size="32" :color="tool.color">
                  <component :is="tool.icon" />
                </el-icon>
                <h3>{{ $t(tool.title) }}</h3>
                <p>{{ $t(tool.desc) }}</p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Tools, 
  Lock, 
  Document, 
  Brush, 
  SwitchButton, 
  Picture, 
  Monitor, 
  Calendar, 
  Grid, 
  MoreFilled,
  HomeFilled
} from '@element-plus/icons-vue'

const tools = ref([
  { path: '/json/json-parse', icon: 'Tools', title: 'menu.jsonParse', desc: 'tools.jsonParser.description', color: '#409eff' },
  { path: '/encrypt/encrypt-decrypt', icon: 'Lock', title: 'menu.encrypt', desc: 'tools.encrypt.description', color: '#67c23a' },
  { path: '/compress/js-html-format', icon: 'Document', title: 'menu.jsHtmlFormat', desc: 'tools.jsHtmlFormat.description', color: '#e6a23c' },
  { path: '/frontend/color-picker', icon: 'Brush', title: 'menu.colorPicker', desc: 'tools.colorPicker.description', color: '#f56c6c' },
  { path: '/convert/case-convert', icon: 'SwitchButton', title: 'menu.caseConvert', desc: 'tools.caseConvert.description', color: '#909399' },
  { path: '/qrcode/qrcode-gen', icon: 'Picture', title: 'menu.qrcodeGen', desc: 'tools.qrcodeGen.description', color: '#409eff' },
  { path: '/life/date-calc', icon: 'Calendar', title: 'menu.dateCalc', desc: 'tools.dateCalc.description', color: '#67c23a' },
  { path: '/other/sudoku', icon: 'Grid', title: 'menu.sudoku', desc: 'tools.sudoku.description', color: '#e6a23c' }
])
</script>

<style scoped lang="scss">
.home {
  padding: 20px 0;
}

.welcome-card {
  margin-bottom: 30px;
  text-align: center;
  
  .welcome-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    
    h1 {
      margin: 0;
      font-size: 28px;
      color: #303133;
    }
  }
  
  .welcome-text {
    color: #606266;
    font-size: 16px;
    margin: 10px 0 0;
  }
}

.tool-grid {
  margin-top: 20px;
}

.tool-link {
  text-decoration: none;
  display: block;
  margin-bottom: 20px;
}

.tool-card-item {
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  
  .tool-item-content {
    text-align: center;
    padding: 20px 0;
    
    h3 {
      margin: 15px 0 10px;
      font-size: 18px;
      color: #303133;
    }
    
    p {
      color: #606266;
      font-size: 14px;
      margin: 0;
    }
  }
}
</style>
