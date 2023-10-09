import { defineConfig  } from 'vitepress'


export default defineConfig({
    title: 'Sujay',
    titleTemplate: ':title - Sujay',
    description: 'Sujay Blog.',
    lang: 'en-US',
    markdown: {
        theme: 'slack-ochin',
        lineNumbers: false
    },
    cleanUrls: false,
    ignoreDeadLinks: true,
    lastUpdated: true,
    head: [
        [ 'link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    themeConfig: {
        logo: '/favicon.ico',
        siteTitle: 'Fan Xuebin',
        outline: {
            level: 'deep',
            label: '大纲'
        },
        lastUpdated: {
            text: '最近更新时间'
        },
        editLink: {
            pattern: 'https://github.com/fxbsujay/Sujay-Docs/blob/main/docs/:path',
            text: '在 GitHub 上编辑此页面'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        returnToTopLabel: '返回',
        sidebarMenuLabel: '目录',
        footer: {
            message: 'Released under the <a href="https://github.com/fxbsujay/Sujay-Docs/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2020-present <a href="https://github.com/fxbsujay">Fan XueBin</a> <a href="https://beian.miit.gov.cn/">鲁ICP备2022006050号-1</a>'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/fxbsujay' }
        ],
        nav: [
            { text: '博客', link: '/blog/jdk_support' ,activeMatch:  '/blog/' },
            { text: 'UI组件库', link: '/components/button' ,activeMatch:  '/components/' },
        ],
        sidebar: {
            '/blog': [
                {
                    text: '后端知识库',
                    collapsed: false,
                    items: [
                        { text: 'JAVA JDK17 新特性', link: '/blog/jdk_support' },
                        { text: 'Redis', link: '/blog/redis' },
                        { text: 'Docker', link: '/blog/docker' },
                        { text: 'MySql', link: '/blog/mysql' },
                        { text: 'MySql 索引', link: '/blog/mysql_index' },
                        { text: 'Java JUC', link: '/blog/juc'},
                        { text: '消息队列', link: '/blog/mq' },
                        { text: 'ELK 学习文档', link: '/blog/elk' },
                        { text: 'Netty 源码分析', link: '/blog/netty' },
                        { text: '雪花算法', link: '/blog/snow-flake' },
                        { text: '实现一个简易Map', link: '/blog/mymap' },
                        { text: 'Seata 分布式事务', link: '/blog/shiwu' }
                    ]
                },
                {
                    text: '前端知识库',
                    collapsed: false,
                    items: [
                        { text: 'css', link: '/blog/css' },
                        { text: 'Vue3 快速上手', link: '/blog/vue' },
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
            ],
            '/components': [
                /*{
                    text: '组件总览',
                    link: '/components/overview'
                },*/
                {
                    text: '基础组件',
                    collapsed: false,
                    items: [
                        { text: '按钮', link: '/components/button' }
                    ]
                }
            ]
        }
    }
})