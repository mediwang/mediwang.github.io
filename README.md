# DawnBird 网站（GitHub Pages）

三个静态页面，默认英文，可切换西班牙语、法语、中文。没有构建步骤，没有第三方脚本、字体或统计。

| 页面 | 文件 | 上线后的地址 | 用途 |
|---|---|---|---|
| 首页 | `index.html` | `https://mediwang.github.io/dawnbird/` | App Store Connect 的 Marketing URL（选填） |
| 支持页 | `support/index.html` | `…/support/` | Support URL（必填） |
| 隐私政策 | `privacy/index.html` | `…/privacy/` | Privacy Policy URL（必填），同时填进 app 仓库 `project.yml` 的 `DB_PRIVACY_POLICY_URL` |

其他文件：`assets/site.css`（样式）、`assets/site.js`（语言切换）、`.nojekyll`（让 GitHub Pages 原样发布，不要删）。

## 上线前必须替换的占位符

| 占位符 | 换成 | 出现位置 |
|---|---|---|
| `[[SUPPORT_EMAIL]]` | 正式支持邮箱 | 支持页、隐私政策 |
| `[[DEVELOPER_NAME]]` | App Store 上显示的开发者姓名 | 隐私政策、三个页面的页脚 |
| `[[EFFECTIVE_DATE]]` | 隐私政策生效日期，建议写成 `2026-12-01` 这种格式，四种语言通用 | 隐私政策 |
| `[[APP_STORE_URL]]` | App Store 产品页链接 | 首页按钮 |

`[[APP_STORE_URL]]` 没替换时，首页按钮会自动显示成 “Coming soon to the App Store”，所以上架前可以先不动它。

在 Mac 终端里一次替换（在本目录下运行，把右边换成真实内容）：

```bash
FILES="index.html support/index.html privacy/index.html"
sed -i '' 's/\[\[SUPPORT_EMAIL\]\]/hello@example.com/g' $FILES
sed -i '' 's/\[\[DEVELOPER_NAME\]\]/Your Name/g' $FILES
sed -i '' 's/\[\[EFFECTIVE_DATE\]\]/2026-12-01/g' $FILES
sed -i '' 's#\[\[APP_STORE_URL\]\]#https://apps.apple.com/app/id0000000000#g' $FILES

grep -n '\[\[' $FILES   # 没有任何输出，说明全部替换完了
```

## 图标

- `assets/logo.png`：页面左上角的小图标，放小鸟母版导出的正方形 PNG（128 × 128 以上）。没放这个文件时只显示文字 “DawnBird”，不会出现破图。
- `assets/favicon.png`：浏览器标签页图标，可以用同一张图。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个**公开**仓库（例如 `dawnbird-site`）。不要放进 app 的私有仓库。
2. 把本目录的全部内容（包括 `.nojekyll`）放到仓库根目录并推送。
3. 仓库 Settings → Pages → Source 选 “Deploy from a branch”，分支选 `main`，目录选 `/ (root)`，保存。
4. 一两分钟后访问 `https://mediwang.github.io/dawnbird/`。

以后买了域名，在同一个设置页填 Custom domain 即可，页面里用的都是相对路径，不需要改。

## 语言

- 语言优先级：网址里的 `?lang=` → 访问者上次的选择 → 英文。
- 可用的值：`en`、`es`、`fr`、`zh`。例如 `…/support/?lang=es`。
- App Store Connect 的 Support URL 和 Marketing URL 可以按语言分别填写，各语言填对应的 `?lang=` 地址即可。
- 浏览器关闭 JavaScript 时只显示英文。

## 本地预览

```bash
python3 -m http.server 8000
```

然后打开 `http://localhost:8000/`。直接双击 HTML 文件时，页面之间的跳转不会生效。

## 修改文案

每个页面里，每种语言各有一块 `<div data-l="en">`、`<div data-l="es">`、`<div data-l="fr">`、`<div data-l="zh">`，改内容时四块要一起改。隐私政策以英文版为准，译文末尾已注明。

## 内容依据与待确认

内容来自《DawnBird App Store 上架资料包（中文初稿）》里的支持页和隐私政策草稿，以及商店描述。以下几点变了，页面要跟着改：

- **付费范围**：页面按代码现状写（买断解锁起床确认、数独、9 首情绪闹铃与 Surprise Me、月报）。如果改成只有铃声付费，要改首页 “Free and paid” 和支持页相关回答。
- **权限**：隐私政策写的是“只申请闹钟一项权限”。如果做了试用到期前的本地通知，就多了通知权限，要补一句。
- **统计**：以后接入使用统计时，隐私政策、首页 “Collects no data” 和 App Store 隐私标签要同时改。
- **界面语言**：译文里的按钮名（Settings、Send Feedback、Solve to Stop、Give Up、Restore Purchases、Surprise Me）保留英文。app 本地化后要换成对应语言的界面文字。
- **回复时限**：支持页承诺“一般 2 个工作日内回复”，做不到就改掉。
- 隐私政策不是法律意见，发布前建议请律师看一眼，西班牙语和法语译文也建议请母语者过一遍。
