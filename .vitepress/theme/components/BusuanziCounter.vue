<script setup lang="ts">
import { onMounted } from 'vue'

// 不蒜子站点访问统计。VitePress 是 SPA,内部跳转返回首页时组件重新挂载,
// 需要重新注入脚本计数;官方端点加载失败时自动切换镜像重试。
const ENDPOINTS = [
  'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
  'https://busuanzi.9420.ltd/busuanzi/2.3/busuanzi.pure.mini.js',
]

onMounted(() => {
  document.getElementById('busuanzi-script')?.remove()
  let index = 0
  const inject = () => {
    if (index >= ENDPOINTS.length) return
    const script = document.createElement('script')
    script.id = 'busuanzi-script'
    script.src = `${ENDPOINTS[index++]}?ts=${Date.now()}`
    script.onerror = inject
    document.body.appendChild(script)
  }
  inject()
})
</script>

<template>
  <span class="bsz-counter">
    <span id="busuanzi_container_site_pv" style="display:none">
      本站访问 <span id="busuanzi_value_site_pv"></span> 次
    </span>
    <span class="bsz-sep">·</span>
    <span id="busuanzi_container_site_uv" style="display:none">
      访客 <span id="busuanzi_value_site_uv"></span> 人
    </span>
  </span>
</template>

<style scoped>
.bsz-sep {
  margin: 0 6px;
}
</style>
