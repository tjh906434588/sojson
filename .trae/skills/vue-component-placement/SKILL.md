---
name: "vue-component-placement"
description: "项目开发规范：TypeScript 全量使用 + src/types 统一类型定义 + src/utils 公共方法提取 + 路由集中定义（src/router 按一级菜单拆分模块）+ 页面布局（src/layout 默认布局）+ 组件三级存放（页面私有/一级共享/全局兜底）+ 一级/二级菜单创建（目录、路由、卡片、i18n）。Invoke when organizing components, adding menus/pages, defining types, extracting shared utils, or writing TS code under src."
---

# 项目开发规范（Project Conventions）

本项目为 Vue 3 项目，页面目录结构为：

```
src/views/<一级菜单>/<二级菜单>/index.vue
```

## 强制执行与确认机制（最高优先级）

本规范为项目**强制约定**：凡是涉及 `src` 下 Vue/TS 的代码新增与修改，一律按本规范执行；违反本规范均视为返工。本章节优先级高于其余所有章节。

### 1. 动手前先给计划（跨层 / 新增任务必须）

新增一级/二级菜单、新增页面、修改公共样式或公共资源等跨层任务，编码前必须先向用户列出执行计划：

- 将新建 / 修改哪些文件（列出路径）
- 遵循了本规范的哪些章节
- 涉及哪些公共资源（`src/assets/css/*.scss`、`src/utils`、`src/types`、`src/router`）
- 预计影响哪些现有页面

用户确认后再开始编码。

### 2. 必须暂停咨询用户的情形（不得擅自决定）

遇到以下任一情况，先停下提问与用户确认，再继续：

- 本规范未覆盖的新场景（无法判断文件 / 资源归属、是否新建目录、是否新增依赖）
- 与既有代码或既有规范冲突（如页面特殊样式与 `global.scss` 公共类冲突、组件放两级都说得通）
- 需要改动公共文件（`src/assets/css/*.scss`、`src/layout`、`src/router` 集中入口、`src/main.ts`）且可能影响其他页面
- 存在多种实现路径、选择会影响后续维护
- 需要新增第三方依赖、引入新图标 / 图片资源或新方案

### 3. 完成后自查清单（交付前逐项核对并回报）

交付前对照清单逐项自查，并把自查结果逐条回报给用户（满足打 ✓，未满足说明原因）：

- [ ] 样式：优先复用 `src/assets/css/global.scss` 公共类，页面内无重复定义
- [ ] 样式变量：被多处复用的样式值已提取到 `src/assets/css/variables.scss`，页面内无散落硬编码重复值
- [ ] 组件：优先 Element Plus（`el-*`），无原生 `<button>/<input>/<select>` 代替（合理例外除外）
- [ ] 类型：统一定义在 `src/types`，页面内无零散重复类型
- [ ] 工具：公共方法已提取到 `src/utils`，页面内无重复逻辑
- [ ] 路由：已在 `src/router/modules/<一级菜单>.ts` 注册，集中入口同步
- [ ] i18n：文案已登记到 `src/locales/zh.ts` 与 `en.ts`
- [ ] 文案：无「参考 / 参照 XXX」之类文字
- [ ] 全部使用 TypeScript，无 `.js` 源文件

## 文案规范（禁止「参考 XXX」）

项目中禁止出现「参考 / 参照 XXX」之类的文字（包括代码注释、文档）。这类文案是 AI 在开发时参考其他页面、项目后留下的过程性说明，项目成型后即为无效噪音。

- 代码注释只描述当前代码本身的作用与逻辑，不要写「参考某页面 / 某项目」的字样。
- 若想说明某处实现与另一处一致，直接描述该实现方式本身（如「内容区全高、卡片撑满」）。
- 后续 AI 开发如需参考，仅在对话中进行，不写入项目任何文件（代码、注释、文档）。

## TypeScript 规则

整个项目一律使用 TypeScript，禁止使用 JS 文件。

