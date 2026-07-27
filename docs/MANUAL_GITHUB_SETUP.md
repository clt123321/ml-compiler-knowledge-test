# GitHub 手工设置指南

本仓库 `main` 与 tag `v0.1.0` 已推送。以下步骤需要在浏览器中由具备仓库 admin 权限的用户手工完成，CLI 无法或不应自动执行。

## 1. 创建 GitHub Release

由于本机未安装 `gh` CLI，Release 需手工创建：

1. 访问：`https://github.com/clt123321/ml-compiler-knowledge-test/releases/new`
2. 选择 tag：`v0.1.0`
3. Release title：`ML Compiler Knowledge Test v0.1.0`
4. Release notes：粘贴 `docs/RELEASE_NOTES_v0.1.0.md` 全文
5. 勾选 `Set as the latest release`
6. 不勾选 `Set as a pre-release`
7. 点击 `Publish release`

## 2. 默认分支确认

访问 `Settings → General → Default branch`，确认默认分支为 `main`。

## 3. GitHub Pages（待 knowledge-test-kit 稳定后启用）

**当前不要启用**。前置条件：

- `knowledge-test-kit` 已发布稳定 tag；
- 本仓库已完成集成测试；
- `docs/pages-workflow-draft.yml` 中的 `KIT_VERSION` 与 repository slug 已填实值；
- 该文件已移动到 `.github/workflows/deploy-pages.yml`。

启用步骤：

```
Repository
  → Settings
  → Pages
  → Build and deployment
  → Source
  → GitHub Actions
```

如后续接入自定义域名：

```
Settings
  → Pages
  → Custom domain
```

## 4. Repository 可见性

当前仓库可见性由用户决定，本流程不做变更。若需公开，请手工在：

```
Settings
  → General
  → Danger Zone
  → Change repository visibility
```

## 5. Branch protection（推荐）

推荐为 `main` 启用保护规则：

- Require a pull request before merging
- Require status checks to pass before merging（待 CI 上线后启用）
- Do not allow force pushes
- Do not allow deletions

## 6. Secrets

当前无需任何 Secret。若后续 Pages Workflow 需要跨仓库拉取 `knowledge-test-kit`（若为私有仓库），需在 `Settings → Secrets and variables → Actions` 添加 PAT。
