# UniText Tree View [WIP]

- [UniText Tree View [WIP]](#unitext-tree-view-wip)
    - [Roadmap](#roadmap)
    - [使用](#使用)
        - [Tree View](#tree-view)
        - [List View](#list-view)
        - [Scrollbar](#scrollbar)
        - [EventBus](#eventbus)
    - [开发](#开发)

本项目是 [UniText](https://github.com/palmcivet/UniText.git 'UniText - GitHub') 的衍生项目，旨在实现类似 [Visual Studio Code](https://github.com/microsoft/vscode.git 'VSCode - GitHub') 的文件树。

- 零依赖
- 使用 TypeScript 开发
- 衍生子组件可按需使用

## Roadmap

- [x] 文件夹及文件缩进以区分层次
- [ ] 异步加载文件
- [ ] 事件机制
    - [x] 点击
    - [ ] 右击
    - [ ] 双击
- [ ] 拖拽
    - [ ] 文件移动
    - [ ] 文件复制
    - [ ] 文件夹移动
    - [ ] 文件夹复制
    - [ ] 拖拽到文件夹
- [x] 折叠
    - [x] 收起第一层
    - [x] 递归收起全部
- [ ] 重命名
- [ ] 按路径打开
- [ ] 排序
    - [ ] 时间顺序
    - [ ] 时间倒序
    - [ ] 字母顺序
    - [ ] 字母倒序
    - [ ] 自定义
- [ ] 指示线
    - [x] 根据缩进层级显示指示线
    - [ ] 默认只展示最低一级的指示线，鼠标移入时展示所有层级
- [ ] 图标
    - [ ] 基于文件夹名称
    - [ ] 基于文件扩展名
    - [ ] 自定义

## 使用

```bash
$ yarn add @palmcivet/unitext-tree-view # yarn
$ npm i @palmcivet/unitext-tree-view    # npm
```

### Tree View

### List View

实现了一个虚拟列表，提供如下方法：

- `insertData(data, index)`：增量添加数据，适合懒加载
- `deleteData(index, count)`：删除数据，返回被删除内容
- `updateData(data)`：全量更新数据，但只渲染视口内数据，成本较低
- `doResize()`：手动更新容器尺寸

### Scrollbar

### EventBus

参考 [mitt](https://github.com/developit/mitt "mitt - GitHub")，本项目将其改写成 TS 的形式

## 开发

```bash
$ yarn && yarn dev      # yarn
$ npm i && npm run dev  # npm
```
