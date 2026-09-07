import { onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'

// H5/移动端断点：视口宽度 ≤ 768px
export const H5_BREAKPOINT = 768

/**
 * 响应式 H5/移动端检测
 * 初始值即时计算（避免首屏闪烁），随窗口 resize 自动更新，组件卸载时自动移除监听。
 * @param breakpoint 断点宽度，默认 768
 * @returns 是否为 H5/移动端的响应式布尔值
 */
export function useIsMobile(breakpoint: number = H5_BREAKPOINT): Ref<boolean> {
  const isMobile = ref(window.innerWidth <= breakpoint)
  const update = () => {
    isMobile.value = window.innerWidth <= breakpoint
  }
  window.addEventListener('resize', update)
  onUnmounted(() => window.removeEventListener('resize', update))
  return isMobile
}

/**
 * 复制文本到剪贴板
 * 优先使用异步 Clipboard API；非安全上下文（如 http 环境）回退到 textarea + execCommand。
 * 复制成功后可选弹出成功提示（可传入 i18n 文案）。
 * @param text 要复制的文本
 * @param successMessage 复制成功后的提示文案，不传则不弹提示
 */
export async function copyToClipboard(text: string, successMessage?: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text)
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
  if (successMessage) {
    ElMessage.success(successMessage)
  }
}
