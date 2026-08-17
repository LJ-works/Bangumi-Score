# Bangumi Score

这是一个用于 [Bangumi 每日放送](https://bangumi.tv/calendar) 页面的用户脚本。它会加载每个条目的评分，按评分对每天的条目排序，并隐藏低于指定最低评分的条目。

此用户脚本仅在 `https://bangumi.tv/calendar` 页面运行。

## 功能

- 获取每个条目的 Bangumi 页面并显示其评分。
- 按有效评分从高到低排列每天的条目。
- 通过 `0`–`10` 滑块隐藏低于最低评分的条目。
- 使用 **Hide** 和 **Show** 按钮手动隐藏或恢复单个条目。
- 在新标签页中打开条目链接。
- 在浏览器存储中保留最低评分和已隐藏条目。

无法获取评分的条目（包括页面请求失败的条目）将按评分 `0` 处理。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 等用户脚本管理器。
2. 打开[最新用户脚本](https://github.com/LJ-works/Bangumi-Score/releases/latest/download/bangumi-score.user.js)并确认安装。
3. 打开 [Bangumi 每日放送](https://bangumi.tv/calendar) 页面。

## 开发

请使用 Node.js 26，以与 CI 环境保持一致。

```bash
npm install
npm run dev
```

首次运行 `npm run dev` 时，浏览器会提示安装开发版用户脚本。后续代码变更会通过本地热更新生效。涉及 DOM 的变更应在 Bangumi 每日放送页面上手动验证。

### 源码结构

- `src/main.ts`：组装用户脚本模块并协调设置变更。
- `src/calendar.ts`：加载评分，并管理条目排序、显示状态以及 Hide/Show 控件。
- `src/score-filter.ts`：渲染最低评分滑块。
- `src/settings.ts`：加载和保存用户设置。
- `src/*.test.ts`：与源码放在一起的 Vitest 测试；涉及 DOM 时使用 jsdom。

### 检查与构建

```bash
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
```

生产构建输出为 `dist/bangumi-score.user.js`。请在 `vite.config.ts` 中配置 `@match`、`@grant` 等用户脚本元数据。

## 发布

提交信息应遵循 [Conventional Commits](https://www.conventionalcommits.org/)。Release Please 负责管理版本、更新日志、标签和 GitHub Release；请勿手动运行 `npm version`。CI 会构建发布版本，并将用户脚本上传为 Release 资源。