- 所有源代码文件使用 `.ts` 扩展名（`.ts` / `.tsx`），禁止新建 `.js` 源文件。
- 所有 `.vue` 文件的 `<script>` 块一律使用 `<script setup lang="ts">`。
- 业务逻辑、配置、路由、store、i18n、工具函数等一律使用 `.ts`（router、store、config、locales 均已迁移为 `.ts`，禁止回退为 `.js`）。
- 构建/工程文件（`vite.config.js`、`eslint` 配置等）同样使用 `.ts`。
- `scripts/` 下需要 Node 直接运行的构建脚本使用 `.ts`，并在 `package.json` 中通过 `tsx` 执行（如 `"build": "tsx scripts/generate-netlify-forms.ts && vite build"`）。
- `src` 与 `scripts` 目录禁止出现 `.js` 源文件。

## 类型定义规则（src/types）

所有类型统一在 `src/types` 目录集中定义，再暴露给其他文件使用。

目录结构：按业务/模块分类，使用 `.d.ts` 声明文件：

```
src/types/
├─ index.d.ts                # 统一出口：export * from ...
├─ tool.d.ts                 # 通用类型（ToolItem、Language 等）
├─ menu.d.ts                 # 导航菜单类型（NavMenuItem、NavMenuSubGroup、NavMenuGroup）
├─ config/
│  ├─ feedbackForm.d.ts      # FeedbackField
│  ├─ regionalDns.d.ts       # DnsServerRecord
│  └─ webColors.d.ts         # ColorGroup / ColorCategory
└─ env.d.ts                  # vite/client 与 *.vue 模块声明
```

- 每个类型文件用 `export interface` / `export type` 显式导出。
- `index.d.ts` 用 `export * from './xxx'` 聚合所有类型，作为唯一对外入口。
- 业务文件通过 `import type { Xxx } from '@/types'` 使用，禁止在组件、页面、业务模块内部散落定义共享类型。
- 新增类型流程：判断归属模块 → 在 `src/types` 对应文件定义 → 在 `index.d.ts` 汇总导出 → 业务文件 `import type` 使用。

## 公共方法规则（src/utils）

跨业务复用的通用方法统一放在 `src/utils` 目录，统一在 `index.ts` 中定义并导出，避免每个业务重复实现同一段逻辑。

目录结构（当前已有）：

```
src/utils/
└─ index.ts   # 公共方法统一入口：useIsMobile()、copyToClipboard()，后续新方法继续追加于此
```

- 通用方法判断标准：同一段逻辑被 2 个及以上业务重复使用，就应提取到 `src/utils` 统一封装（如 H5 断点检测、剪贴板复制）。
- 业务文件通过 `import { useIsMobile, copyToClipboard } from '@/utils'` 使用，禁止在页面/组件内重复书写同一段通用逻辑。
- 需要响应式 + 自动清理的复用逻辑封装成 composable 形式（如 `useIsMobile`，内部管理 resize 监听与 onUnmounted 清理）。
- 新增公共方法流程：确认被多处复用 → 在 `src/utils/index.ts` 追加并导出 → 业务文件 import 使用；仅单处使用的逻辑就地书写，不要过早抽象。

## 资源目录规则（src/assets / public）

`src/assets` 存放会被打包处理的静态资源（样式、图片、图标等），按资源类型分目录，代码中直接用 `@/assets/<类型>/<文件>` 路径引入：

```
src/assets/
└─ css/
   ├─ variables.scss # 统一样式变量：全站共享的 CSS 自定义属性集中定义（主题色/文字色/字号/布局尺寸等）
   ├─ index.scss    # 工程基础样式：*reset、body/html/#app、滚动条等（优先级最低，兜底）
   ├─ element.scss  # Element Plus 组件样式统一覆盖（仅全站统一需要调整的组件）
   └─ global.scss   # 工具页公共布局类：内容区全高 + 卡片撑满 + 输入框/表格内部滚动
```

- 新资源按类型放入对应子目录：图片 `img/`（内部可再按业务分子目录）、图标 `icon/`、主题 `themes/` 等
- 样式文件引入统一走 `@/assets/css/...`，不要分散在 `src/styles` 等目录

## 样式分层规则（assets/css 五类文件）

工程样式按职责分五层，优先级从低到高（main.ts 引入顺序：element 官方 css → variables.scss → index.scss → element.scss → global.scss；layout 样式由 layout/index.vue 引入）：

