import JSZip from 'jszip';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { Character, CorpusItem, StoryMessage } from '../types/story';
import { INITIAL_CHARACTERS } from '../data/initialCorpus';

// Set up PDF worker safely for client browser / webview
if (typeof window !== 'undefined' && pdfjs?.GlobalWorkerOptions) {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  } catch (e) {
    console.warn('Could not set workerSrc on global options:', e);
  }
}

export interface ParsedBookData {
  success: boolean;
  totalFilesCount: number;
  backgroundFilesCount: number;
  dialogueFilesCount: number;
  filesSummary: {
    name: string;
    isBackground: boolean;
    isDialogue: boolean;
    size: number;
  }[];
  detectedCharacters: Character[];
  corpusItems: CorpusItem[];
  dialogueMessages: StoryMessage[];
}

/**
 * Checks if a string contains mostly readable Unicode characters (not binary mojibake/亂碼).
 */
function isCleanReadableText(text: string): boolean {
  if (!text || text.length === 0) return false;
  // Count readable characters (alphanumeric, punctuation, CJK Chinese characters, whitespace)
  const readableRegex = /[\w\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef.,!?'"():;\-——「」『』、《》〈〉]/g;
  const matches = text.match(readableRegex);
  if (!matches) return false;
  const ratio = matches.length / text.length;
  return ratio > 0.75;
}

/**
 * Extracts plain text from a PDF ArrayBuffer or Uint8Array using pdfjs.
 * Strictly avoids binary decode fallbacks that cause 亂碼.
 */
export async function extractTextFromPdfData(data: Uint8Array): Promise<string> {
  try {
    if (typeof window !== 'undefined' && pdfjs?.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    }

    const loadingTask = pdfjs.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
      cMapPacked: true,
    });
    const doc = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);
      fullText += strings.join(' ') + '\n';
    }

    const cleaned = fullText.trim();
    if (cleaned.length > 0 && isCleanReadableText(cleaned)) {
      return cleaned;
    }
  } catch (err) {
    console.warn('pdfjs parser error on document:', err);
  }

  // Never return raw binary stream bytes as text to avoid mojibake (亂碼)
  return '';
}

/**
 * Helper to match a file name or content to one of the 9 canonical characters:
 * lala, adam, daniel, leon, rave, amy, jiuge, fuye, ben
 */
function matchCanonCharacterId(name: string, contentSnippet: string): string | null {
  const lowerName = name.toLowerCase();
  const lowerContent = contentSnippet.toLowerCase().slice(0, 300);

  if (lowerName.includes('adam') || name.includes('Adam') || name.includes('養子')) return 'adam';
  if (lowerName.includes('daniel') || name.includes('Daniel') || name.includes('丹尼爾') || lowerName.includes('stone')) return 'daniel';
  if (lowerName.includes('leon') || name.includes('Leon') || name.includes('李昂') || name.includes('seiko')) return 'leon';
  if (lowerName.includes('rave') || name.includes('Rave') || name.includes('雷偉')) return 'rave';
  if (lowerName.includes('amy') || name.includes('Amy') || name.includes('陳詠芯')) return 'amy';
  if (lowerName.includes('jiuge') || name.includes('九歌') || lowerName.includes('jiu ge')) return 'jiuge';
  if (lowerName.includes('fuye') || name.includes('傅爺') || lowerName.includes('fu ye')) return 'fuye';
  if (lowerName.includes('ben') || name.includes('Ben') || name.includes('伴遊')) return 'ben';
  if (lowerName.includes('lala') || name.includes('Lala') || name.includes('楊樂兒') || name.includes('主角')) return 'lala';

  if (lowerContent.includes('adam') || lowerContent.includes('法定養子')) return 'adam';
  if (lowerContent.includes('daniel') || lowerContent.includes('daniel stone')) return 'daniel';
  if (lowerContent.includes('leon') || lowerContent.includes('李昂')) return 'leon';
  if (lowerContent.includes('rave') || lowerContent.includes('雷偉')) return 'rave';
  if (lowerContent.includes('amy') || lowerContent.includes('陳詠芯')) return 'amy';
  if (lowerContent.includes('九歌')) return 'jiuge';
  if (lowerContent.includes('傅爺')) return 'fuye';
  if (lowerContent.includes('伴遊') || lowerContent.includes('lala姐姐')) return 'ben';
  if (lowerContent.includes('楊樂兒') || lowerContent.includes('佳士得')) return 'lala';

  return null;
}

