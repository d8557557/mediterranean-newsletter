# 卿鬆翻一頁 — 電子報製作技能

> 觸發：使用者說「做電子報」「製作新一期」「volX」「做 vol7」時載入。
> **本檔是唯一來源（single source of truth）**，隨專案 git 版控。
> 全域載入器：`~/.config/opencode/skills/newsletter/SKILL.md` 只負責指向本檔，**不要在那邊另寫一份流程**，以免兩份內容漂移。

---

## 0. 固定資產（直接用，不要重新問、不要重新找）

| 項目 | 值 |
|:----|:----|
| 專案路徑 | `C:\E_電子報` |
| GitHub repo | `d8557557/mediterranean-newsletter`（分支 `master`） |
| Pages 網址 | `https://d8557557.github.io/mediterranean-newsletter/` |
| 取消訂閱表單 | `https://docs.google.com/forms/d/e/1FAIpQLSfBeuECJmAnhRDTRv-i6509RGbg3VRolu7_BuAPBPM9pnNXCQ/viewform` |
| 購物金兌換說明 | `https://campub.com.tw/article/detail/exchangeBonus` |
| 讀者禮 | 10 元購物金，限量 100 份 |
| 兌換碼 | 自當期內文提取（找「兌換碼」後引號內文字），**不主動詢問使用者** |
| 兌換期限 | 發報後 7 天內有效 |
| 開場白素材 | `開場白-卿鬆翻一頁.txt`（內含兩版，依當期語氣選用／改寫） |
| 心得連結 | `翻一頁的心得網址.txt`（Google Doc，讀者回饋用） |
| email 版寬 | 620px（table 版型；內文圖 564px、故事圖 520–560px） |
| Hook 廣告圖 | 橫式 1200×550 JPG ＋ 直式 480×640 PNG（30px 圓角），同主題同文案 |
| 廣告 CTA 預設 | 「點我看書中精華 →」（可依當期調整，兩張廣告圖需一致） |

---

## 1. 命名規則（唯一版本，不再兩套並存）

| 類型 | 規則 | 範例 |
|:----|:----|:----|
| 期數資料夾 | `volN`，**不補零**；新期為 `vol7`、`vol8`… | `vol2`、`vol3`、`vol7` |
| 歷史例外（不改） | `vol06`（已上線）、`創刊號`（中文名） | `vol06/`、`創刊號/` |
| 最新期全文 | 根目錄 `index.html`（含 archive 導覽）＋ `volN/index.html`（同一份內容） | |
| Hero 圖 | `generated/hero-主題_1300x650.jpg` | `hero-高績效心智_1300x650.jpg` |
| 方圖 | `generated/square-主題_640x640.jpg`（社群貼文用，不嵌入任何模板） | `square-高績效心智_640x640.jpg` |
| Hook 廣告圖（橫） | `generated/ad-hook-主題_1200x550.jpg`（投放用，不嵌入模板） | `ad-hook-高績效心智_1200x550.jpg` |
| Hook 廣告圖（直） | `generated/ad-hook-主題_480x640.png`（30px 圓角、PNG） | `ad-hook-高績效心智_480x640.png` |
| 背景圖 | `generated/bg-主題_YYYYMMDD_HHMMSS.png` | `bg-高績效心智_20260721_234146.png` |
| 內頁圖 | `volN/p{頁}-img{序}.png` | `vol06/p1-img1.png` |
| 內頁圖歷史例外 | `vol3`–`vol5` 用 `內頁圖-p{頁}-{序}.jpg`，不改舊檔 | `內頁圖-p1-1.jpg` |
| 段落對位表 | `volN/page-map.txt`，**視內容判斷**是否產出（多頁／多圖才需要） | |

---

## 2. 工作流程（8 Step）

### Step 0：前置檢查
- 使用者提供 PDF 路徑即開工，不主動提問
- 建立 `volN/`（N 依上一期 +1，不補零）
- 讀取 PDF，從 `開場白-卿鬆翻一頁.txt` 挑／改寫開場白
- 確認 repo 狀態乾淨（`git status`），避免與其他變更混在一起

### Step 1：PDF 內容處理
- 用 `python -m pymupdf gettext` 或 `fitz` 提取文字
- 從內文自動提取兌換碼（找「兌換碼」關鍵字後引號內文字）
- 購物金固定 10 元、限量 100 份、發報後 7 天
- **視內容判斷**是否產出 `volN/page-map.txt`（段落對位表）：
  - 需要：內文多頁、內頁圖多張、段落與圖的對位不明顯時
  - 可省略：單頁、單張內頁圖、順序直觀時（省略不視為缺件）
  - 格式：

```
段落對位表 -- VOL6：高績效心智

Page 1 --> p1-img1.png
  - Topic: 重新設計工作、找到價值缺口
  - Book: 高績效心智：全新聰明工作學，讓你成為最厲害的1%
  - Theme: 工作設計、價值創造、職涯發展

Page 2 --> (無內頁圖)
  - Coupon code: 卿鬆工作學（10元購物金）
```

