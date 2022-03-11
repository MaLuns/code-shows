const dayjs = require('dayjs')

module.exports = {
    title: 'Code-Shows',
    description: 'Code Shows',
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    themeConfig: {
        repo: 'maluns/code-shows',
        docsDir: 'docs',
        lastUpdated: '最后更新',
        displayAllHeaders: true,
        editLinks: false,
        nav: [
            { text: '指南', link: '/guide/' },
            { text: '主题', link: '/theme/' },
            { text: '扩展', link: '/plugin/' },
        ],
        sidebar: {
            '/guide/': [
                {
                    title: '指南',
                    collapsable: false,
                    children: [
                        '',
                        'setup',
                        'config',
                        'directory',
                    ]
                },
            ],
            '/theme/': [
                {
                    title: '主题',
                    collapsable: false,
                    children: [
                        '',
                        'layout',
                        'variable',
                        'helper',
                    ]
                },
            ],
            '/plugin/': [
                {
                    title: '扩展',
                    collapsable: false,
                    children: [
                        '',
                        'console',
                        'loader',
                        'converter',
                        'generator',
                        'renderer',
                        'middlewarer',
                        'deployer',
                        'helper',
                    ]
                },
            ]
        },
        nextLinks: true,
        prevLinks: true,
    },
    markdown: {
        lineNumbers: false
    },
    plugins: [
        [
            '@vuepress/last-updated',
            {
                transformer: (timestamp, lang) => {
                    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
                }
            }
        ]
    ]
}