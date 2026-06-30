import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "totally a shopper",
  description: "A simple blog.",
  cleanUrls: true,
  themeConfig: {
    website: 'https://github.com/leisaueha/leisaueha.github.io',
    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leisaueha/leisaueha.github.io' },
      { icon: 'instagram', link: 'https://www.instagram.com/leisaueha/' },
      { icon: 'youtube', link: 'https://www.youtube.com/@leisaueha' }
    ]
  }
})