| 文件 | 职责 | 约定 |
| --- | --- | --- |
| `src/assets/css/variables.scss` | 统一样式变量：全站共享的 CSS 自定义属性（主题色、文字色、边框、字号、布局尺寸等） | 最先引入，所有样式/组件均可 `var()` 引用；见「统一样式变量规则」 |
| `src/assets/css/index.scss` | 工程基础兜底：`*{}` reset、`body`/`html`/`#app`、滚动条等 | 优先级最低，被后续样式覆盖 |
| `src/assets/css/element.scss` | Element Plus 组件样式统一覆盖 | 仅放「全站统一」需要调整的组件样式；只有单个业务页需要时，写在对应页面的 `<style>` 中，不写入此文件 |
| `src/assets/css/global.scss` | 工具页公共布局类（`.container`/`.tool-card` 等） | 见下方「工具页公共布局类」 |
| `src/layout/style/index.scss` | 布局壳样式（`.app-wrapper`/`.main-container`） | 只放布局，不放业务独有样式；html/body 等基础样式引用 index.scss，不重复定义 |

## 统一样式变量规则（src/assets/css/variables.scss）

被 2 个及以上业务菜单（或布局）共用的样式值——主题色、文字色、边框色、填充色、字号、布局尺寸、代码字体、按钮宽度等——一律提取为 CSS 自定义属性，统一定义在 `src/assets/css/variables.scss` 的 `:root` 中集中存放，业务代码通过 `var(--xxx)` 引用，**禁止在页面/组件内散落硬编码重复值**。

- 判断标准：同一值被 2 个及以上业务菜单（或布局）使用 → 提取；仅单个业务页使用 → 就地书写，不要过早抽象。
- `variables.scss` 由 `src/main.ts` 最先引入（在 index.scss / element.scss / global.scss 之前），全站样式与组件均可用。
- 命名分组：
  - `--layout-*`：布局尺寸（如 `--layout-max-width`、`--navbar-height`）
  - `--color-*`：主题色（如 `--color-primary` / `--color-success` / `--color-warning` / `--color-danger`）
  - `--text-*`：文字色（如 `--text-primary` / `--text-regular` / `--text-secondary`）
  - `--border-*` / `--fill-*`：边框色 / 填充色
  - `--font-size-*`：字号（如 `--font-size-xs` 至 `--font-size-2xl`）
  - `--font-code`：代码字体族
- 修改只需改 variables.scss 一处，全站生效。

## 样式规则（工具页公共布局类）

工具页「内容区全高 + 卡片撑满 + 输入框/表格内部滚动」的布局类统一定义在 `src/assets/css/global.scss`，页面直接使用标准类名，**禁止在页面内重复定义**：

| 类名 | 作用 |
| --- | --- |
| `.container` | 内容区全高容器（`height: 100%` flex 列；H5 下左右 15px 边距由全局媒体查询处理） |
| `.tool-card` | 卡片撑满剩余高度，内容区在卡片内部滚动（`.el-card__body` 已由全局处理） |
| `.textarea-input` / `.textarea-output` | 输入/输出框撑满剩余空间，按钮组固定在底部 |
| `.button-group` | 按钮组（Web 等宽网格、H5 一排三个由全局媒体查询处理） |
| `.table-wrap` | 表格容器撑满剩余空间，表格内部滚动 |
| `.copyable` | 可点击复制的列内容（含 `.copy-icon`） |
| `.hidden-file` | 隐藏的文件选择输入框 |

约定：

- 标准布局页面：模板直接用上述类名，`<style>` 中只写页面特有样式（如 `.tool-alert`、列样式、校验态等），不要重复定义这些布局类。
- 需要额外间距/字体等差异时，只写差异部分：如卡片内容区间距用 `.tool-card { :deep(.el-card__body) { gap: 20px } }`，代码字体用 `.textarea-input { :deep(.el-textarea__inner) { font-family: ... } }`。
- 固定高度（不撑满）的输入框必须显式覆盖全局默认的 `flex: 1`：写 `flex: none`（如 JsonColor 的输入框、EncryptDecrypt 的 MD5 输入框）。
- 落地页（一级菜单 `index.vue` 的 ToolCardGrid）使用组件内 `.grid-container` 居中容器，不使用 `.container`。
- 新增页面如需这些布局，直接复用全局类；只有复用类无法满足时，才在页面内写局部样式。

`public` 存放不参与打包压缩、会被 vite 原样拷贝到 `dist` 的静态文件与构建期脚本：

