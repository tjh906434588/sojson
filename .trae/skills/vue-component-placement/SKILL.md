---
name: "vue-component-placement"
description: "项目开发规范：TypeScript 全量使用 + src/types 统一类型定义 + 路由集中定义（src/router 按一级菜单拆分模块）+ 组件三级存放（页面私有/一级共享/全局兜底）+ 一级/二级菜单创建（目录、路由、卡片、i18n）。Invoke when organizing components, adding menus/pages, defining types, or writing TS code under src."
---

# 项目开发规范（Project Conventions）

本项目为 Vue 3 项目，页面目录结构为：

```
src/views/<一级菜单>/<二级菜单>/index.vue
```

## TypeScript 规则

整个项目一律使用 TypeScript，禁止使用 JS 文件。

- 所有源代码文件使用 `.ts` 扩展名（`.ts` / `.tsx`），禁止新建 `.js` 源文件。
- 所有 `.vue` 文件的 `<script>` 块一律使用 `<script setup lang="ts">`。
- 业务逻辑、配置、路由、store、i18n、工具函数等一律使用 `.ts`（router、store、config、locales 均已迁移为 `.ts`，禁止回退为 `.js`）。
- 构建/工程文件（`vite.config.js`、`eslint` 配置等）同样使用 `.ts`。
- `scripts/` 下需要 Node 直接运行的构建脚本使用 `.ts`，并在 `package.json` 中通过 `tsx` 执行（如 `"build": "tsx scripts/generate-netlify-forms.ts && vite build"`）。
- `src` 与 `scripts` 目录禁止出现 `.js` 源文件。

## 类型定义规则（src/types）

所有类型统一在 `src/types` 目录集中定义，再暴露给其他文件使用（参考 xsjktzjc 项目的 types 组织方式）。

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

## 路由定义规则（src/router 按一级菜单拆分）

所有路由集中在 `src/router` 文件夹下，按「一级菜单」拆分成多个路由模块文件（参考 xsjktzjc 项目的 router 组织方式）。每个模块是一个一级菜单的「唯一事实来源」，同时导出：路径常量、路由配置、落地页卡片、NavBar 菜单。

目录结构：

```
src/router/
├─ index.ts        # 汇总各模块 routes 创建路由实例
└─ modules/        # 各一级菜单路由模块
   ├─ home.ts      # 首页：ROUTE_HOME + homeRoutes
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
import { ROUTE_HOME } from './home'

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
  link: ROUTE_JSON, prefix: ROUTE_JSON, exact: [ROUTE_HOME, ROUTE_JSON],
  items: jsonToolCards.map((c) => ({ path: c.path, label: c.title }))
}
```

- `src/router/index.ts` 用展开符汇总各模块 `xxxRoutes` 创建路由实例。
- 业务侧（NavBar、落地页、`router.push`、`<router-link :to>`、路由高亮比较等）**不自行维护菜单/工具列表**，直接 `import { xxxMenu } / { xxxToolCards } / { ROUTE_XXX } from '@/router/modules/<模块>'`，禁止在业务代码中硬编码路径字符串。
- 修改某个页面路径时，只改对应菜单模块中的路径常量一处即可，路由、卡片、菜单全自动生效。

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

卡片数据定义在对应菜单路由模块（如 `src/router/json.ts`）的 `xxxToolCards: ToolItem[]` 中，每个二级菜单加一项；落地页 `index.vue` 直接引入该数组，不再本地维护列表：

```ts
// src/router/json.ts
export const jsonToolCards: ToolItem[] = [
  { path: ROUTE_JSON_ONLINE_VIEW, icon: 'View', title: 'menu.jsonOnlineView', desc: 'tools.jsonOnlineView.description', color: '#909399' }
]

// src/views/json/index.vue
import { jsonToolCards } from '@/router/json'
const tools = jsonToolCards
```

- `path`：引用本模块路径常量，不写死字符串
- `icon`：`@element-plus/icons-vue` 图标名
- `title`：i18n key `menu.<工具名>`
- `desc`：i18n key `tools.<工具名>.description`
- `color`：卡片主题色

### 4. NavBar 菜单注册（src/components/NavBar.vue）

一级菜单在对应路由模块导出 `xxxMenu: NavMenuGroup`（含 icon 组件、link、prefix、items 或 modules）。`src/components/NavBar.vue` 引入该菜单并加入 `menus` 数组（NavBar 不自行维护菜单列表）：

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

- 存放位置：`src/components/`
- 示例：`src/components/FooterBar.vue`、`NavBar.vue`、`ToolCardGrid.vue`

## 执行要点

1. 新建或移动组件时，先判断「被谁使用」再决定放哪一级目录。
2. 移动组件后必须同步更新所有 import 路径（相对路径需指向新的 components 目录）。
3. 页面私有组件就近存放，不要放进 `src/components/`。
4. 若现有代码违反上述规则（如私有组件与 `index.vue` 平级，或共享组件散落在各页面内），应主动按本规则调整，保持项目结构一致。