### Step 2：Hero 圖製作
- 用 opencode-draw 技能（`draw.py`）生成
- **必含元素**：
  - 主標題「卿鬆翻一頁」
  - 小字「文末讀者暖心小驚喜」
  - 字體風格配合當期內文主題（職場→科技感無線體，童話→書法手寫體，情緒→柔軟圓體）
  - 主圖與文字的位置、比例依當期設計而定，無固定限制
- 生成後用 ffmpeg 壓縮為 **1300×650 JPG**：
  ```
  ffmpeg -y -i input.png -vf "scale=1300:650" "generated/hero-主題_1300x650.jpg"
  ```
- 若構圖不理想可迭代調整主圖比例

### Step 3：Hook 廣告圖製作（投放用，一次出兩張）

**目的**：讓人停下來點進來（點擊率），不是品牌識別。**不可把 Hero 直接縮放**——Hero 的固定標題＋小字是品牌版型，Hook 廣要的是痛點句＋CTA。

一次產出兩個尺寸（同一主題、同一文案、同一配色，只換版型）：

| 版本 | 尺寸 | 格式 | 命名 | 版面 |
|:--|:--|:--|:--|:--|
| 橫式 | 1200×550 | JPG | `generated/ad-hook-主題_1200x550.jpg` | 左文右圖（或右文左圖） |
| 直式 | 480×640 | **PNG（30px 圓角）** | `generated/ad-hook-主題_480x640.png` | 上文下圖（或上圖下文） |

**文案規則**
- 主 Hook：≤14 字，最多 2 行（單行 ≤9 字），優先改寫內文痛點句
- 句型三選一：反問（「你是不是也…」）／痛點直述／數字反差
- 必含：主 Hook 大字＋品牌小字「卿鬆翻一頁」＋CTA（預設「點我看書中精華 →」，可依當期調整）
- 可選：書名、期數
- **兩張必須用同一組文案與配色**，只有版型不同

**設計規則**
- 設計方向必須扣住當期內文主題（用書中核心意象／場景，不做通用裝飾圖）
- 主體不壓字；四周留 **40px 安全區**（避免平台裁切）
- 文字與底圖對比 ≥ 4.5:1，不夠就加半透明色塊或柔邊遮罩
- 配色沿用當期三色（與 Hero 同視覺語言）

**輸出**
- 橫式（ffmpeg，JPG 品質 90、< 300KB）：
  ```
  ffmpeg -y -i ad-master-landscape.png -vf "scale=1200:550" -q:v 2 "generated/ad-hook-主題_1200x550.jpg"
  ```
- 直式（Pillow，30px 圓角、PNG 保留透明角）：
  ```python
  from PIL import Image, ImageDraw
  W, H, R, S = 480, 640, 30, 4          # S = 超取樣倍率，讓圓角平滑
  im = Image.open("ad-master-portrait.png").convert("RGBA").resize((W, H), Image.LANCZOS)
  mask = Image.new("L", (W * S, H * S), 0)
  ImageDraw.Draw(mask).rounded_rectangle([0, 0, W * S - 1, H * S - 1], radius=R * S, fill=255)
  im.putalpha(mask.resize((W, H), Image.LANCZOS))
  im.save("generated/ad-hook-主題_480x640.png", "PNG", optimize=True)
  ```
  母檔比例要對齊輸出，避免縮放變形：橫式用 2400×1100（約 2.18:1）、直式用 960×1280（3:4）
- 兩張用**同一份設計簡述**（當期主題、三色、核心意象）分別生成，確保是同一套視覺語言、只差版型

**檢查**
- 縮到 25%（約手機動態牆大小）仍讀得到字、無錯字、CTA 一眼可見
- 直式 PNG 四角確實透明（`getpixel((0,0))[3] == 0`）
- 需要 A/B 測試時，加 `-v2` 後綴另存，不要覆蓋第一版

**不嵌入三模板**（純投放素材，跟方圖同類）

### Step 4：方圖製作（社群用）
- 同 hero 風格生成 1024×1024
- 用 ffmpeg 轉為 **JPG 640×640**：
  ```
  ffmpeg -y -i input.png -vf "scale=640:640" "generated/square-主題_640x640.jpg"
  ```
- **用途**：社群／IG 貼文素材，不嵌入三模板（模板只用 Hero 與背景圖）

### Step 5：背景圖製作
- 水彩紋理風格，對應當期配色
- 生成後直接使用 PNG 原檔

### Step 6：內頁圖處理
- 用 `fitz` 從 PDF 提取圖片：`page.get_images()` + `Pixmap`
- 依 `page-map.txt`（若未產出則依內文段落順序）放到「內頁圖」區塊（故事內容之後、CTA 之前）
- 命名照 §1：`p{頁}-img{序}.png`；一張內頁圖都沒有時，該區塊整段刪除

### Step 7：三模板製作

區塊順序（三版一致）：
`Hero → Intro（標題＋副標） → 故事內容／要點指引 → 內頁圖 → CTA → 讀者禮（兌換碼） → 取消訂閱＋購物金兌換說明 → Footer`

