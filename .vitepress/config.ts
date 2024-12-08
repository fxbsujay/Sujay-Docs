import { defineConfig  } from 'vitepress'


export default defineConfig({
    title: 'Sujay',
    titleTemplate: ':title - Sujay',
    description: 'Sujay Blog.',
    lang: 'en-US',
    cleanUrls: false,
    ignoreDeadLinks: true,
    lastUpdated: true,
    head: [[ 'link', { rel: 'icon', href: '/favicon.ico'}]],
    themeConfig: {
        logo: '/favicon.ico',
        siteTitle: 'Fan Xuebin',
        outline: {
            level: 'deep',
            label: '大纲'
        },
        lastUpdated: {
            text: '更新时间',
            formatOptions: {
                dateStyle: 'short',
            }
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
        search: {
            provider: 'local'
        },
        sidebar: {
            '/blog': [
                {
                    text: 'java',
                    collapsed: false,
                    items: [
                        { text: 'JDK 新特性', link: '/blog/jdk_support' },
                        { text: '位运算', link: '/blog/bit_operation' },
                        { text: 'JUC', link: '/blog/juc'},
                        { text: '网络编程', link: '/blog/nio'},
                        { text: 'Netty', link: '/blog/netty' },
                        { text: '雪花算法', link: '/blog/snow-flake' },
                    ]
                },
                {
                    text: '中间件',
                    collapsed: true,
                    items: [
                        { text: 'Redis', link: '/blog/redis' },
                        { text: 'MySql', link: '/blog/mysql' },
                        { text: 'MySql 索引', link: '/blog/mysql_index' },
                        { text: '消息队列', link: '/blog/mq' },
                        { text: 'ELK', link: '/blog/elk' },
                        { text: '分布式事务', link: '/blog/shiwu' },
                        { text: 'Gateway', link: '/blog/gateway' }
                    ]
                },
                {
                    text: '前端知识库',
                    collapsed: true,
                    items: [
                        { text: 'css选择器', link: '/blog/css' },
                        { text: 'Vue3 快速上手', link: '/blog/vue' },
                        { text: '事件循环', link: '/blog/eventLoop' },
                        { text: '属性描述符', link: '/blog/js-property' },
                    ]
                },
                {
                    text: '程序员必备',
                    collapsed: true,
                    items: [
                        { text: 'Linux', link: '/blog/linux' },
                        { text: 'Docker', link: '/blog/docker' },
                        { text: '正则表达式', link: '/blog/regex' },
                        { text: 'Ex', link: '/blog/text' }
                    ]
                }
            ],
            '/components': [
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