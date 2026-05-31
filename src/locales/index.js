import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const STORAGE_KEY = 'toolbox_language'

const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage
  if (lang && lang.toLowerCase().startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

const getInitialLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && (stored === 'zh' || stored === 'en')) {
    return stored
  }
  return getBrowserLanguage()
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
})

export const setLanguage = (lang) => {
  i18n.global.locale.value = lang
  localStorage.setItem(STORAGE_KEY, lang)
}

export default i18n