#### 7a. 配色規則
- 依當期主題決定主色，使用 CSS 變數（index）或 inline（email/blog）
- 三色搭配：主色 + 輔色 + 點綴色

#### 7b. index.html（網頁版）
- 完整 `<!DOCTYPE html>`，CSS 變數，RWD
- 背景圖 `../generated/bg-xxx.png`
- Hero 圖 `../generated/hero-xxx_1300x650.jpg`
- 內頁圖同資料夾相對路徑 `pX-imgX.png`

#### 7c. email-template.html（電子郵件版）
- 620px table 版型，無 CSS block
- Hero / 內頁圖使用**絕對 GitHub Pages URL**（`https://d8557557.github.io/mediterranean-newsletter/...`）
- 三色裝飾條（top/bottom）
- CTA 使用 `bgcolor` table + 深色左側條

#### 7d. blog-template.html（部落格嵌入版）
- `div` fragment，全部 inline style
- Hero / 內頁圖使用絕對 GitHub Pages URL
- 心法/指引區域使用**純文字段落**（粗體標題+說明），不使用 2×2 圖標網格

#### 7e. 三模板一致規則
- **內容完全一致**：同一段文字、同一張圖、同一個 CTA 訊息
- 心法/指引區塊：三版都用純文字段落（email 與 blog 一致，index 可額外使用點狀卡片但內容相同）
- CTA：標題與內文**分行顯示**（`<br>` 換行）
- 取消訂閱連結 + 購物金兌換說明**並列**（`|` 分隔）
- **舊期不回填**：創刊號、vol2–vol4 缺購物金兌換連結屬歷史狀態，除使用者明確要求，不在新期工作中順手改

### Step 8：部署與驗證

1. 更新 `volN/index.html`（本期全文）
2. 更新根目錄 `index.html`：
   - 本期全文（與 `volN/index.html` 內容一致，僅多 archive 導覽）
   - archive 導覽**必須列出全部期數**：創刊號、vol2、vol3、vol4、vol5…（現況缺 vol.2，新期更新時順手補齊）
3. 更新 `AGENTS.md`（已完成期數表＋製作備忘＋技能更新記錄）
4. `git add` → `git commit` → `git push`（master → GitHub Pages）
5. 清掉未使用的 intermediate（舊版 hero／被取代的生成圖）
6. **驗證清單**（全部 200 才算完成）：
   - `https://d8557557.github.io/mediterranean-newsletter/`
   - `https://d8557557.github.io/mediterranean-newsletter/volN/`
   - Hero 圖、背景圖、每張內頁圖的絕對 URL
   - email／blog 模板內的圖 URL 與 volN 實際檔名一致（最常見的錯字）

---

## 3. 配色參考（歷史）
| 期數 | 主題 | 主色 | 輔色 | 點綴色 |
|:----|:-----|:-----|:-----|:-------|
| 創刊號 | 地中海日常 | 陶土棕 #C4815A | 橄欖綠 #7D9B6A | 地中海藍 #6B8FA3 |
| vol2 | tamura-v3 | 陶土棕 | 橄欖綠 | 地中海藍 |
| vol3 | 童話心理學 | 玫瑰粉 #D48A8A | 鼠尾草綠 #8DAA8D | 薰衣草紫 #9B8EB5 |
| vol4 | 創意細物 | 玫瑰粉 | 鼠尾草綠 | 薰衣草紫 |
| vol5 | 我想打人 | 玫瑰粉 #D48A8A | 鼠尾草綠 #8DAA8D | 薰衣草紫 #9B8EB5 |
| vol6 | 高績效心智 | 水鴉青 #3A8F8F | 海軍藍 #34495E | 金色 #D4A853 |

---

## 4. 圖片輸出規範總結
| 類型 | 尺寸 | 格式 | 備註 |
|:----|:----|:----|:-----|
| Hero 圖 | 1300×650 | JPG | 必含主標題+小字，字體配合主題 |
| 方圖 | 640×640 | JPG | 同 hero 風格，社群用 |
| Hook 廣告圖（橫） | 1200×550 | JPG | 痛點句＋CTA，投放用 |
| Hook 廣告圖（直） | 480×640 | PNG | 30px 圓角、四角透明，與橫式同主題同文案 |
| 背景圖 | 原始尺寸 | PNG | 水彩紋理 |
| 內頁圖 | 原始尺寸 | PNG/JPG | 從 PDF 提取 |

---

## 5. 已知技術債（新期不處理，除非使用者指定）
- **最新期有兩份全文**：根 `index.html` 與 `volN/index.html` 靠人工同步；新期一定要兩邊都改並比對
- **archive 缺 vol.2 連結**（頁面存在但無入口）
- **舊期缺購物金兌換連結**：創刊號、vol2、vol3、vol4 的 3 個模板皆無
- **`generated/` 孤兒檔**：`hero-創意細物指南` v2/v3/無版號 等舊圖仍在版控中
