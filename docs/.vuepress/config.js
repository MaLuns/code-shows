module.exports = {
    title: 'CodeShows',
    description: 'Code Shows',
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    themeConfig: {
        repo: 'maluns/code-shows',
        docsDir: 'docs',
        editLinks: false,
        nav: [
            { text: '指南', link: '/guide/' },
        ],
        lastUpdated: 'Last Updated',
        sidebar: {
            '/guide/': [
                {
                    title: '指南',
                    collapsable: false,
                    children: [
                        '',
                        'setup',
                        'directory_structure',
                        'basic_config'
                    ]
                },
                {
                    title: '扩展',
                    collapsable: false,
                    children: [
                        'plugin/',
                        'plugin/console',
                        'plugin/loader',
                        'plugin/converter',
                        'plugin/generator',
                        'plugin/renderer',
                        'plugin/middlewarer',
                        'plugin/deployer',
                        'plugin/helper',
                    ]
                },
            ],
        },
        nextLinks: true,
        prevLinks: true,
    },
    markdown: {
        lineNumbers: false
    }
}