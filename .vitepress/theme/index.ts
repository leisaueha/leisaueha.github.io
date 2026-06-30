import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import NewLayout from './components/NewLayout.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout: NewLayout
} satisfies Theme
