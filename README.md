# Lala Story Lab 故事分歧對話與創作工坊

個人用原著接續 / 劇情分支 / 角色與語料管理。

淺色介面、對話、劇情樹、角色、日記、語料。**不是**深色單角色聊天殼。

## 已預設（依原著）

- 角色：Lala、Adam（法定養子）、Daniel、Leon、Rave、Amy、九歌、傅爺、Ben
- 語料：鐵律、Adam 承諾、900 萬修正、時間線
- 模型：`gemini-2.0-flash`
- 本地儲存版本：v6

## 本機執行

```bash
npm install
cp .env.example .env.local
# 編輯 .env.local，填入 GEMINI_API_KEY=你的金鑰
npm run dev
```

瀏覽器打開終端顯示的網址。

## 推到 GitHub（網頁、不用打指令）

1. 解壓本專案
2. 開 https://github.com/new → 建空 repo（不要勾 Add README）
3. 點 **uploading an existing file**
4. 把解壓後資料夾**裡面的所有檔案**拖進去 → Commit