```
public/
├─ html/            # 静态 html（如 Netlify Forms 表单 __forms.html）
└─ scripts/         # 构建期 ts 脚本（tsx 直接运行、不被打包，如 generate-netlify-forms.ts）
```

- 构建期脚本放 `public/scripts/`，在 `package.json` 中通过 `tsx public/scripts/<脚本>.ts` 执行
- 构建脚本内引用 `src` 的类型/配置时使用相对路径（如 `../../src/types`）

## 路由定义规则（src/router 按一级菜单拆分）

所有路由集中在 `src/router` 文件夹下，按「一级菜单」拆分成多个路由模块文件。每个模块是一个一级菜单的「唯一事实来源」，同时导出：路径常量、路由配置、落地页卡片、NavBar 菜单。

目录结构：

```
src/router/
├─ index.ts        # 根路由挂载 src/layout/index.vue，根路径 / 重定向到第一个一级菜单，children 展开各模块 routes
└─ modules/        # 各一级菜单路由模块（无 home.ts，项目无独立首页）
   ├─ json.ts      # JSON 工具：jsonRoutes + jsonToolCards + jsonMenu
   ├─ encrypt.ts   # 加解密：encryptRoutes + encryptToolCards + encryptMenu
   ├─ compress.ts  # 压缩格式化
   ├─ document.ts  # 文档工具
   ├─ frontend.ts  # 前端工具
   ├─ convert.ts   # 转换工具
   └─ other.ts     # 其他工具
```

每个一级菜单模块（如 `modules/json.ts`）统一导出三部分：

```ts
import type { RouteRecordRaw } from 'vue-router'
import { Tools } from '@element-plus/icons-vue'
import type { ToolItem, NavMenuGroup } from '@/types'

// ① 路径常量（唯一事实来源，业务侧从这里引入）
export const ROUTE_JSON = '/json'
export const ROUTE_JSON_ONLINE_VIEW = '/json/json-online-view'

// ② 路由配置（一级落地页 + 二级工具页）
export const jsonRoutes: RouteRecordRaw[] = [
  { path: ROUTE_JSON, name: 'JsonTools', component: () => import('../../views/json/index.vue') },
  { path: ROUTE_JSON_ONLINE_VIEW, name: 'JsonOnlineView', component: () => import('../../views/json/JsonOnlineView/index.vue') }
]

// ③ 落地页卡片 + NavBar 菜单（类型 ToolItem / NavMenuGroup 定义在 src/types）
export const jsonToolCards: ToolItem[] = [
  { path: ROUTE_JSON_ONLINE_VIEW, icon: 'View', title: 'menu.jsonOnlineView', desc: 'tools.jsonOnlineView.description', color: '#909399' }
]
export const jsonMenu: NavMenuGroup = {
  key: 'json', title: 'menu.jsonTools', icon: Tools,
  link: ROUTE_JSON, prefix: ROUTE_JSON, exact: [ROUTE_JSON],
  items: jsonToolCards.map((c) => ({ path: c.path, label: c.title }))
}
```

- `src/router/index.ts` 根路由 `path: '/'` 挂载 `src/layout/index.vue`（默认布局）；项目无独立首页，`children` 中空路径 `{ path: '', redirect: <第一个一级菜单常量> }`（当前为 `ROUTE_JSON`）直接导航到第一个一级菜单，再用展开符 `...xxxRoutes` 汇总各一级菜单模块的子路由。
- 业务侧（NavBar、落地页、`router.push`、`<router-link :to>`、路由高亮比较等）**不自行维护菜单/工具列表**，直接 `import { xxxMenu } / { xxxToolCards } / { ROUTE_XXX } from '@/router/modules/<模块>'`，禁止在业务代码中硬编码路径字符串。
- 修改某个页面路径时，只改对应菜单模块中的路径常量一处即可，路由、卡片、菜单全自动生效。

## 页面布局规则（src/layout）

页面统一结构（默认布局 = NavBar 顶部导航 + 内容区 `router-view` + FooterBar 页脚，顶部导航工具箱、无侧边栏）：

目录结构：

```
src/layout/
├─ index.vue              # 默认布局入口（DefaultLayout），含 NavBar + main(router-view) + FooterBar
├─ components/            # 布局内组件
│  ├─ NavBar.vue          # 顶部导航（menus 从各路由模块引入，见 NavBar 菜单注册）
│  └─ FooterBar.vue       # 页脚
└─ style/
   └─ index.scss          # 全局布局样式（html/body、.app-wrapper 等）
```

