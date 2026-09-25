import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, ArrowRight, ExternalLink, HardDrive, Check, Link2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { StoryStorageService } from '../services/storage';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'compact' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [gdriveUrl, setGdriveUrl] = useState<string>(StoryStorageService.getGoogleDriveApkUrl());
  const [isEditingGdrive, setIsEditingGdrive] = useState(false);
  const [tempGdriveInput, setTempGdriveInput] = useState(gdriveUrl);

  // If already running in standalone mode (PWA installed and active), don't show prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white px-3 py-2 flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2 truncate">
            <Smartphone className="w-4 h-4 shrink-0 text-sky-200 animate-pulse" />
            <span className="font-medium truncate">安裝至手機桌面，享有沉浸式全螢幕與原生體驗</span>
          </div>
          <button
            onClick={handleInstallClick}
            className="shrink-0 bg-white text-sky-800 hover:bg-sky-50 font-bold px-3 py-1 rounded-full text-[11px] shadow-xs flex items-center gap-1 transition-transform active:scale-95 ml-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>安裝 App</span>
          </button>
        </div>
      ) : variant === 'compact' ? (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1 text-[11px] font-bold bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-2.5 py-1 rounded-full shadow-xs active:scale-95 transition-all"
          title="安裝至手機主畫面 (PWA)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>安裝 App</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-3 py-1 rounded-full font-bold shadow-xs active:scale-95 transition-all"
          title="安裝至手機主畫面 (PWA)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>安裝 App</span>
        </button>
      )}

      {/* Guide Modal for Android / Brave / Chrome / iOS */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-sky-100 shadow-2xl max-w-sm w-full p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">安裝 Lala Story Lab</h3>
                  <p className="text-[11px] text-slate-500">免下載商店，即刻加入手機主畫面</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {isIOS ? (
                <>
                  <div className="font-semibold text-slate-900 mb-1">📱 iPhone / Safari 安裝指引：</div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <span>點擊 Safari 底部工具列中央的<strong>「分享」</strong>圖標（方框箭頭向上）。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <span>向下滑動選單，點選<strong>「加入主畫面」</strong> (Add to Home Screen)。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <span>點擊右上角的「新增」即可完成安裝！</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-slate-900 mb-1">🤖 Android / Brave / Chrome 安裝指引：</div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <span>點擊瀏覽器右上角（或右下角）的<strong>選單按鈕（三個點「⋮」）</strong>。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <span>在彈出選單中點選<strong>「安裝應用程式」</strong>或<strong>「新增至主螢幕」</strong> (Install App / Add to Home screen)。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <span>確認點擊<strong>「安裝」</strong>，桌面上便會生成專屬 App 圖標，享有宛如原生 App 的全螢幕體驗！</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-sky-600" />
                  <span>Android 原生 APK & Google Drive</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">免解壓直裝</span>
              </div>

              {/* Direct APK Download Link */}
              <a
                href="https://github.com/richardmoore2005414-netizen/lala-story-lab/releases/download/apk-latest/LalaStoryLab.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>立即下載 LalaStoryLab.apk（手機直裝）</span>
              </a>

              {/* Google Drive Link Section */}
              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-sky-900">📁 Google Drive 雲端硬碟存放處</span>
                  <button
                    onClick={() => {
                      if (isEditingGdrive) {
                        StoryStorageService.setGoogleDriveApkUrl(tempGdriveInput);
                        setGdriveUrl(tempGdriveInput);
                        setIsEditingGdrive(false);
                      } else {
                        setIsEditingGdrive(true);
                      }
                    }}
                    className="text-sky-600 hover:text-sky-800 font-semibold underline text-[10px]"
                  >
                    {isEditingGdrive ? '儲存' : gdriveUrl ? '變更網址' : '設定雲端網址'}
                  </button>
                </div>

                {isEditingGdrive ? (
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="url"
                      placeholder="貼上你的 Google Drive 資料夾或檔案共用連結"
                      value={tempGdriveInput}
                      onChange={(e) => setTempGdriveInput(e.target.value)}
                      className="flex-1 text-[11px] px-2 py-1 rounded-lg border border-sky-200 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-400"
                    />
                    <button
                      onClick={() => {
                        StoryStorageService.setGoogleDriveApkUrl(tempGdriveInput);
                        setGdriveUrl(tempGdriveInput);
                        setIsEditingGdrive(false);
                      }}
                      className="p-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shrink-0"
                      title="儲存"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : gdriveUrl ? (
                  <a
                    href={gdriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-sky-200 text-sky-700 hover:text-sky-800 text-[11px] font-medium transition-colors"
                  >
                    <span className="truncate max-w-[220px]">開啟你的 Google Drive 存放區</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <p className="text-[10px] text-slate-500 leading-tight">
                    可點擊「設定雲端網址」填入你的 Google Drive 連結，日後便能一鍵開啟或分享。
                  </p>
                )}
              </div>

              {/* GitHub Actions Link */}
              <a
                href="https://github.com/richardmoore2005414-netizen/lala-story-lab/actions"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1 py-1.5 text-slate-500 hover:text-slate-700 text-[11px] transition-colors"
              >
                <span>查看 GitHub Actions 自動編譯紀錄</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-200"
                >
                  立即喚起系統安裝
                </button>
              )}
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
