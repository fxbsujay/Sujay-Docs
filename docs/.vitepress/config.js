import { defineConfig,MarkdownOptions  } from 'vitepress'


export default defineConfig({
    title: 'Sujay',
    titleTemplate: ':title - Sujay',
    description: 'Sujay Blog.',
    lang: 'en-US',
    markdown: {
        theme: 'dark-plus',
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
        outline: 'deep',
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
            { text: '博客', link: '/blog/hexo' },
        ],
        sidebar: {
            '/blog': [
                {
                    text: 'Java',
                    collapsed: false,
                    items: [
                        { text: 'JDK17 新特性', link: '/blog/jdk_support' },
                        { text: 'MySql 索引', link: '/blog/mysql_index' },
                        { text: 'Netty 源码分析', link: '/blog/netty' },
                        { text: 'ELK', link: '/blog/elk' },
                    ]
                },
                {
                    text: '生活小工具',
                    collapsed: false,
                    items: [
                        { text: '使用 Hexo 搭建一个博客', link: '/blog/hexo' },
                        { text: '示例', link: '/blog/text' }
                    ]
                }
            ]
        }
    }
})