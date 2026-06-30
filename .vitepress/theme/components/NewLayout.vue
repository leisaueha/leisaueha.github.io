<template>
  <Layout>
    <template #doc-before>
      <div v-if="!$frontmatter.page && $frontmatter.date" class="post-info doc-post-info">
        <time :datetime="convertDate($frontmatter.date)">{{ convertDate($frontmatter.date) }}</time>
        <span v-for="tag in $frontmatter.tags" :key="tag">{{ tag }}</span>
      </div>
    </template>
  </Layout>
  <Copyright />
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'

const { Layout } = DefaultTheme

function convertDate(input: Date | string) {
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return input.toISOString().slice(0, 10)
  }

  if (typeof input === 'string') return input.split('T')[0].trim()

  return ''
}
</script>
