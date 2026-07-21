# 卿鬆翻一頁 — 電子報製作技能

> 當使用者說「做電子報」「製作新一期」「volX」時載入此技能。

---

## 工作流程（7 Step）

### Step 0：前置檢查
- 使用者提供 PDF 路徑，不主動提問
- 確認 `volXX/` 資料夾存在，若無則建立
- 讀取 PDF 提取內文與兌換碼

### Step 1：PDF 內容處理
- 用 `python -m pymupdf gettext` 或 `fitz` 提取文字
- 從內文自動提取兌換碼（找「兌換碼」關鍵字後面的引號內文字）
- 購物金固定 10 元
- 產出 `volXX/page-map.txt`（段落對位表）

### Step 2：Hero 圖製作
- 用 opencode-draw 技能（`draw.py`）生成
- **必含元素**：
  - 主標題「卿鬆翻一頁」
  - 小字「文末讀者暖心小驚喜」
  - 字體風格配合當期內文主題（職場→科技感無線體，童話→書法手寫體，情緒→柔軟圓體）
  - 主圖（燈泡/插畫/意象）佔畫面約 50%
  - 構圖由上至下：主標題 → 主圖 → 小字
- 生成後用 ffmpeg 壓縮為 **1300×650 JPG**：
  ```
  ffmpeg -y -i input.png -vf "scale=1300:650" "generated/hero-主題_1300x650.jpg"
  ```
- 若構圖不理想可迭代調整主圖比例

### Step 3：方圖製作
- 同 hero 風格生成 1024×1024
- 用 ffmpeg 轉為 **JPG 640×640**：
  ```
  ffmpeg -y -i input.png -vf "scale=640:640" "generated/square-主題_640x640.jpg"
  ```

### Step 4：背景圖製作
- 水彩紋理風格，對應當期配色
- 生成後直接使用 PNG 原檔

### Step 5：內頁圖處理
- 用 `fitz` 從 PDF 提取圖片：`page.get_images()` + `Pixmap`
- 視內文段落放置於對應位置

### Step 6：三模板製作

#### 6a. 配色規則
- 依當期主題決定主色，使用 CSS 變數（index）或 inline（email/blog）
- 三色搭配：主色 + 輔色 + 點綴色

#### 6b. index.html（網頁版）
- 完整 `<!DOCTYPE html>`，CSS 變數，RWD
- 背景圖參考 `../generated/bg-xxx.png`
- Hero 圖相對路徑 `../generated/hero-xxx_1300x650.jpg`
- 內頁圖相對路徑 `內頁圖-xxx.jpg` 或 `pX-imgX.png`

#### 6c. email-template.html（電子郵件版）
- 620px table 版型，無 CSS block
- Hero / 內頁圖使用**絕對 GitHub Pages URL**
- 三色裝飾條（top/bottom）
- CTA 使用 `bgcolor` table + 深色左側條

#### 6d. blog-template.html（部落格嵌入版）
- `div` fragment，全部 inline style
- Hero / 內頁圖使用絕對 GitHub Pages URL
- 心法/指引區域使用**純文字段落**（粗體標題+說明），不使用 2×2 圖標網格

#### 6e. 三模板一致規則
- **內容完全一致**：同一段文字、同一張圖、同一個 CTA 訊息
- 心法/指引區塊：三版都用純文字段落（email 與 blog 一致，index 可額外使用點狀卡片但內容相同）
- CTA：標題與內文**分行顯示**（`<br>` 換行）
- 取消訂閱連結 + 購物金兌換說明並列

### Step 7：部署
1. 更新專案根目錄 `index.html`（archive 連結 + 最新期內容）
2. 更新 `AGENTS.md`（製作備忘 + 技能更新記錄）
3. `git add` → `git commit` → `git push` 至 GitHub Pages
4. 刪除未使用的 intermediate 檔案（舊版 hero PNG 等）

---

## 配色參考（歷史）
| 期數 | 主題 | 主色 | 輔色 | 點綴色 |
|:----|:-----|:-----|:-----|:-------|
| 創刊號 | 地中海日常 | 陶土棕 #C4815A | 橄欖綠 #7D9B6A | 地中海藍 #6B8FA3 |
| vol2 | tamura-v3 | 陶土棕 | 橄欖綠 | 地中海藍 |
| vol3 | 童話心理學 | 玫瑰粉 #D48A8A | 鼠尾草綠 #8DAA8D | 薰衣草紫 #9B8EB5 |
| vol4 | 創意細物 | 玫瑰粉 | 鼠尾草綠 | 薰衣草紫 |
| vol5 | 我想打人 | 玫瑰粉 #D48A8A | 鼠尾草綠 #8DAA8D | 薰衣草紫 #9B8EB5 |
| vol6 | 高績效心智 | 水鴉青 #3A8F8F | 海軍藍 #34495E | 金色 #D4A853 |

---

## 圖片輸出規範總結
| 類型 | 尺寸 | 格式 | 備註 |
|:----|:----|:----|:-----|
| Hero 圖 | 1300×650 | JPG | 必含主標題+小字，字體配合主題 |
| 方圖 | 640×640 | JPG | 同 hero 風格 |
| 背景圖 | 原始尺寸 | PNG | 水彩紋理 |
| 內頁圖 | 原始尺寸 | PNG/JPG | 從 PDF 提取 |
