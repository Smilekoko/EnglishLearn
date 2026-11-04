# webReact · EnglishLearn 前端

EnglishLearn 的网页版前端，React + TypeScript + Vite 构建。

## 技术栈

| 用途 | 选型 |
|------|------|
| 框架 | React 19 |
| 构建 / 开发服务器 | Vite 8 |
| 语言 | TypeScript |
| 路由 | react-router-dom（HashRouter） |
| 样式 | 纯 CSS + CSS Modules |
| 代码检查 | Oxlint |

## 开发

```bash
cd webReact
npm install        # 首次
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 类型检查 + 生产构建，输出到 dist/
npm run preview    # 预览构建结果
npm run lint       # Oxlint 检查
```

## 运行配置（WebStorm）

项目的 `.idea/runConfigurations/` 下预置了 5 个运行配置，直接在 WebStorm 右上角的下拉框里选：

| 配置 | 实际执行 | 说明 |
|------|----------|------|
| `dev` | `npm run dev` | Vite 开发服务器，http://localhost:5173 |
| `dev (debug)` | 先启动 `dev`，再以调试模式打开 http://localhost:5173 | 断点调试用 |
| `build` | `npm run build` | 类型检查 + 生产构建到 `dist/` |
| `preview` | `npm run preview` | 预览构建产物，http://localhost:4173 |
| `lint` | `npm run lint` | Oxlint 检查 |

这些配置里 Node 解释器写的是 `E:\node\node.exe`（本机 `node -v` 为 v20.19.0，满足 Vite 8 的 `^20.19.0 || >=22.12.0`）。换机器时改成自己的 Node 路径即可。

> `.idea/` 默认被 `.gitignore` 忽略，所以这些配置只存在于本地。如果希望随仓库共享，把 `.gitignore` 里的 `.idea` 改成 `.idea/*` 并加一行 `!.idea/runConfigurations/`。

## 目录结构

```
webReact/
├── index.html              # 入口 HTML
├── public/                 # 静态资源（favicon 等，原样拷贝进 dist）
└── src/
    ├── main.tsx            # 挂载 React 根节点 + HashRouter
    ├── App.tsx             # 布局骨架（页头导航 / 路由出口 / 页脚）
    ├── App.module.css
    ├── index.css           # 全局变量与基础样式（含深色模式）
    └── pages/
        ├── Home.tsx        # 首页
        ├── Grammar.tsx     # 语法
        ├── Phonetics.tsx   # 音标
        ├── NotFound.tsx    # 404
        └── Page.module.css # 各页面共用样式
```

## 约定

- **样式**：组件级样式一律用 `*.module.css`，全局只保留 `index.css` 里的变量和基础排版。
- **路由**：用 `HashRouter`（地址形如 `/#/grammar`），这样静态托管（GitHub Pages 等）刷新子页面不会 404；若以后改成服务端重写，再换成 `BrowserRouter`。
- **新增页面**：在 `src/pages/` 下建组件，再到 `App.tsx` 的 `<Routes>` 里注册，并在 `navItems` 中加导航项。
- **部署**：默认部署在站点根路径。若要放到子路径（例如 `https://smilekoko.github.io/EnglishLearn/webReact/`），在 `vite.config.ts` 里设置 `base: '/EnglishLearn/webReact/'`。
