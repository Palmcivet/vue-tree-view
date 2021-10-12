# UniText Tree View [WIP]

- [UniText Tree View [WIP]](#unitext-tree-view-wip)
    - [Roadmap](#roadmap)
    - [Tree View](#tree-view)
    - [List View](#list-view)
    - [Scrollbar](#scrollbar)
    - [EventBus](#eventbus)

[UniText](https://github.com/palmcivet/UniText.git 'UniText - GitHub') 的衍生项目。

实现类似 [Visual Studio Code](https://github.com/microsoft/vscode.git) 的文件树。

- 零依赖
- 使用 TypeScript 开发
- 衍生子组件可按需使用

## Roadmap

- [x] 文件夹及文件缩进以区分层次
- [ ] 异步加载文件
- [ ] 事件机制
    - [ ] 点击
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
- [ ] 排序
    - [ ] 时间顺序
    - [ ] 时间倒序
    - [ ] 字母顺序
    - [ ] 字母倒序
    - [ ] 自定义顺序
- [ ] 指示线
    - [x] 根据缩进层级显示指示线
    - [ ] 默认只展示最低一级的指示线，鼠标移入时展示所有层级
- [ ] 图标
    - [ ] 基于文件夹名称
    - [ ] 基于文件扩展名
    - [ ] 自定义

## Tree View

## List View

## Scrollbar

## EventBus

参考 [mitt](https://github.com/developit/mitt "mitt - GitHub")，本项目将其改写成 TS 的形式
