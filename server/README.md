# server · EnglishLearn 后台服务

`webReact` 与 `webAdmin` 共用的后端 API：Spring Boot 4.1 + Java 21 + MySQL 8。

## 技术栈

| 用途 | 选型 |
|------|------|
| 框架 | Spring Boot 4.1.2（Spring Framework 7） |
| 语言 | Java 21（LTS） |
| 构建 | Gradle 9.4.1（Wrapper，随仓库提供） |
| 数据库 | MySQL 8（库名 `englishlearn`，驱动 `com.mysql:mysql-connector-j`） |
| JSON | Jackson 3（Spring Boot 4 起的包名是 `tools.jackson.*`） |

> 依赖优先从阿里云镜像拉取（`settings.gradle.kts` 里配置），因为 Maven Central 在国内经常超时。

## 数据库

先建库（只需一次）：

```powershell
# PowerShell（不支持 < 重定向，用 source）
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "source F:/AndroidProject/EnglishLearn/server/db/init.sql"

# cmd / Git Bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < db/init.sql
```

连接信息通过环境变量覆盖，默认值见 `application.yml`：

| 变量 | 默认值 |
|------|--------|
| `DB_URL` | `jdbc:mysql://localhost:3306/englishlearn?...` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | `123456`（本机开发默认值，写死在 `application.yml`） |

> 密码目前直接放在 `application.yml` 的默认值里，方便本机点开就跑。**部署到任何共享环境前**，删掉这个默认值，改成只从环境变量 `DB_PASSWORD` 读取。

表结构由 Hibernate 的 `ddl-auto: update` 自动创建。

## 运行

需要 JDK 21。本机 `JAVA_HOME` 指向 Android Studio 的 JDK 25，直接跑会用到 25，建议显式指定：

```bash
cd server
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-21
.\gradlew.bat bootRun

# Git Bash / macOS / Linux
JAVA_HOME=/path/to/jdk-21 ./gradlew bootRun
```

启动后 <http://localhost:8080>。

启动时会把 `src/main/resources/seed/*.json` 灌进数据库（20 个元音，词法 13 个主题共 74 条 + 句法「句子成分与基本句型」7 条 +「定语从句」9 条 +「状语从句」10 条 = 100 条语法，3 个词库共 251 个词）。语法和词库都按 id 增量插入：库里没有的条目补进去，已有的不覆盖，所以新增主题不用清库，重启即生效；元音表仍是「有数据就跳过」。

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查，返回 `{"status":"ok"}` |
| GET | `/api/vowels` | 20 个元音，按 `sortOrder` 排序 |
| GET | `/api/grammar` | 全部语法条目（共 100 条：词法 12 个主题各 5 节 + 时态 14 节 + 句法 26 节） |
| GET | `/api/grammar?topic=articles` | 按主题过滤，主题见下表 |
| GET | `/api/grammar/{id}` | 单条语法，如 `/api/grammar/plural`，不存在返回 404 |
| GET | `/api/vocabulary/series` | 词库系列列表，含每个系列的词数 |
| GET | `/api/vocabulary/series/{id}` | 某系列的词条，按分类分组 |

`topic` 可选值（时态 14 节，句法 `sentence` 7 节、`relative-clauses` 9 节、`adverbial-clauses` 10 节，其余各 5 节）：

| topic | 主题 | topic | 主题 |
|-------|------|-------|------|
| `noun` | 名词 | `passive` | 被动语态 |
| `articles` | 冠词 | `nonfinite` | 非谓语动词 |
| `pronouns` | 代词 | `agreement` | 主谓一致 |
| `adjectives` | 形容词 | `prepositions` | 介词 |
| `adverbs` | 副词 | `conjunctions` | 连词 |
| `tenses` | 时态 | `numerals` | 数词 |
| `verbs` | 动词基础 | `sentence` | 句子成分与基本句型（句法） |
| | | `relative-clauses` | 定语从句（句法） |
| | | `adverbial-clauses` | 状语从句（句法） |

示例：

```json
GET /api/grammar?topic=articles
[{
  "id": "a-an",
  "topic": "articles",
  "title": "a 与 an 的选用",
  "level": "入门",
  "points": ["以辅音音素开头用 a：a book、a university…"],
  "examples": [
    { "en": "She is an honest girl.", "zh": "她是个诚实的女孩。", "note": "honest 的 h 不发音，用 an。" }
  ]
}]
```

新增一个语法主题时，只要在 `seed/grammar.json` 里加对应 `topic` 的条目，重启服务即可增量写入数据库，接口传 `?topic=xxx` 就能读到，不需要改后端代码。前端再加一条主题目录（`webReact/src/data/grammarTopics.ts`）和页面文案（`grammarTopicMeta.ts`）就能访问。

## 目录结构

```
server/
├── build.gradle.kts            # 依赖与工具链（Java 21）
├── settings.gradle.kts         # 阿里云镜像 + 项目名
├── gradle.properties           # 指定 JDK 21 安装路径
├── src/main/java/com/englishlearn/server/
│   ├── ServerApplication.java
│   ├── config/                 # CORS、健康检查、种子数据
│   ├── grammar/                # 语法实体 / 仓库 / 控制器 / DTO
│   ├── vocabulary/             # 词库系列与词条（实体 / 仓库 / 控制器 / DTO）
│   └── vowel/                  # 元音实体 / 仓库 / 控制器
├── src/main/resources/
│   ├── application.yml         # 端口、数据源、JPA
│   └── seed/                   # 首次启动灌入的 JSON 数据
└── db/init.sql                 # 建库脚本（只需执行一次）
```

## 跨域

`config/CorsConfig` 放行了三个来源：

- `http://localhost:5173`（webReact 开发）
- `http://localhost:5174`（webAdmin 开发）
- `https://smilekoko.github.io`（线上静态站）

上线换域名后记得收窄这个白名单。

## 还没做

- 写接口（新增 / 编辑 / 删除）与参数校验
- 登录鉴权（Spring Security + 会话或 JWT）
- OpenAPI 文档（springdoc）
- 生产打包（Docker）与数据库迁移（Flyway）

## 踩过的坑

1. **Jackson 3**：Spring Boot 4 用 `tools.jackson.databind.ObjectMapper`，不是 `com.fasterxml.jackson`；注解包名仍是 `com.fasterxml.jackson.annotation`。
2. **MySQL 驱动**：`com.mysql:mysql-connector-j`，版本由 Spring Boot BOM 管理；连接串要带 `serverTimezone`，否则时区会报警。
3. **Gradle 工具链**：`gradle.properties` 里固定了 JDK 21 的路径，避免误用 JAVA_HOME 里的 JDK 25。
4. **给已有表加非空字段**：`ddl-auto: update` 只会加列，不会给旧数据回填。给 `grammar_sections` 加 `topic` 时，旧库里 5 行没有 topic，启动会失败——本地直接 `DROP DATABASE` 重建，让 seeder 重新灌数据。
5. **增量种子只补不更新**：`seedGrammar` 按 id 判重，`grammar_sections` 里已有的条目不会因为 JSON 改了而更新。改已有条目的文案要手动 `UPDATE`（或先删该行再重启），新增条目则直接重启即可。
