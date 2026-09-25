# Lala Story Lab 故事分歧對話與創作工坊

個人用原著接續 / 劇情分支 / 角色與語料管理。

淺色介面、對話、劇情樹、角色、日記、語料。**不是**深色單角色聊天殼。

## 已預設（依原著）

- 角色：Lala、Adam（法定養子）、Daniel、Leon、Rave、Amy、九歌、傅爺、Ben
- 語料：鐵律、Adam 承諾、900 萬修正、時間線
- 模型：`gemini-2.0-flash`
- 本地儲存版本：v6

## 下載 Android APK（新手步驟）

不必會寫 code，跟著做即可：

1. 打開本 repo：https://github.com/richardmoore2005414-netizen/lala-story-lab
2. 上方點 **Actions**
3. 左側點 **Build APK**
4. 右側點 **Run workflow** → 再點綠色 **Run workflow**
5. 等約 5–10 分鐘，看到綠色勾勾
6. 點進那次 run → 最下方 **Artifacts** → 下載 **lala-story-lab-apk**
7. 解壓得到 `LalaStoryLab.apk`，傳到手機安裝
8. 手機需允許「安裝未知應用程式」（在檔案管理或瀏覽器設定裡開）

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
