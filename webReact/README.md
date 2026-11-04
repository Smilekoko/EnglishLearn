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
├── public/                 # 静态资源（favicon；audio/ 下是 20 个元音发音 mp3）
└── src/
    ├── main.tsx            # 挂载 React 根节点 + HashRouter
    ├── App.tsx             # 布局骨架（页头导航 / 路由出口 / 页脚）
    ├── App.module.css
    ├── index.css           # 全局变量与基础样式（含深色模式）
    ├── data/
    │   └── vowels.ts       # 20 个元音的数据（音标、分类、音频文件名、发音要点、例词）
    └── pages/
        ├── Home.tsx        # 首页
        ├── Grammar.tsx     # 语法
        ├── Phonetics.tsx   # 音标（元音 / 辅音入口）
        ├── Vowels.tsx      # 元音：20 张卡片 + 播放按钮
        ├── NotFound.tsx    # 404
        └── Page.module.css # 各页面共用样式
```

## 页面路由

| 路径 | 页面 |
|------|------|
| `/#/` | 首页 |
| `/#/grammar` | 语法 |
| `/#/phonetics` | 音标 |
| `/#/phonetics/vowels` | 元音（20 个） |

## 约定

- **样式**：组件级样式一律用 `*.module.css`，全局只保留 `index.css` 里的变量和基础排版。
- **路由**：用 `HashRouter`（地址形如 `/#/grammar`），这样静态托管（GitHub Pages 等）刷新子页面不会 404；若以后改成服务端重写，再换成 `BrowserRouter`。
- **新增页面**：在 `src/pages/` 下建组件，再到 `App.tsx` 的 `<Routes>` 里注册，并在 `navItems` 中加导航项。
- **音频**：发音文件放 `public/audio/`，代码里用 `${import.meta.env.BASE_URL}audio/文件名` 拼路径，换部署子路径时不用改代码。播放共用一个 `<audio>`，同一时间只播一条，再次点击同一条即停止。
- **部署**：默认部署在站点根路径。若要放到子路径（例如 `https://smilekoko.github.io/EnglishLearn/webReact/`），在 `vite.config.ts` 里设置 `base: '/EnglishLearn/webReact/'`。

## 音频校验

发音文件可以用 DSH 的 `audio` MCP 插件（`~/.dsh/tools/audio-mcp/`）检查：

- `analyze_vowel` —— 时长、分段、基频、首尾 F1/F2 估计
- `compare_vowels` —— 按段与语料库做 MFCC + DTW 匹配，回答"这段听起来像哪个元音"
- `render_spectrogram` —— 输出 0–3.5 kHz 频谱图便于肉眼确认滑音

判读要点：单元音应当是**单段**连续发声；双元音应当是**一条**连续的音，中间不应有 >100 ms 的静音，F1/F2 按音标方向移动（闭口双元音 `/eɪ/ /aɪ/ /ɔɪ/` 的 F2 上升；央化双元音 `/ɪə/ /eə/ /ʊə/` 的 F2 下降；`/aʊ/ /əʊ/` 的 F2 也下降）。注意后元音（/ɔ/、/o/）的 F1 与 F2 常常并成一个宽峰，`analyze_vowel` 的 `start_peaks`/`end_peaks` 会因此把 F3 当成第二个峰——这时以频谱图为准。

还要看**起始**：如果片头出现 2–4 kHz 能量占比很高的短促爆发，说明清辅音（/k/、/t/、/h/）的除阻被裁进来了，听起来会像"咔 + 元音"。`trim_encode.py` 默认按**起音（voicing onset）**裁剪而不是按能量，会自动切掉清辅音起始。

> 2026-11 校验结论：双元音文件原本都是"两段式"——把 IPA 的两个成分分开读，中间夹 130ms 静音。
>
> - `vowel_ay.mp3`：原为 "e" + "ɪ" 两段（DTW 匹配 /e/ 9.1、/ɪ/ 5.7），已用 edge-tts（en-US-GuyNeural，-10% 语速）重生成为 0.48s 单段。
> - `vowel_ai.mp3`：原为两段（0.01–0.50s + 0.63–1.20s，第二段匹配 /ɪ/ 5.26），已重生成 0.41s 单段，F1 656→426、F2 1172→2242（+1070）。
> - `vowel_oy.mp3`：原为两段（第一段匹配 /ɔː/ 12.08、第二段 /ɪ/ 4.07），已用 edge-tts 读 "oy" 重生成 0.34s 单段。
> - `vowel_au.mp3`（/aʊ/）、`vowel_ou.mp3`（/əʊ/）、`vowel_ia.mp3`（/ɪə/）、`vowel_ea.mp3`（/eə/）、`vowel_ua.mp3`（/ʊə/）：原均为两段，已用 **en-GB-RyanNeural**（英式男声）按 cow / O / ear / air / tour 重新生成。
> - 二次修正：`/aʊ/` 的 "cow" 与 `/ʊə/` 的 "tour" 首版把清辅音除阻留在了片头（起始高频 46% / 50%），改用按起音裁剪后降到 19% / 13%，时长 0.36s / 0.29s；`/eə/` 同样处理（29% → 17%）。注意 TTS 会把 "ow" 读成 /oʊ/（与 "O" 的 DTW 只有 2.8），所以 /aʊ/ 必须用 "how"/"cow" 这类词取元音。
> - `/ʊə/` 三次修正：Ryan 读的 "tour" 已并入 /ɔː/（F1 402→422，几乎没有滑动），改用 **en-GB-ThomasNeural** 以 -40% 语速重读 "tour"，F1 391→512（/ʊ/→/ə/ 的开口度变化）。其余音色（Sonia / William / Ryan）的 "tour""sure" 都测过，F1 基本不动，只有 Thomas 保留了可听的央化滑动。
> - `/ʊə/` 四次修正：原版只有 0.31s，偏短。TTS 语速被钳制在 -50%，再慢也不会更长；改用 librosa 相位声码器做**保音高时间拉伸**（1.39×），时长 0.31s → 0.55s，F1 仍为 391→531，起音干净（起始高频 6%）。拉伸脚本思路：`librosa.effects.time_stretch(y, rate=0.72)`，再走 `trim_encode.encode_mp3`。
>
> 至此 8 个双元音全部是单段连续发音。注意音源混用：`/eɪ/ /aɪ/ /ɔɪ/` 用美式（Guy），`/əʊ/ /ɪə/ /eə/` 用英式 Ryan，`/aʊ/` 用英式 Ryan、`/ʊə/` 用英式 Thomas——因为 `/ɪə/ /eə/ /ʊə/` 是英式央化双元音，美式会读成带 r 的 /ɪr/ /er/ /ʊr/。另外 `/ʊə/` 在现代英音里正并入 `/ɔː/`，这是它最难取到干净滑音的原因。
