# 部署器（Deployer）
部署器用来将静态文件部署的服务器，用来简化手动部署操作。

### 概述
name 对应 `deploy.type`，config 为　`code.config.json` 中 `deploy` 配置。

``` js
code.extend.deployer.register(name, function(config){

});
```

示例：
``` js
// code.config.json
{
    deploy: {
        type: 'git',
        repository: '',
        branch: 'master'
    }
}

// deployer
code.extend.deployer.register('git', function(config){

});
```