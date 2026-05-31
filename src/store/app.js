import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n, { setLanguage as setI18nLanguage } from '../locales'

export const useAppStore = defineStore('app', () => {
  const language = ref(i18n.global.locale.value)
  
  const setLanguage = (lang) => {
    language.value = lang
    setI18nLanguage(lang)
  }
  
  const toggleLanguage = () => {
    const newLang = language.value === 'zh' ? 'en' : 'zh'
    setLanguage(newLang)
  }
  
  return {
    language,
    setLanguage,
    toggleLanguage
  }
})
