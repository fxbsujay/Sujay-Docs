import { defineConfig,MarkdownOptions  } from 'vitepress'


export default defineConfig({
    title: 'Sujay',
    titleTemplate: ':title - Sujay',
    description: 'Sujay Blog.',
    lang: 'en-US',
    markdown: {
        theme: 'github-dark',
        lineNumbers: false
    },
    cleanUrls: true,
    base: '/',
    ignoreDeadLinks: true,
    lastUpdated: true,
    head: [
        [ 'link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    themeConfig: {
        logo: '/favicon.ico',
        siteTitle: 'Fan Xuebin',
        outline: 3,
        editLink: {
            pattern: 'https://github.com/fxbsujay/Sujay-Docs/blob/main/docs/:path',
            text: '在 GitHub 上编辑此页面'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        outlineTitle: '在本页',
        lastUpdatedText: '最近更新时间',
        footer: {
            message: 'Released under the <a href="https://github.com/fxbsujay/Sujay-Docs/blob/main/LICENSE">MIT License</a>.',
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
                    text: 'Java',
                    collapsed: false,
                    items: [
                        { text: '快速建立一个自己的博客', link: '/blog/blog' },
                        { text: '快速开始', link: '/blog/mymap' }
                    ]
                }
            ]
        }
    }
})