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
            ],
        },
        nextLinks: true,
        prevLinks: true,
    },
    markdown: {
        lineNumbers: false
    }
}