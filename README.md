# EnglishLearn 英语学习项目

> 🌐 网页版入口：[https://smilekoko.github.io/EnglishLearn/](https://smilekoko.github.io/EnglishLearn/)

## 📁 项目结构

- `android/` — Android 工程（Gradle 根目录，应用代码在 `android/app/`）
  - `android/app/` — Android 应用代码
  - `android/gradle/` — 版本目录与 Gradle Wrapper 配置
  - `android/build.gradle.kts`、`android/settings.gradle.kts` — 构建脚本
- `webReact/` — 前端站点（React + TypeScript + Vite）
- `webAdmin/` — `webReact` 的管理端 SPA（React + Ant Design，登录与数据暂为前端演示）
- `grammar/` — 英语语法学习资料
- `phonetics/` — 英语语音学习资料
- `index.html` — 网页版入口页（GitHub Pages）

## 🔨 Android 构建

Android 工程已独立到 `android/` 目录，用 Android Studio 打开该目录，或在命令行执行：

```bash
cd android
./gradlew assembleDebug        # Windows: gradlew.bat assembleDebug
```

## 🖥️ 前端站点（React）

`webReact/` 是英语学习站点的 React 前端，技术栈为 Vite + React + TypeScript，样式用 CSS Modules：

```bash
cd webReact
npm install
npm run dev      # 本地开发，默认 http://localhost:5173
npm run build    # 生产构建，产物在 webReact/dist
```

路由、目录约定和部署说明见 [webReact/README.md](webReact/README.md)。

## 📚 语法资料

### 词法篇

| 主题 | 简介 |
|------|------|
| [**名词（Noun）**](grammar/noun.md) | 名词的定义与分类、单复数、所有格、可数与不可数等 |
| [**形容词（Adjective）**](grammar/adjective.md) | 形容词的分类、功能、比较级与最高级等 |
| [**副词（Adverb）**](grammar/adverb.md) | 副词的分类、位置、比较级与常用搭配等 |

### 快速入口

- [英语名词语法大全](grammar/noun.md)
- [英语形容词语法大全](grammar/adjective.md)
- [英语副词语法大全](grammar/adverb.md)
