<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { inBrowser, useData, withBase } from 'vitepress'
import { data as posts } from './posts.data'

const pageSize = 10
const { site } = useData()
const requestedPage = ref(1)

const currentPage = computed(() => {
  const page = requestedPage.value

  if (!Number.isInteger(page) || page < 1) return 1

  return Math.min(page, totalPages.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(posts.length / pageSize)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize

  return posts.slice(start, start + pageSize)
})
const pageArray = computed(() => generatePaginationArray(totalPages.value, currentPage.value))

function formatDate(date: string) {
  if (!date) return ''

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(`${date}T00:00:00`))
}

function pageHref(page: number) {
  const base = site.value.base.replace(/\/$/, '')

  return page === 1 ? `${base}/` : `${base}/?page=${page}`
}

function syncRequestedPage() {
  if (!inBrowser) return

  requestedPage.value = Number(new URLSearchParams(window.location.search).get('page') ?? '1')
}

onMounted(syncRequestedPage)

function generatePaginationArray(pagesNum: number, currentPage: number) {
  const pages = new Set<number>([1, pagesNum])

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < pagesNum) pages.add(page)
  }

  return Array.from(pages)
    .sort((a, b) => a - b)
    .reduce<(number | string)[]>((result, page) => {
      const previous = result[result.length - 1]

      if (typeof previous === 'number' && page - previous > 1) result.push('...')

      result.push(page)
      return result
    }, [])
}
</script>

<template>
  <section class="blog-index" aria-label="Latest posts">
    <p v-if="posts.length === 0" class="blog-empty">No posts yet.</p>

    <article v-for="post in paginatedPosts" :key="post.url" class="post-list">
      <div class="post-header">
        <h2 class="post-title">
          <span v-if="post.order > 0" aria-hidden="true">Pinned </span>
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </h2>
      </div>
      <p v-if="post.summary" class="describe">{{ post.summary }}</p>
      <div class="post-info">
        <time v-if="post.date" :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
      </div>
    </article>

    <nav v-if="totalPages > 1" class="blog-pagination" aria-label="Blog pagination">
      <span
        v-for="item in pageArray"
        :key="item"
        :class="['link', { active: item === currentPage }]"
      >
        <template v-if="item === '...'">...</template>
        <template v-else-if="item === currentPage">{{ item }}</template>
        <a v-else :href="pageHref(item as number)">{{ item }}</a>
      </span>
    </nav>
  </section>
</template>
