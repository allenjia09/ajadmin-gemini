# AJ-Admin-Gemini 🚀

一个基于 **Vue 3**、**Vite** 和 **Naive UI** 构建的现代化智能后台管理系统。

## ✨ 核心特性

- 🛠️ **全动态自定义模块**：无需编写代码即可在 UI 中创建、编辑和管理业务模块。
- 📊 **智能数据汇总**：自动识别数字和计算字段，实时生成数据看板。
- 🧮 **计算字段引擎**：支持通过自定义标识（Alias）编写数学公式，实现自动计算（如：利润 = 销售额 - 成本）。
- 📝 **多种字段类型**：
  - **文本 (String)**：基础文字录入。
  - **数字 (Number)**：带统计功能的数值。
  - **日期 (Date)**：集成日期选择组件。
  - **下拉选择 (Select)**：支持动态配置选项。
  - **计算属性 (Compute)**：实时公式解析与展示。
- 🤖 **动态后端集成**：基于 PocketBase 构建，支持实时数据同步与灵活的内容管理。
- 🔮 **智能八字排盘**：集成 Tyme4ts 历法库，提供精准的八字排盘与五行能量分析。
- 🔐 **权限管理系统**：内置完善的登录/注册流及路由导航守卫。
- 🎨 **极致交互体验**：基于 Naive UI，支持全中文化（zhCN）、动态动画以及优雅的响应式布局。

## 🛠️ 技术栈

- **框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **UI 组件库**: [Naive UI](https://www.naiveui.com/)
- **后端数据库**: [PocketBase](https://pocketbase.io/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: [Vue Router](https://router.vuejs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **历法库**: [Tyme4ts](https://github.com/6tail/tyme4ts)

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 单机版运行

```bash
cd backend
pocketbase.exe serve
```

### 账号配置

请前往 PocketBase 控制台创建管理员账号，或直接在页面注册新用户。

## 📸 功能说明

### 自定义模块

在“模块管理”中，您可以定义项目的名称、图标及其属性。每个属性都可以指定 ID（用于公式引用）和校验规则（如必填）。

### 汇总统计

在动态项目的数据详情页，顶部会自动展示该项目所有数值字段的合计值，采用动画效果增强视觉反馈。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来完善这个项目！
