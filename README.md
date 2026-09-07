# 在线工具箱 (Online Toolbox)

一个基于 **Vue 3 + Vite + Element Plus** 构建的在线工具集合网站，内置多个日常开发与办公常用工具，支持中英文切换、响应式布局（Web / H5），并已适配 Netlify 静态部署与表单收集。

## 功能特性

| 一级菜单 | 工具 |
| --- | --- |
| JSON 在线工具 | JSON 解析、JSON 在线解析、JSON 压缩/转义、JSON 在线视图、JSON 着色工具、JSON \| XML 互转、JSON 比对工具、JSON 生成实体、JSON 转 Excel |
| 加密解密 | 对称加解密、JS 加密解密 |
| 压缩格式化 | JS / HTML 格式化 |
| 文档工具 | MIME 类型查询、HTML 转义、RGB 颜色、公共 DNS |
| 前端工具 | 网页常用色彩 |
| 转换 | 大小写转换（全大写/小写/首字母/句子/标题/驼峰/蛇形/大小写切换等） |
| 其他工具 | 用户反馈（Netlify Forms） |

## 技术栈

- [Vue 3](https://vuejs.org/)（Composition API + `<script setup>`）
- [Vite](https://vitejs.dev/) 4
- [Element Plus](https://element-plus.org/) 2 + [@element-plus/icons-vue](https://github.com/element-plus/element-plus-icons)
- [Vue Router](https://router.vuejs.org/) 4
- [Pinia](https://pinia.vuejs.org/) 2
- [vue-i18n](https://vue-i18n.intlify.dev/) 9（中 / 英）
- [Sass](https://sass-lang.com/)
- 工具库：crypto-js、javascript-obfuscator、qrcode、xlsx 等

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev

# 生产构建（含生成 Netlify 反馈表单 public/__forms.html）
npm run build

# 本地预览构建产物
npm run preview
```

## 国际化

- 语言：简体中文（zh）、English（en）
- 自动检测浏览器语言；切换后通过 localStorage（`toolbox_language`）持久记忆
- 文案配置位于 `src/locales/zh.js` 与 `src/locales/en.js`

## 项目结构

```
sojson
├─ public/                 # 静态资源（构建时生成 __forms.html）
├─ scripts/
│  └─ generate-netlify-forms.js   # 生成 Netlify 隐藏表单
├─ src/
│  ├─ components/          # NavBar 导航、FooterBar 页脚
│  ├─ config/              # feedbackForm 表单字段配置
│  ├─ locales/             # 中英文文案
│  ├─ router/              # 路由表
│  ├─ store/               # Pinia 状态
│  ├─ styles/              # 全局样式
│  ├─ views/               # 各工具页面（json/encrypt/compress/document/frontend/convert/other）
│  ├─ App.vue
│  └─ main.js
├─ index.html
├─ vite.config.js
├─ netlify.toml            # SPA 重定向配置
└─ package.json
```

## 部署

本项目为纯前端静态站点，可直接部署到 Netlify（或任意静态托管）：

1. 构建命令：`npm run build`，输出目录：`dist`
2. `netlify.toml` 已将 `/*` 重定向到 `/index.html`，支持前端路由
3. 用户反馈表单使用 [Netlify Forms](https://docs.netlify.com/forms/setup/)，构建时自动生成隐藏表单，提交内容会出现在 Netlify 后台表单面板
