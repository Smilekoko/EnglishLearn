# AGENTS.md · EnglishLearn

给编码智能体的项目规则。**改完代码不需要验证运行时表现**，按下面约定交付即可。

## 一、不启动服务、不做运行时验证（重要）

- **不要为验证改代码而启动任何服务**：不跑 `gradlew bootRun`、`npm run dev`、`npm run preview`，也不为了验证去 `vite build`、打开浏览器点页面或截图核对。
- **不要在后台留进程占端口**：8080（Spring Boot）和 5173（Vite）是用户自己起服务用的。之前留在后台的实例会挡住用户启动，报 `Port 8080 was already in use`。
- **不要跑数据库/接口/页面级的验证**：不重启后端灌数据、不 `curl` 接口、不用浏览器验证渲染、不为改代码跑测试套件。
- **允许的轻量检查**：`tsc -b`、`oxlint` 这类纯静态、无副作用的检查可以跑，用来兜住类型和语法错误。
- **交付方式**：说明改了哪些文件、预期行为是什么、以及用户需要自己执行的命令（重启后端、刷新页面等），由用户验证。需要重启后端或清库才能生效的改动（例如 seed 数据变更），直接给出命令，不要代跑。

## 二、数据规则

- 网站内容数据全部来自 MySQL，经后端接口读出；**前端不保存内容数据**。语法目录（大类 / 主题 / 节数）、语法条目、元音、词库都在数据库里，前端只保留页面结构和界面文案。
- 增改内容是改 `server/src/main/resources/seed/*.json`，由 `config/DataSeeder` 在启动时写入：
  - 语法目录、元音按 id / symbol **upsert**（改文案重启即覆盖）；
  - 语法条目、词库按 id **增量插入**（已有的不覆盖，改已存在条目要手动 `UPDATE` 或删行后重启）。
- 新增一个语法主题：`seed/grammar.json` 加 `topic` 条目 + `seed/grammar-topics.json` 加一条目录（标题、卡片摘要、导语、排序），前端不需要改动。

## 三、代码约定

- `webReact/`：React + TypeScript + Vite + CSS Modules。组件级样式只用 `*.module.css`；每个读接口的页面都要处理「加载中 / 失败重试 / 空数据」三态。
- `server/`：Spring Boot 4 + Java 21（Jackson 3，`tools.jackson.*`）。实体与对外 JSON 用 DTO 解耦；表字段名避开 MySQL 保留字（如 `lead`、`rank`、`system`）。
- 注释、文案用中文，和现有文件保持一致；接口路径沿用 `/api/grammar`、`/api/grammar/topics`、`/api/vowels`、`/api/vocabulary/*`。

## 四、本机环境

- `JAVA_HOME` = `C:\Program Files\Java\jdk-21`（21.0.8），`server/gradle.properties` 也固定了 `org.gradle.java.installations.paths`。
- MySQL 8 本地库名 `englishlearn`，连接信息在 `server/src/main/resources/application.yml`。
