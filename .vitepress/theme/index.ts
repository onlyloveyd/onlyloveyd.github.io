import DefaultTheme from 'vitepress/theme'
import './custom.css'
import PortfolioHome from './components/PortfolioHome.vue'
import ArticlesList from './components/ArticlesList.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PortfolioHome', PortfolioHome)
    app.component('ArticlesList', ArticlesList)
  },
}