/**
 * Client-side parser for Kindroid Book ZIP archive or single PDF/TXT files.
 * Runs completely on-device in browser / Android phone without requiring server.
 * Preserves ALL 9 canonical characters: Lala, Adam, Daniel, Leon, Rave, Amy, Jiuge, Fuye, Ben.
 */
export async function parseBookArchiveOnClient(file: File): Promise<ParsedBookData> {
  const isZip = file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip');
  const extractedFiles: {
    name: string;
    content: string;
    isBackground: boolean;
    isDialogue: boolean;
  }[] = [];

  if (isZip) {
    const zip = new JSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zipContent = await zip.loadAsync(arrayBuffer);
    const fileNames = Object.keys(zipContent.files);

    for (const relPath of fileNames) {
      const entry = zipContent.files[relPath];
      if (entry.dir) continue;
      if (relPath.includes('__MACOSX') || relPath.startsWith('.') || relPath.includes('/.')) continue;

      const lower = relPath.toLowerCase();
      let content = '';

      try {
        if (lower.endsWith('.pdf')) {
          const pdfBytes = await entry.async('uint8array');
          content = await extractTextFromPdfData(pdfBytes);
        } else if (
          lower.endsWith('.txt') ||
          lower.endsWith('.md') ||
          lower.endsWith('.json') ||
          lower.endsWith('.story') ||
          lower.endsWith('.csv')
        ) {
          const raw = await entry.async('string');
          if (isCleanReadableText(raw)) {
            content = raw;
          }
        }
      } catch (err) {
        console.warn(`Could not read entry ${relPath} from zip:`, err);
      }

      if (content && content.trim().length > 0) {
        const lowerName = relPath.toLowerCase();
        const isBackground =
          relPath.includes('背景') ||
          lowerName.includes('background') ||
          lowerName.includes('profile') ||
          lowerName.includes('設定') ||
          content.slice(0, 300).includes('背景');

        const isDialogue =
          relPath.includes('對話') ||
          lowerName.includes('dialogue') ||
          lowerName.includes('chat') ||
          lowerName.includes('對白') ||
          lowerName.includes('conversation');

        extractedFiles.push({
          name: relPath,
          content: content.trim(),
          isBackground,
          isDialogue: !isBackground && isDialogue,
        });
      }
    }
  } else if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const content = await extractTextFromPdfData(new Uint8Array(arrayBuffer));
    if (content && content.trim().length > 0) {
      extractedFiles.push({
        name: file.name,
        content: content.trim(),
        isBackground: file.name.includes('背景') || content.slice(0, 300).includes('背景'),
        isDialogue: file.name.includes('對話'),
      });
    }
  } else {
    // Plain text or markdown
    const content = await file.text();
    if (content && isCleanReadableText(content)) {
      extractedFiles.push({
        name: file.name || '原著文字.txt',
        content: content.trim(),
        isBackground: file.name.includes('背景') || content.slice(0, 300).includes('背景'),
        isDialogue: file.name.includes('對話'),
      });
    }
  }

  if (extractedFiles.length === 0) {
    throw new Error('未能在檔案中提取到任何有效文字內容，請確認 ZIP 壓縮包內包含 PDF 或文字檔案，或檔案未被密碼加密。');
  }

  // Separate background files and dialogue files
  const bgFiles = extractedFiles.filter(f => f.isBackground);
  const dialogueFiles = extractedFiles.filter(f => f.isDialogue || !f.isBackground);

  // START WITH ALL 9 CANONICAL CHARACTERS PRESERVED INTACT
  const detectedCharacters: Character[] = INITIAL_CHARACTERS.map(c => ({
    ...c,
    stats: { ...c.stats },
    memoryTags: [...(c.memoryTags || [])],
  }));

  const corpusItems: CorpusItem[] = [];
  const now = Date.now();

  // Process each background file from ZIP and match to canonical character or create new one
  for (const bg of bgFiles) {
    const matchedId = matchCanonCharacterId(bg.name, bg.content);
    if (matchedId) {
      const existing = detectedCharacters.find(c => c.id === matchedId);
      if (existing) {
        // Update background with actual content from book file
        existing.background = bg.content;
      }
    } else {
      // Dynamic extra character in the zip
      const cleanName = bg.name.replace(/\.[^/.]+$/, '').replace(/[_\-\s]*背景[_\-\s]*/g, '').trim();
      if (cleanName && cleanName.length < 15 && !cleanName.includes('/') && !cleanName.includes('\\')) {
        const charId = `char_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        if (!detectedCharacters.find(c => c.id === charId)) {
          detectedCharacters.push({
            id: charId,
            name: cleanName,
            englishName: cleanName,
            title: '',
            avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            avatarInitial: cleanName.slice(0, 2),
            gender: 'other',
            tagline: '',
            personality: '100% 來自本書檔案背景，不擅自定位。',
            background: bg.content,
            speechStyle: '遵循本書原著風格。',
            relationshipWithLala: '取自本書背景記錄',
            stats: { affection: 60, trust: 60, tension: 20, intimacyStage: '審慎試探', currentMindset: '載入原著背景。' },
            memoryTags: ['原著角色'],
          });
        }
      }
    }

    // Add to corpus as verified background
    corpusItems.push({
      id: `corpus_book_bg_${now}_${corpusItems.length}`,
      title: `【原著背景檔案 · 唯一依據】${bg.name}`,
      category: 'character',
      content: bg.content,
      tags: ['原著背景', '禁止篡改', bg.name],
      isActive: true,
      updatedAt: now,
    });
  }

  // Process dialogue files into messages
  const dialogueMessages: StoryMessage[] = [];
  for (const df of dialogueFiles) {
    corpusItems.push({
      id: `corpus_book_dlg_${now}_${corpusItems.length}`,
      title: `【原著對話記錄 · 唯一依據】${df.name}`,
      category: 'worldview',
      content: df.content.slice(0, 15000),
      tags: ['原著對話', '既定事實', df.name],
      isActive: true,
      updatedAt: now,
    });

    const lines = df.content.split('\n').filter((l: string) => l.trim().length > 0);
    for (const line of lines.slice(-25)) {
      if (line.includes('：') || line.includes(':')) {
        const parts = line.split(/[：:]/);
        const speakerName = parts[0].trim();
        const content = parts.slice(1).join('：').trim();
        if (content && isCleanReadableText(content)) {
          const matchedChar = detectedCharacters.find(c =>
            c.name.toLowerCase() === speakerName.toLowerCase() ||
            c.englishName?.toLowerCase().includes(speakerName.toLowerCase())
          );
          const isLala = speakerName.includes('啦啦') || speakerName.toLowerCase() === 'lala' || speakerName.includes('樂兒');
          const senderId = isLala ? 'lala' : (matchedChar ? matchedChar.id : 'other');

          dialogueMessages.push({
            id: `msg_book_${now}_${dialogueMessages.length}`,
            senderId,
            senderName: isLala ? 'Lala' : speakerName,
            senderColor: isLala
              ? 'bg-rose-100 text-rose-700 border-rose-200'
              : (matchedChar?.avatarColor || 'bg-slate-100 text-slate-800 border-slate-200'),
            content,
            stageAction: '原著文本記載對話',
            timestamp: now - (100 - dialogueMessages.length) * 1000,
            type: 'dialogue',
            nodeId: 'node_root',
            branchId: 'node_root',
          });
        }
      }
    }
  }

  return {
    success: true,
    totalFilesCount: extractedFiles.length,
    backgroundFilesCount: bgFiles.length,
    dialogueFilesCount: dialogueFiles.length,
    filesSummary: extractedFiles.map(f => ({
      name: f.name,
      isBackground: f.isBackground,
      isDialogue: f.isDialogue,
      size: f.content.length,
    })),
    detectedCharacters,
    corpusItems,
    dialogueMessages: dialogueMessages.slice(-30),
  };
}
