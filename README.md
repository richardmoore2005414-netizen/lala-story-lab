# Lala Story Lab 故事分歧對話與創作工坊

個人用原著接續 / 劇情分支 / 角色與語料管理。

淺色介面、對話、劇情樹、角色、日記、語料。**不是**深色單角色聊天殼。

## 已預設（依原著）

- 角色：Lala、Adam（法定養子）、Daniel、Leon、Rave、Amy、九歌、傅爺、Ben
- 語料：鐵律、Adam 承諾、900 萬修正、時間線
- 模型：`gemini-2.0-flash`
- 本地儲存版本：v6

## 下載 Android APK 與 Google Drive 雲端同步

### 為什麼先前 GitHub Action 無法生成 APK？
1. **`sdkmanager: command not found`**：GitHub 託管環境未將 Android SDK 命令列工具加入預設系統 `$PATH`，導致授權與工具安裝步驟中斷。
2. **Java 版本衝突**：Capacitor 7 與 Gradle 8.7+ 需要 **Java 21**，原先設定為 Java 17 會引發編譯版本錯誤。
3. **依賴與設定缺漏**：已補齊專案根目錄的 `capacitor.config.json` 及 Capacitor 專屬依賴。

現已全面修復，並支援**直接下載**與**自動上傳至 Google Drive**。

---

### 方案 A：使用 Google Drive 作為 APK 儲存地（自動上傳）

如果希望 GitHub Action 一編譯完畢就自動將 `LalaStoryLab.apk` 送到你的 Google Drive 資料夾：

1. **建立 Google Cloud 服務帳號（Service Account）**：
   - 到 [Google Cloud Console](https://console.cloud.google.com/) 啟用 **Google Drive API**。
   - 建立 Service Account 並下載 **JSON 金鑰檔案**。
2. **共用 Google Drive 資料夾**：
   - 在 Google Drive 建立一個存放 APK 的資料夾（例如「LalaStoryLab-APKs」）。
   - 將該資料夾**共用**給你的 Service Account Email（權限設為「編輯者」）。
   - 複製資料夾網址中的 ID（例如 `https://drive.google.com/drive/folders/` 後面的字串）。
3. **在 GitHub 新增 Secrets**：
   - 打開本 GitHub Repo → **Settings** → **Secrets and variables** → **Actions**。
   - 新增 Repository Secret：
     - `GDRIVE_CREDENTIALS`：貼上 Service Account JSON 金鑰的完整內容。
     - `GDRIVE_FOLDER_ID`：貼上你的 Google Drive 資料夾 ID。
4. **觸發編譯**：
   - 到 **Actions** → 點選 **Build APK & Upload to Google Drive** → **Run workflow**。
   - 完成後 APK 會直接出現在你的 Google Drive 中！

---

### 方案 B：手動轉存 Google Drive（無需任何金鑰設定）

如果不想設定 Google Cloud 服務帳號：

1. 打開本 repo：https://github.com/richardmoore2005414-netizen/lala-story-lab
2. 上方點 **Actions** → 左側點 **Build APK & Upload to Google Drive**
3. 點 **Run workflow**
4. 等候綠色打勾完成（約 5–8 分鐘）
5. 點進該次執行頁面，滑到最下方的 **Artifacts**，點擊 **lala-story-lab-apk** 下載
6. 解開 ZIP 得到 `LalaStoryLab.apk`，直接拖曳上傳至你的 **Google Drive**
7. 在手機上的 Google Drive App 直接點擊該 APK 安裝即可！

> 說明：APK 是網頁版的手機包裝（Capacitor）。AI 對話需要後端 API（`GEMINI_API_KEY`）。若只裝 APK、沒有部署後端，對話功能會無法連線；本機瀏覽器用 `npm run dev` 則可正常用。

## 本機執行

```bash
npm install
cp .env.example .env.local
# 編輯 .env.local，填入 GEMINI_API_KEY=你的金鑰
npm run dev
```

瀏覽器打開終端顯示的網址。

## 目錄

```
server.ts                 # API + Gemini
src/data/initialCorpus.ts # 原著角色與語料預設
src/services/storage.ts   # localStorage v6
src/components/           # 對話、樹、角色、日記、語料
.github/workflows/        # Build APK 自動流程
```

## 注意

- 不要提交 `.env.local`
- 首次開啟若仍是舊資料：介面重置，或清除瀏覽器 localStorage
