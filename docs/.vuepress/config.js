module.exports = {
    title: 'Code',
    description: 'Code Shows',
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    themeConfig: {
        logo: '/logo.png',
        repo: 'maluns/code-shows',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '在 Github 上帮助我们编辑此页',
        nav: [
            { text: '指南', link: '/' },
            { text: '配置', link: '/develop/layout' },
        ],
        lastUpdated: 'Last Updated',
        sidebar: [
            {
                title: '开始',
                collapsable: false,
                children: [
                    '/start/use', '/start/faq'
                ]
            },
            {
                title: '开发',
                collapsable: false,
                children: [
                    '/develop/layout', '/develop/router', '/develop/page', '/develop/theme', '/develop/service', '/develop/mock'
                ]
            },
            {
                title: '进阶',
                collapsable: false,
                children: [
                    '/advance/i18n', '/advance/async', '/advance/authority', '/advance/login', '/advance/guard', '/advance/interceptors',
                    '/advance/api'
                ]
            },
            {
                title: '其它',
                collapsable: false,
                children: [
                    '/other/upgrade', '/other/community'
                ]
            }
        ],
        nextLinks: true,
        prevLinks: true,
    },
    markdown: {
        lineNumbers: true
    }
}