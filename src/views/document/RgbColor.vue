<template>
  <div class="container">
    <el-card class="tool-card">
      <div class="picker-row">
        <el-color-picker v-model="selectedColor" @change="onColorChange" />
        <el-input
          v-model="rgbValue"
          class="picker-input"
          :placeholder="$t('tools.rgbColor.rgbValue')"
          @change="onRgbInput"
        />
        <el-input
          v-model="hexValue"
          class="picker-input"
          :placeholder="$t('tools.rgbColor.hexValue')"
          @change="onHexInput"
        />
      </div>

      <div class="table-wrap">
        <el-table
          :data="colors"
          stripe
          height="100%"
          class="color-table"
          :key="isMobile"
          @row-click="selectColor"
        >
          <el-table-column
            class-name="col-swatch"
            :label="$t('tools.rgbColor.swatch')"
            :width="isMobile ? 80 : undefined"
            :min-width="isMobile ? undefined : 50"
          >
            <template #default="{ row }">
              <span class="swatch" :style="{ backgroundColor: row.hex }"></span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!isMobile"
            class-name="col-name"
            prop="name"
            :label="$t('tools.rgbColor.colorName')"
            min-width="100"
          />
          <el-table-column
            class-name="col-rgb"
            :label="$t('tools.rgbColor.rgbCol')"
            min-width="80"
          >
            <template #default="{ row }">
              <span class="copyable" @click.stop="copyText(row.rgb)">{{ row.rgb }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="col-hex"
            :label="$t('tools.rgbColor.hexCol')"
            min-width="80"
          >
            <template #default="{ row }">
              <span class="copyable" @click.stop="copyText(row.hex)">{{ row.hex }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const selectedColor = ref('#409EFF')
const rgbValue = ref('64 158 255')
const hexValue = ref('#409EFF')

// H5 断点检测（≤768px）：表头文案随模式切换
const isMobile = ref(false)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
updateIsMobile()
window.addEventListener('resize', updateIsMobile)
onUnmounted(() => window.removeEventListener('resize', updateIsMobile))

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const s = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return s.length === 1 ? `0${s}` : s
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

// 颜色选择器变化 -> 同步 RGB 与 Hex 输入框；清空颜色时两个输入框一并置空
const onColorChange = (color) => {
  if (!color) {
    selectedColor.value = ''
    rgbValue.value = ''
    hexValue.value = ''
    return
  }
  selectedColor.value = color
  hexValue.value = color.toUpperCase()
  const rgb = hexToRgb(color)
  rgbValue.value = rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : ''
}

// RGB 输入框变化 -> 反向修改选中的颜色
const onRgbInput = () => {
  const match = rgbValue.value.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!match) return
  const r = Number(match[1])
  const g = Number(match[2])
  const b = Number(match[3])
  if (r > 255 || g > 255 || b > 255) return
  const hex = rgbToHex(r, g, b)
  selectedColor.value = hex
  hexValue.value = hex
  rgbValue.value = `${r} ${g} ${b}`
}

// Hex 输入框变化 -> 反向修改选中的颜色
const onHexInput = () => {
  const rgb = hexToRgb(hexValue.value)
  if (!rgb) return
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  selectedColor.value = hex
  hexValue.value = hex
  rgbValue.value = `${rgb.r} ${rgb.g} ${rgb.b}`
}

// 点击表格行 -> 选中该颜色
const selectColor = (row) => {
  selectedColor.value = row.hex
  hexValue.value = row.hex
  rgbValue.value = row.rgb
}

// 复制 RGB / 16色 列内容
const copyText = (text) => {
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
  ElMessage.success(t('common.copied'))
}

const colors = [
  { name: 'CornflowerBlue', rgb: '100 149 237', hex: '#6495ED' },
  { name: 'White', rgb: '255 255 255', hex: '#FFFFFF' },
  { name: 'LightGray', rgb: '211 211 211', hex: '#D3D3D3' },
  { name: 'Silver', rgb: '192 192 192', hex: '#C0C0C0' },
  { name: 'Gray', rgb: '128 128 128', hex: '#808080' },
  { name: 'DimGray', rgb: '105 105 105', hex: '#696969' },
  { name: 'Black', rgb: '0 0 0', hex: '#000000' },
  { name: 'Red', rgb: '255 0 0', hex: '#FF0000' },
  { name: 'DarkRed', rgb: '139 0 0', hex: '#8B0000' },
  { name: 'Maroon', rgb: '128 0 0', hex: '#800000' },
  { name: 'OrangeRed', rgb: '255 69 0', hex: '#FF4500' },
  { name: 'Tomato', rgb: '255 99 71', hex: '#FF6347' },
  { name: 'Coral', rgb: '255 127 80', hex: '#FF7F50' },
  { name: 'Orange', rgb: '255 165 0', hex: '#FFA500' },
  { name: 'DarkOrange', rgb: '255 140 0', hex: '#FF8C00' },
  { name: 'Gold', rgb: '255 215 0', hex: '#FFD700' },
  { name: 'Yellow', rgb: '255 255 0', hex: '#FFFF00' },
  { name: 'Khaki', rgb: '240 230 140', hex: '#F0E68C' },
  { name: 'GreenYellow', rgb: '173 255 47', hex: '#ADFF2F' },
  { name: 'Chartreuse', rgb: '127 255 0', hex: '#7FFF00' },
  { name: 'Lime', rgb: '0 255 0', hex: '#00FF00' },
  { name: 'Green', rgb: '0 128 0', hex: '#008000' },
  { name: 'DarkGreen', rgb: '0 100 0', hex: '#006400' },
  { name: 'SeaGreen', rgb: '46 139 87', hex: '#2E8B57' },
  { name: 'MediumSeaGreen', rgb: '60 179 113', hex: '#3CB371' },
  { name: 'Aquamarine', rgb: '127 255 212', hex: '#7FFFD4' },
  { name: 'Cyan', rgb: '0 255 255', hex: '#00FFFF' },
  { name: 'DarkCyan', rgb: '0 139 139', hex: '#008B8B' },
  { name: 'Teal', rgb: '0 128 128', hex: '#008080' },
  { name: 'LightSeaGreen', rgb: '32 178 170', hex: '#20B2AA' },
  { name: 'SkyBlue', rgb: '135 206 235', hex: '#87CEEB' },
  { name: 'LightSkyBlue', rgb: '135 206 250', hex: '#87CEFA' },
  { name: 'DeepSkyBlue', rgb: '0 191 255', hex: '#00BFFF' },
  { name: 'DodgerBlue', rgb: '30 144 255', hex: '#1E90FF' },
  { name: 'RoyalBlue', rgb: '65 105 225', hex: '#4169E1' },
  { name: 'Blue', rgb: '0 0 255', hex: '#0000FF' },
  { name: 'MediumBlue', rgb: '0 0 205', hex: '#0000CD' },
  { name: 'DarkBlue', rgb: '0 0 139', hex: '#00008B' },
  { name: 'Navy', rgb: '0 0 128', hex: '#000080' },
  { name: 'MidnightBlue', rgb: '25 25 112', hex: '#191970' },
  { name: 'MediumSlateBlue', rgb: '123 104 238', hex: '#7B68EE' },
  { name: 'BlueViolet', rgb: '138 43 226', hex: '#8A2BE2' },
  { name: 'Indigo', rgb: '75 0 130', hex: '#4B0082' },
  { name: 'DarkViolet', rgb: '148 0 211', hex: '#9400D3' },
  { name: 'Purple', rgb: '128 0 128', hex: '#800080' },
  { name: 'DarkMagenta', rgb: '139 0 139', hex: '#8B008B' },
  { name: 'Fuchsia', rgb: '255 0 255', hex: '#FF00FF' },
  { name: 'DeepPink', rgb: '255 20 147', hex: '#FF1493' },
  { name: 'HotPink', rgb: '255 105 180', hex: '#FF69B4' },
  { name: 'Pink', rgb: '255 192 203', hex: '#FFC0CB' }
]
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
  }
}

// 颜色选择器 + RGB/Hex 输入框
.picker-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;

  .picker-input {
    flex: 1;
    min-width: 160px;
    max-width: 280px;
  }
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

// 实色效果色块
.swatch {
  display: inline-block;
  width: 36px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  vertical-align: middle;
}

// RGB / 16色 列内容：点击可复制
.copyable {
  cursor: pointer;
  color: var(--el-color-primary);
  word-break: break-all;
  transition: color 0.2s;

  &:hover {
    color: var(--el-color-primary-light-3);
    text-decoration: underline;
  }
}

// H5 模式：颜色选择器与两个输入框单行展示
@media (max-width: 768px) {
  .picker-row {
    flex-wrap: nowrap;
    gap: 8px;

    .picker-input {
      min-width: 0;
      max-width: none;
    }
  }
}
</style>