- `src/router/index.ts` 根路由挂载 `src/layout/index.vue`，各一级菜单路由作为其 `children`；页面只需写业务内容，无需各自重复布局结构。
- 布局组件（`NavBar.vue`、`FooterBar.vue`）归属 `src/layout/components/`，不属于 `src/components/` 全局组件。
- `src/App.vue` 仅保留全局注入（`el-config-provider` + `router-view`），不再包含布局骨架代码。

## 一级 / 二级菜单创建规则

新增一个工具页（二级菜单）或一个工具分组（一级菜单）时，按以下步骤创建。

### 1. 目录结构

```
src/views/
├─ <一级菜单>/            # 一级菜单目录：小写单词命名，如 json、encrypt、compress
│  ├─ index.vue           # 一级菜单落地页（用 ToolCardGrid 展示子工具入口卡片）
│  ├─ <二级菜单>/         # 二级菜单目录：PascalCase 命名，如 JsonParse、JsonOnlineView
│  │  └─ index.vue        # 工具页面（固定命名 index.vue）
│  └─ components/         # （可选）一级共享组件，见下方组件规则二
└─ ...
```

- 一级菜单目录名：小写单词（如 `json`）
- 二级菜单目录名：PascalCase（如 `JsonOnlineView`）
- 二级菜单工具页面固定命名为 `index.vue`

### 2. 路由注册（src/router/modules/<一级菜单>.ts）

在对应一级菜单路由模块（如 `src/router/modules/json.ts`）中追加路由；新增一级菜单时模块不存在则新建，并在 `src/router/index.ts` 汇总数组中用 `...<菜单>Routes` 展开：

```ts
// src/router/modules/json.ts
export const ROUTE_JSON_ONLINE_VIEW = '/json/json-online-view'

export const jsonRoutes: RouteRecordRaw[] = [
  // 二级菜单
  { path: ROUTE_JSON_ONLINE_VIEW, name: 'JsonOnlineView', component: () => import('../../views/json/JsonOnlineView/index.vue') }
]
```

- `path`：引用本模块路径常量，一级为 `ROUTE_<一级菜单大写>`，二级为 `ROUTE_<一级菜单大写>_<二级菜单大写>`，值在本模块中唯一
- `name`：一级为 `<一级菜单 PascalCase>Tools`（如 `JsonTools`）；二级为 PascalCase（如 `JsonOnlineView`）
- `component`：一律使用懒加载 `() => import(...)`

### 3. 落地页卡片注册（一级菜单模块 <一级菜单>.ts）

卡片数据定义在对应菜单路由模块（如 `src/router/modules/json.ts`）的 `xxxToolCards: ToolItem[]` 中，每个二级菜单加一项；落地页 `index.vue` 直接引入该数组，不再本地维护列表：

```ts
// src/router/modules/json.ts
export const jsonToolCards: ToolItem[] = [
  { path: ROUTE_JSON_ONLINE_VIEW, icon: 'View', title: 'menu.jsonOnlineView', desc: 'tools.jsonOnlineView.description', color: '#909399' }
]

// src/views/json/index.vue
import { jsonToolCards } from '@/router/modules/json'
const tools = jsonToolCards
```

- `path`：引用本模块路径常量，不写死字符串
- `icon`：`@element-plus/icons-vue` 图标名
- `title`：i18n key `menu.<工具名>`
- `desc`：i18n key `tools.<工具名>.description`
- `color`：卡片主题色

### 4. NavBar 菜单注册（src/layout/components/NavBar.vue）

一级菜单在对应路由模块导出 `xxxMenu: NavMenuGroup`（含 icon 组件、link、prefix、items 或 modules）。`src/layout/components/NavBar.vue` 引入该菜单并加入 `menus` 数组（NavBar 不自行维护菜单列表）：

```ts
import { xxxMenu } from '@/router/modules/xxx'
// ...
const menus: NavMenuGroup[] = [jsonMenu, encryptMenu, xxxMenu /* ... */]
```

- 多个扁平二级菜单用 `items`（可直接 `xxxToolCards.map((c) => ({ path: c.path, label: c.title }))`）
- 需按模块分组展示二级菜单时用 `modules`
- 屏蔽某菜单用 `hidden: true`（保留但隐藏，不参与展示）

