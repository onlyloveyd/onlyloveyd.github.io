<template>
  <div class="ph-articles">
    <h2 class="section-title">文章 <span class="section-en">WRITING</span></h2>
    <ArticlesList />
  </div>
</template>

<style scoped>
.ph-articles {
  max-width: 860px;
  margin: 0 auto;
  padding: 56px 24px 40px;
}
.section-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-brand-2);
  padding-bottom: 10px;
}
.section-en {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--vp-c-text-3);
}
</style>
