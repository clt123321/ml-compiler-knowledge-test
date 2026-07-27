# MAINTENANCE.md

## 升级 Knowledge Test Kit

当前固定版本：

- Kit version: `v0.1.1`
- Expected commit: `5d58632122590adb66c6712f0dcf301fe8fb1e36`

升级时至少要同步修改：

- `scripts/kit-runner.mjs`
- `.github/workflows/pages.yml`
- `README.md`
- `CHANGELOG.md`
- 如有必要，`knowledge-test.config.json`

## 为什么必须修改版本号

Kit 版本是内容仓库的公开运行契约。

只要发生以下任一变化，都应该递增当前仓库版本号并更新变更记录：

- 升级 Kit 主版本或次版本
- 改变公开站点行为
- 改变公开内容过滤规则
- 改变默认计分配置
- 改变本地启动或部署方式

这样做可以让：

- 用户知道自己运行的产品版本
- 维护者快速定位问题是否与 Kit 升级有关
- GitHub Pages 行为与 README 描述保持一致

## 升级步骤

1. 确认目标 Kit tag 已发布
2. 记录目标 tag 对应的 commit
3. 更新 `scripts/kit-runner.mjs` 中的版本与 commit 常量
4. 更新 `.github/workflows/pages.yml` 中的 `kit_ref`
5. 如 Kit 配置契约有变化，更新 `knowledge-test.config.json`
6. 更新 `README.md` 与 `CHANGELOG.md`
7. 清空本地缓存后重新验证

## 本地验证新版本

建议按顺序执行：

```bash
rm -rf .cache/knowledge-test-kit
npm run inspect
npm run doctor
npm run site:validate
npm run build
```

如升级影响内容脚本，也要补跑：

```bash
npm run content:validate
npm run content:audit
npm run content:export
```

## 回滚

如果新版本 Kit 出现兼容性问题：

1. 把 `scripts/kit-runner.mjs` 的版本与 commit 恢复到上一个已验证版本
2. 把 `.github/workflows/pages.yml` 的 `kit_ref` 回滚
3. 删除本地缓存：`rm -rf .cache/knowledge-test-kit`
4. 重新执行 `npm run build`

不要通过 force push 覆盖已发布历史。

## 站点构建

本地构建：

```bash
npm run build
```

构建结果：

- 当前仓库根下的 `dist/`
- 由 Kit 生成的 Astro 静态页面与 Pagefind 索引

预览：

```bash
npm run preview
```

## 发布

1. 确认 `main` 分支上的 CI 通过
2. 确认 GitHub Pages Source 为 `GitHub Actions`
3. 推送到 `main`
4. 等待 `.github/workflows/pages.yml` 完成部署
5. 检查：

```text
https://clt123321.github.io/ml-compiler-knowledge-test/
https://clt123321.github.io/ml-compiler-knowledge-test/practice/
```

## 相关文件

- `scripts/kit-runner.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/pages.yml`
- `knowledge-test.config.json`
- `README.md`
- `CHANGELOG.md`
