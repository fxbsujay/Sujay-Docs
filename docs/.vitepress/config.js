import { defineConfig } from 'vitepress'


export default defineConfig({
    title: 'Sujay',
    titleTemplate: ':title - Sujay',
    description: 'Sujay Blog.',
    lang: 'cn-ZH',
    markdown: {
        theme: 'material-theme-palenight',
        lineNumbers: true
    },
    cleanUrls: true,
    base: '/',
    ignoreDeadLinks: true,
    srcDir: './src',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ]
})