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
    ],
    themeConfig: {
        logo: '/favicon.ico',
        siteTitle: 'Delightful-CSS',
        outline: 3,
        footer: {
            copyright: 'Copyright © 2020-present <a href="https://github.com/fxbsujay">Fan XueBin</a>'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/fxbsujay' }
        ],
        nav: [
            { text: '博客', link: '/blog/blog' },
        ],
        sidebar: {
            '/blog': [
                {
                    text: 'Aa',
                    items: [
                        { text: '组件库介绍', link: '/blog/blog' },
                        { text: '快速开始', link: '/blog/elk' }
                    ]
                },
            ]
        }
    }
})