<script setup lang="ts">
import { data as articles } from '../../../articles.data.ts'

function fmt(d: string) {
  const date = new Date(d)
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
}
</script>

<template>
  <ul class="articles">
    <li v-for="a in articles" :key="a.url" class="article">
      <a :href="a.url" class="article-title">{{ a.title }}</a>
      <p class="article-desc">{{ a.description }}</p>
      <time class="article-date">{{ fmt(a.date) }}</time>
    </li>
  </ul>
</template>

<style scoped>
.articles {
  list-style: none;
  margin: 0;
  padding: 0;
}
.article {
  padding: 22px 0;
  border-bottom: 1px solid rgba(43, 39, 36, 0.1);
}
.article:last-child {
  border-bottom: none;
}
.article-title {
  display: inline-block;
  font-size: 19px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.article-title:hover {
  color: var(--vp-c-brand-2);
}
.article-desc {
  margin: 8px 0 6px;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.article-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
