<script setup lang="ts">
import { ref, onMounted } from 'vue'

const works = [
  {
    name: 'LazyKeyboard',
    tagline: '把敏感输入从输入法手里拿回来',
    description:
      'Android 安全键盘：换一个 EditText 标签，密码框就从绑定层拒绝一切输入法，弹出应用内自绘键盘——数字每次乱序、防遮挡、纯 Java 零 Kotlin 运行时，v1.8 起提供可选的 Compose 适配。金融、政务类合规场景的轻量开源解法。',
    image: 'https://blog-1256167984.cos.ap-guangzhou.myqcloud.com/card_keyboard.png',
    chips: ['Android', '开源免费 · MIT', '纯 Java 轻依赖', 'Compose 可选适配'],
    repo: 'https://github.com/onlyloveyd/LazyKeyboard',
    release: 'https://github.com/onlyloveyd/LazyKeyboard/releases',
    releaseLabel: 'Releases',
    article: '/articles/lazykeyboard-security-keyboard.html',
    facts: ['输入法从绑定层断路，系统键盘无路径可弹', '数字键盘每次展示重新乱序，防肩窥防录屏', '输入回调 API：按键序列先于文本变化交付'],
    status: 'v1.8',
  },
  {
    name: 'Focus',
    tagline: '给「顺手点开」加一道闸门',
    description:
      '微信一切到前台，整个屏幕就暗下来：先等 5 秒冷静期，再写下你这次具体要干什么，不少于 4 个字，才放行。冲动过不去，意图过得去——它拦的不是行为，是无意识本身。',
    image: '/images/focus-fierce.png',
    chips: ['macOS', '开源免费', '无账号 · 不联网', '本地优先'],
    repo: 'https://github.com/onlyloveyd/Focus',
    release: 'https://github.com/onlyloveyd/Focus/releases',
    releaseLabel: '下载 DMG',
    article: '/articles/focus-25-times.html',
    facts: ['三种人格随时切换', '拦截名单自定义', '每一笔都有账可查'],
    status: 'v0.1.2',
  },
]

// 版本号运行时取各作品 GitHub 最新 Release，失败则回退到上面的静态值
const liveVersions = ref<Record<string, string>>({})
onMounted(async () => {
  const repos = [...new Set(works.map((w) => w.repo))]
  const entries = await Promise.all(
    repos.map(async (repo) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo.replace('https://github.com/', '')}/releases/latest`)
        if (!res.ok) return null
        const data = await res.json()
        return data.tag_name ? ([repo, data.tag_name] as const) : null
      } catch {
        /* 离线或限流时保持静态兜底值 */
        return null
      }
    })
  )
  liveVersions.value = Object.fromEntries(entries.filter(Boolean))
})
</script>

<template>
  <div class="ph">
    <header class="hero">
      <p class="hero-kicker">OHCODE · PORTFOLIO</p>
      <h1 class="hero-title">把想法做成作品</h1>
      <p class="hero-sub">
        一个工程师的开源工具、写作与方法论。<br />
        所有作品开源、免费、本地优先。
      </p>
    </header>

    <section id="作品" class="section">
      <h2 class="section-title">作品 <span class="section-en">WORKS</span></h2>
      <article v-for="w in works" :key="w.name" class="work">
        <div class="work-media">
          <img :src="w.image" :alt="`${w.name} — ${w.tagline}`" loading="lazy" />
        </div>
        <div class="work-body">
          <div class="work-name-row">
            <h3 class="work-name">{{ w.name }}</h3>
            <span class="work-status">{{ liveVersions[w.repo] || w.status }}</span>
          </div>
          <p class="work-tagline">{{ w.tagline }}</p>
          <p class="work-desc">{{ w.description }}</p>
          <ul class="work-facts">
            <li v-for="f in w.facts" :key="f">{{ f }}</li>
          </ul>
          <div class="work-chips">
            <span v-for="c in w.chips" :key="c" class="chip">{{ c }}</span>
          </div>
          <div class="work-actions">
            <a class="btn primary" :href="w.repo" target="_blank" rel="noopener">GitHub 仓库</a>
            <a class="btn" :href="w.release" target="_blank" rel="noopener">{{ w.releaseLabel || '下载 DMG' }}</a>
            <a class="btn ghost" :href="w.article">读实现故事 →</a>
          </div>
        </div>
      </article>
    </section>

    <footer class="ph-footer">
      <p>© 2026 OhCode · 微信公众号：OhCode</p>
    </footer>
  </div>
</template>

<style scoped>
.ph {
  max-width: 860px;
  margin: 0 auto;
  padding: 72px 24px 40px;
}

/* hero */
.hero-kicker {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: var(--vp-c-brand-2);
}
.hero-title {
  margin: 0;
  font-size: clamp(34px, 6vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  color: var(--vp-c-text-1);
}
.hero-sub {
  margin: 18px 0 0;
  font-size: 17px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

/* section */
.section {
  margin-top: 72px;
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

/* work card */
.work {
  display: grid;
  grid-template-columns: 5fr 6fr;
  gap: 32px;
  margin-top: 28px;
  padding: 28px;
  border: 1px solid rgba(43, 39, 36, 0.12);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 1px 3px rgba(43, 39, 36, 0.05);
}
@media (max-width: 720px) {
  .work {
    grid-template-columns: 1fr;
  }
}
.work-media img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  border: 1px solid rgba(43, 39, 36, 0.1);
}
.work-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.work-name {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}
.work-status {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-2);
  border: 1px solid var(--vp-c-brand-2);
  border-radius: 999px;
  padding: 2px 10px;
}
.work-tagline {
  margin: 6px 0 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.work-desc {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
.work-facts {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.work-facts li::before {
  content: '·';
  margin-right: 8px;
  color: var(--vp-c-brand-2);
  font-weight: 700;
}
.work-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.chip {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  background: rgba(43, 39, 36, 0.05);
  border-radius: 999px;
  padding: 4px 12px;
}
.work-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}
.btn {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  padding: 9px 18px;
  color: var(--vp-c-brand-2);
  border: 1px solid var(--vp-c-brand-2);
  transition: all 0.15s ease;
}
.btn:hover {
  background: var(--vp-c-brand-soft);
}
.btn.primary {
  color: #fff;
  background: var(--vp-c-brand-2);
}
.btn.primary:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.btn.ghost {
  border-color: transparent;
  color: var(--vp-c-text-2);
}
.btn.ghost:hover {
  color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}

/* footer */
.ph-footer {
  margin-top: 80px;
  padding-top: 24px;
  border-top: 1px solid rgba(43, 39, 36, 0.1);
  font-size: 13.5px;
  color: var(--vp-c-text-3);
}
.ph-footer a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-bottom: 1px dotted var(--vp-c-text-3);
}
.ph-footer a:hover {
  color: var(--vp-c-brand-2);
}
</style>
