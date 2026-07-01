import { defineConfig } from 'vitepress'

const googleAnalyticsId = 'G-XKS7TN9FJ3'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "totally a shopper",
  description: "A simple blog.",
  cleanUrls: true,
  head: [
    [
      'script',
      {
        async: '',
        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
      }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}');`
    ]
  ],
  themeConfig: {
    website: 'https://github.com/leisaueha/leisaueha.github.io',
    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leisaueha/' },
      { icon: 'instagram', link: 'https://www.instagram.com/leisaueha/' },
      { icon: 'youtube', link: 'https://www.youtube.com/@leisaueha' }
    ]
  }
})