### 5. i18n 文案（src/locales/zh.ts 与 en.ts）

中英文两处都要同步添加：

- `menu.<工具名>`：菜单 / 卡片标题
- `tools.<工具名>.description`：卡片描述
- `tools.<工具名>.<其他文案>`：页面内所有文案（按钮、提示、占位符等）

---

## 组件选型规则（优先使用 Element Plus）

业务开发一律优先使用 Element Plus 组件（项目已全局注册 `element-plus` 与 `@element-plus/icons-vue`），不引入其他 UI 组件库。

- 表单、按钮、弹窗、表格、下拉、上传、图标、消息提示等场景，优先使用 `el-*` 组件（`el-button`、`el-input`、`el-table`、`el-select`、`el-dropdown`、`el-icon` 等），禁止用原生 `<button>` / `<input>` / `<select>` 等代替。
- 图标一律使用 `@element-plus/icons-vue` 的 `el-icon` + 图标组件（如 `<el-icon><CopyDocument /></el-icon>`），不引入第三方图标库，不使用 Unicode / 图片图标。
- 只有单个业务页需要的组件样式调整，写在对应页面的 `<style>` 中（不要写入 `src/assets/css/element.scss`）。
- 例外（Element 无法直接满足的高定制场景，允许使用原生元素并加注释说明原因）：
  - 隐藏文件选择框 `<input type="file" class="hidden-file">`：`el-upload` 是带 UI 的上传组件，不适配「按钮触发隐藏 input」场景（见 JsHtmlFormat / JsEncryptDecrypt / JsonExcel）。
  - 行内 JSON 树 key/value 编辑的 `<textarea>`：需自适应宽高、行内展示（见 JsonOnlineView/components/JsonViewNode.vue）。
  - 代码高亮编辑器的 `<textarea>`：需与 pre 高亮层叠加、同步滚动（见 JsonCompare/index.vue）。

## 组件存放规则

组件存放按「使用范围」分三级，从内到外依次判断：

## 规则一：二级菜单页面私有组件

组件只被**单个二级菜单页面**使用（被该页面的 `index.vue` 或其私有子组件引用，无其他页面引用）：

- 存放位置：`src/views/<一级菜单>/<二级菜单>/components/`
- 示例：`src/views/json/JsonOnlineView/components/`
  - `JsonViewTree.vue` 只被 `JsonOnlineView/index.vue` 使用 → 放入 `JsonOnlineView/components/`
  - `JsonViewNode.vue` 只被 `JsonViewTree.vue` 使用 → 放入 `JsonOnlineView/components/`

## 规则二：一级菜单共享组件

组件被**同一级菜单下的多个二级菜单页面**共同使用：

- 存放位置：`src/views/<一级菜单>/components/`
- 示例：`src/views/json/components/`（当多个 json 子页面共用某组件时）

## 规则三：全局兜底组件

其他情况（被多个一级菜单使用、跨菜单共享的通用组件）：

- 存放位置：`src/components/`，每个组件一个文件夹，文件夹名即组件名，组件内容固定为 `index.vue`
- 示例：`src/components/ToolCardGrid/index.vue`（通用工具卡片网格，多个落地页共用）
- 组件文件夹统一采用 PascalCase 命名（如 `ToolCardGrid`），内部固定一个 `index.vue`，后续该组件的私有子组件/资源放入同一文件夹
- 导入组件时写完整路径 `@/components/<组件名>/index.vue`（如 `import ToolCardGrid from '@/components/ToolCardGrid/index.vue'`）；目录形式导入 `.vue` 无法被 TS/Vite 解析，必须显式带 `index.vue`
- 注意：布局骨架组件（`NavBar.vue`、`FooterBar.vue`）归属 `src/layout/components/`，不放入 `src/components/`

## 执行要点

1. 新建或移动组件时，先判断「被谁使用」再决定放哪一级目录。
2. 移动组件后必须同步更新所有 import 路径（相对路径需指向新的 components 目录）。
3. 页面私有组件就近存放，不要放进 `src/components/`。
4. 若现有代码违反上述规则（如私有组件与 `index.vue` 平级，或共享组件散落在各页面内），应主动按本规则调整，保持项目结构一致。
