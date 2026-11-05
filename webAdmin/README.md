# webAdmin · EnglishLearn 管理后台

`webReact` 的管理端 SPA：React 19 + TypeScript + Vite 8 + **Ant Design 6**。

## 开发

```bash
cd webAdmin
npm install        # 首次
npm run dev        # 本地开发，默认 http://localhost:5174
npm run build      # 类型检查 + 生产构建，产物在 dist/
npm run preview    # 预览构建结果
npm run lint       # Oxlint
```

## 运行配置（WebStorm）

`.idea/runConfigurations/` 下预置了 5 个配置，在 WebStorm 右上角下拉框直接选：

| 配置 | 实际执行 | 说明 |
|------|----------|------|
| `dev` | `npm run dev` | 开发服务器，http://localhost:5174（与 webReact 的 5173 错开） |
| `dev (debug)` | 先启动 `dev`，再以调试模式打开 http://localhost:5174 | 断点调试 |
| `build` | `npm run build` | 类型检查 + 生产构建 |
| `preview` | `npm run preview` | 预览 dist，默认 4173（被占用会自动换端口） |
| `lint` | `npm run lint` | Oxlint |

Node 解释器固定为 `E:\node\node.exe`，换机器时改这些 XML 里的路径即可。`.idea/` 被 `.gitignore` 忽略，这些配置只存在于本地。

## 登录

当前是**前端演示登录**，账号写死在 `src/auth.ts`：

```
用户名 admin
密码   123456
```

会话存在 `localStorage`（键名 `englishlearn.admin.session`）。接入后端后改为调用登录接口、由服务端下发 HttpOnly Cookie，前端不再保存任何凭据，登录页的“演示账号”提示也要一并删掉。

## 目录结构

```
webAdmin/
├── index.html
└── src/
    ├── main.tsx              # ConfigProvider（中文 + 主题色）+ HashRouter
    ├── App.tsx               # 路由：/login、受保护的布局与子页面
    ├── auth.ts               # 演示登录、会话读写
    ├── index.css             # 全局基础样式
    ├── components/
    │   └── RequireAuth.tsx   # 未登录跳转 /login
    ├── layouts/
    │   ├── AdminLayout.tsx   # 侧边栏 + 顶栏 + 内容区
    │   └── AdminLayout.module.css
    ├── mock/
    │   └── data.ts           # 语法 5 条、元音 20 条演示数据
    └── pages/
        ├── Login.tsx         # 登录页
        ├── Dashboard.tsx     # 概览
        ├── GrammarAdmin.tsx  # 语法管理（表格）
        └── VowelsAdmin.tsx   # 音标管理（表格）
```

## 路由

| 路径 | 页面 | 是否需要登录 |
|------|------|-------------|
| `/#/login` | 登录 | 否 |
| `/#/` | 概览 | 是 |
| `/#/grammar` | 语法管理 | 是 |
| `/#/vowels` | 音标管理 | 是 |

## 和后端的关系

后端（Spring Boot）尚未搭建。接入后需要替换三处：

1. `src/auth.ts` 的 `login()` → `POST /api/auth/login`
2. `src/mock/data.ts` → `GET /api/grammar`、`GET /api/vowels`
3. 表格的编辑/新增按钮从 `disabled` 改为调用对应的写接口

接口地址建议通过环境变量注入（`VITE_API_BASE`），开发时用 Vite 的 `server.proxy` 转发，避免跨域。
