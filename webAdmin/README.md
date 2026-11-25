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

后台登录用的是**同一个 B 站扫码接口**（`POST /api/auth/bili/qr` + 轮询），没有独立账号密码：

1. 打开 `/#/login`，用 B 站 App 扫码
2. 登录成功后后端会校验该账号的 B 站 mid 是否在服务器的 `ADMIN_MIDS` 环境变量里
3. 不在白名单 → 页面提示「这个 B 站账号不在管理员白名单里」，需要把 mid 加进去并重启后端

会话由服务端下发 HttpOnly Cookie（`EL_SESSION`），前端不保存任何凭据；`RequireAuth` 通过 `GET /api/auth/me` 判断登录态与 `role === 'ADMIN'`。

> 本地要先跑 `server`（8080）。`vite.config.ts` 里已经配了 `/api` 代理，所以 admin 开发服务器（5174）与后端是同源，Cookie 能正常带上。

## 目录结构

```
webAdmin/
├── index.html
└── src/
    ├── main.tsx              # ConfigProvider（中文 + 主题色）+ AuthProvider + HashRouter
    ├── App.tsx               # 路由：/login、受保护的布局与子页面
    ├── index.css             # 全局基础样式
    ├── api/
    │   ├── client.ts         # fetch 封装，统一带 Cookie
    │   ├── auth.ts           # 扫码登录、当前用户、退出
    │   └── users.ts          # 用户列表与封禁/解封
    ├── auth/
    │   ├── context.ts        # AuthContext + useAuth
    │   └── AuthProvider.tsx  # 启动时请求 /api/auth/me
    ├── components/
    │   └── RequireAuth.tsx   # 未登录或非管理员跳转 /login
    ├── layouts/
    │   ├── AdminLayout.tsx   # 侧边栏 + 顶栏 + 内容区
    │   └── AdminLayout.module.css
    ├── mock/
    │   └── data.ts           # 概览页演示数据（还没接真实接口）
    └── pages/
        ├── Login.tsx         # 扫码登录
        ├── Dashboard.tsx     # 概览
        ├── GrammarAdmin.tsx  # 语法管理（表格）
        ├── VowelsAdmin.tsx   # 音标管理（表格）
        └── UsersAdmin.tsx    # 用户管理（搜索 / 分页 / 封禁）
```

## 路由

| 路径 | 页面 | 是否需要登录 |
|------|------|-------------|
| `/#/login` | 登录 | 否 |
| `/#/` | 概览 | 是 |
| `/#/grammar` | 语法管理 | 是 |
| `/#/vowels` | 音标管理 | 是 |
| `/#/users` | 用户管理 | 是 |

## 部署

生产环境通常挂在同一域名的 `/admin/` 下（后端 `/api` 反代到 Spring Boot）。构建时要指定 base，否则静态资源会去根路径找：

```bash
VITE_BASE=/admin/ npm run build
```

产物 `dist/` 交给 Nginx 的 `/admin/` location 即可，详见根目录的 `deploy/README.md`。

## 和后端的关系

后端（Spring Boot）尚未搭建。接入后需要替换三处：

1. `src/auth.ts` 的 `login()` → `POST /api/auth/login`
2. `src/mock/data.ts` → `GET /api/grammar`、`GET /api/vowels`
3. 表格的编辑/新增按钮从 `disabled` 改为调用对应的写接口

接口地址建议通过环境变量注入（`VITE_API_BASE`），开发时用 Vite 的 `server.proxy` 转发，避免跨域。
