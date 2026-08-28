<template>
  <div class="home">
    <div class="container">
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

const tools = ref([
  { path: '/json/json-parse', icon: 'EditPen', title: 'menu.jsonParse', desc: 'tools.jsonParser.description', color: '#409eff' },
  { path: '/json/json-online-parse', icon: 'DataAnalysis', title: 'menu.jsonOnlineParse', desc: 'tools.jsonOnlineParse.description', color: '#67c23a' },
  { path: '/json/json-compress-escape', icon: 'Operation', title: 'menu.jsonCompressEscape', desc: 'tools.jsonCompressEscape.description', color: '#f56c6c' },
  { path: '/json/json-online-view', icon: 'View', title: 'menu.jsonOnlineView', desc: 'tools.jsonOnlineView.description', color: '#909399' },
  { path: '/json/json-color', icon: 'MagicStick', title: 'menu.jsonColor', desc: 'tools.jsonColor.description', color: '#7c3aed' },
  { path: '/json/json-xml', icon: 'Switch', title: 'menu.jsonXmlConvert', desc: 'tools.jsonXml.description', color: '#e6a23c' },
  { path: '/json/json-compare', icon: 'Tickets', title: 'menu.jsonCompare', desc: 'tools.jsonCompare.description', color: '#9c27b0' }
])
</script>

<style scoped lang="scss">
.home {
  padding: 20px 0;
}


.tool-grid {
  margin-top: 0;
  row-gap: 20px;
}

.tool-link {
  text-decoration: none;
  display: block;
  height: 100%;
}
.tool-card-item {
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .tool-item-content {
    text-align: center;
    padding: 20px 0;
    width: 100%;

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
