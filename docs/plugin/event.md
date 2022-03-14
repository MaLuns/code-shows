# 事件（Event）
Code-Shows 继承了 [EventEmitter](https://nodejs.org/dist/latest/docs/api/events.html)，您可以用 on 方法监听 Code-Shows 所发布的事件，也可以使用 emit 方法对 Code-Shows 发布事件，更详细的说明请参阅 Node.js 的 API。


### reader
在初始化完成后触发。

### loadBefore
在加载文件前触发。

### loadAfter
在加载文件后触发。

### generateBefore
在静态文件生成前触发。

### generateAfter
在静态文件生成后触发。