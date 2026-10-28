# 電子報訂閱名單（gas-subscribe）

部落格文章裡的「訂閱電子報」輸入框，把 Email 收進 Google 試算表的後端。

- **擁有者帳號**：`0800@campub.com.tw`
- **試算表**：`電子報訂閱名單`（`clasp create-script --type sheets` 建立，腳本綁在試算表上）
- **工作表**：`訂閱名單`（第一次收到表單時自動建立表頭）
- **網頁應用程式**：執行身分＝我（部署者）、存取權＝任何人

## 欄位

| 欄 | 名稱 | 說明 |
|:--|:--|:--|
| A | 訂閱時間 | 伺服器時間，格式 `yyyy/mm/dd hh:mm:ss` |
| B | Email | 一律轉小寫後儲存，用來去重 |
| C | 來源期數 | 表單 hidden 欄位 `vol`（例：`vol6`） |
| D | 來源頁面 | 表單 hidden 欄位 `src`（例：`blog-vol6`），之後要分渠道時改這裡 |
| E | 狀態 | 目前固定寫 `有效` |

**刻意不放姓名、電話、地址**：這是公開網頁收來的資料，只留寄信必要的最小欄位。

## 前端（部落格）

`blog-form-snippet.html` 是可直接貼進 `blog-template.html` 的區塊，設計成**零 JavaScript**：

```html
<form action="<GAS /exec 網址>" method="POST"> ... </form>
```

- 送出後**同一個分頁**跳到 GAS 的結果頁（✅ 訂閱成功／已訂閱／格式錯誤），頁面有「← 回上一頁」
- **不要用 iframe 嵌 GAS**：部分瀏覽器與預覽工具會把 Google 頁面渲染成一大塊「雲端硬碟」畫面，2026-10-28 已移除
- 獨立頁 `subscribe/index.html` 就是同一段區塊的完整頁面版本

## 改流程時要注意

1. 改 `Code.gs` 後：`npx @google/clasp push`
2. **push 不會更新已部署的版本**，要重新部署才會生效：
   `npx @google/clasp create-deployment --description "第N版"`
3. 網址**不要自己拼**，用 `npx @google/clasp open-web-app <deploymentId> --json`
4. 換網址後要同步改 `blog-form-snippet.html` 與 `volN/blog-template.html` 的兩處（`action` 與 iframe `src`）

## 相關指令

```powershell
npx @google/clasp show-authorized-user --json   # 目前登入帳號
npx @google/clasp open-container                 # 開試算表
npx @google/clasp open-script                    # 開 Apps Script 編輯器
npx @google/clasp list-deployments               # 列出部署
```
