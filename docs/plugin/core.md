# 核心（Core）

`BaseCore` 用来处理文件的基础类。在 Code-Shows 中实现两个 `BaseCore`，分别是 `source` 和 `theme`，前者用于处理 `source` 文件夹，而后者用于处理主题文件夹。

### 载入文件

`BaseCore` 提供了两种方法来载入文件：`build`, `watch`，前者用于载入文件夹内的所有文件；而后者除了执行 `build` 以外，还会继续监视文件变动。

### 加载器
加载器 (loader) 是用来加载文件的，`BaseCore` 在处理时会把目前处理的文件内容（File）传给加载器，您可以通过此参数获得该文件的数据，然后可以针对不同文件做不同处理。更多可以参考 [Loader](/plugin/loader)。

`File` 中提供了一些方法，让您无须手动处理文件 `I/O`。
| 方法 | 描述 |
| ----------- | ----------- |
| read | 读取文件 |
| readSync | 同步读取文件 |
| stat | 读取文件状态 |
| statSync | 同步读取文件状态 |
| render | 渲染文件 |
| renderSync | 同步渲染文件 |
