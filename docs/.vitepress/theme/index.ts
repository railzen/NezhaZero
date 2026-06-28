import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import DocAsideannouncement from './components/DocAsideannouncement.vue'

export default {
    ...DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'aside-ads-before': () => h(DocAsideannouncement)
        })
    }
}
