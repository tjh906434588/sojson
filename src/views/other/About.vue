<template>
  <div class="container">
    <el-card class="tool-card">
      <template #header>
        <div class="tool-header">
          <h1 class="tool-title">{{ $t('tools.about.title') }}</h1>
          <p class="tool-description">{{ $t('tools.about.description') }}</p>
        </div>
      </template>
      
      <div class="about-content">
        <el-icon :size="64" color="#409eff" class="about-icon"><Tools /></el-icon>
        
        <h2>Welcome to Online Toolbox</h2>
        
        <p>
          Online Toolbox is a comprehensive collection of free online tools designed to make your 
          work easier. Whether you're a developer, designer, or just someone who needs quick 
          access to common utilities, we've got you covered.
        </p>
        
        <h3>Our Mission</h3>
        <p>
          Our goal is to provide high-quality, easy-to-use tools that help you get things done 
          faster. All tools are completely free to use with no registration required.
        </p>
        
        <h3>Features</h3>
        <ul>
          <li>JSON formatting and validation</li>
          <li>Encryption and decryption tools</li>
          <li>Code formatting and minification</li>
          <li>Color pickers and converters</li>
          <li>QR code generation and reading</li>
          <li>Webmaster utilities</li>
          <li>Life tools and calculators</li>
          <li>And much more!</li>
        </ul>
        
        <h3>Technology</h3>
        <p>
          Built with modern web technologies including Vue.js 3, Element Plus, and Vite for a 
          fast and responsive experience.
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Tools } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.about-content {
  max-width: 800px;
  margin: 0 auto;
  
  .about-icon {
    display: block;
    margin: 0 auto 20px;
  }
  
  h2 {
    text-align: center;
    color: #409eff;
    margin-bottom: 20px;
  }
  
  h3 {
    color: #303133;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  
  p {
    color: #606266;
    line-height: 1.8;
    margin-bottom: 15px;
  }
  
  ul {
    padding-left: 30px;
    color: #606266;
    
    li {
      margin-bottom: 8px;
    }
  }
}
</style>
