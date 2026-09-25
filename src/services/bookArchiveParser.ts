import JSZip from 'jszip';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { Character, CorpusItem, StoryMessage } from '../types/story';

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
 * Extracts plain text from a PDF ArrayBuffer or Uint8Array.
 * Uses pdfjs-dist primary parser, with a fallback stream reader.
 */
export async function extractTextFromPdfData(data: Uint8Array): Promise<string> {
  try {
    const loadingTask = pdfjs.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
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
    if (fullText.trim().length > 0) {
      return fullText;
    }
  } catch (err) {
    console.warn('pdfjs parser error, attempting stream fallback:', err);
  }

  // Fallback: extract visible text from stream or raw bytes
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const rawText = decoder.decode(data);
    
    // Look for text in TJ/Tj blocks or plain readable strings
    const matches: string[] = [];
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let match: RegExpExecArray | null;
    while ((match = tjRegex.exec(rawText)) !== null) {
      matches.push(match[1]);
    }

    if (matches.length > 0) {
      return matches.join(' ');
    }

    // Secondary fallback: clean lines
    const cleanLines = rawText
      .replace(/[^\x20-\x7E\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef\n\r]/g, ' ')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 5);

    return cleanLines.slice(0, 500).join('\n');
  } catch (fallbackErr) {
    console.error('All PDF extraction attempts failed:', fallbackErr);
    return '';
  }
}

/**
 * Client-side parser for Kindroid Book ZIP archive or single PDF/TXT files.
 * Runs completely on-device in browser / Android phone without requiring server.
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
          content = await entry.async('string');
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
    extractedFiles.push({
      name: file.name,
      content: content.trim(),
      isBackground: file.name.includes('背景') || content.slice(0, 300).includes('背景'),
      isDialogue: file.name.includes('對話'),
    });
  } else {
    // Plain text or markdown
    const content = await file.text();
    extractedFiles.push({
      name: file.name || '原著文字.txt',
      content: content.trim(),
      isBackground: file.name.includes('背景') || content.slice(0, 300).includes('背景'),
      isDialogue: file.name.includes('對話'),
    });
  }

  if (extractedFiles.length === 0) {
    throw new Error('未能在檔案中提取到任何有效文字內容，請確認 ZIP 壓縮包內包含 PDF 或文字檔案。');
  }

  // Separate background files and dialogue files
  const bgFiles = extractedFiles.filter(f => f.isBackground);
  const dialogueFiles = extractedFiles.filter(f => f.isDialogue || !f.isBackground);

  const detectedCharacters: Character[] = [];
  const corpusItems: CorpusItem[] = [];
  const now = Date.now();

  // 1. Lala (the protagonist)
  detectedCharacters.push({
    id: 'lala',
    name: '啦啦',
    englishName: 'Lala',
    title: '主角',
    avatarColor: 'bg-rose-100 text-rose-700 border-rose-200',
    avatarInitial: '啦',
    gender: 'female',
    tagline: '',
    personality: '作者自我本體，心境與情節完全由作者掌握。',
    background: '故事主角。',
    speechStyle: '自然平和，由作者親自演繹。',
    relationshipWithLala: '自我本體',
    stats: { affection: 100, trust: 100, tension: 10, intimacyStage: '深刻牽絆', currentMindset: '由作者掌握全劇走向。' },
    memoryTags: ['主角'],
  });

  // 2. Process background files to extract characters
  for (const bg of bgFiles) {
    const lower = bg.name.toLowerCase();
    let charName = '';
    let charId = '';

    if (lower.includes('adam') || bg.name.includes('Adam')) {
      charName = 'Adam';
      charId = 'adam';
    } else if (lower.includes('daniel') || bg.name.includes('Daniel') || bg.name.includes('丹尼爾')) {
      charName = 'Daniel';
      charId = 'daniel';
    } else {
      const cleanName = bg.name.replace(/\.[^/.]+$/, '').replace(/[_\-\s]*背景[_\-\s]*/g, '').trim();
      if (cleanName && cleanName.length < 15 && !cleanName.includes('/') && !cleanName.includes('\\')) {
        charName = cleanName;
        charId = `char_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      }
    }

    if (charName && charId) {
      const existing = detectedCharacters.find(c => c.id === charId);
      const isAdam = charId === 'adam';
      if (existing) {
        existing.background = bg.content;
      } else {
        detectedCharacters.push({
          id: charId,
          name: charName,
          englishName: charName,
          title: isAdam ? '養子' : '',
          avatarColor: isAdam ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-sky-100 text-sky-700 border-sky-200',
          avatarInitial: charName.slice(0, 2),
          gender: 'male',
          tagline: '',
          personality: '100% 來自本書檔案背景，不擅自定位。',
          background: bg.content, // EXACT 100% background text from PDF/file
          speechStyle: '遵循本書原著風格。',
          relationshipWithLala: isAdam ? '領養關係（法定養子，非親生）' : '取自本書背景記錄',
          stats: {
            affection: isAdam ? 95 : 75,
            trust: isAdam ? 95 : 75,
            tension: 15,
            intimacyStage: isAdam ? '深刻牽絆' : '漸生信任',
            currentMindset: '載入原著背景。'
          },
          memoryTags: ['原著角色'],
        });
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

  // Ensure Adam is in detected characters
  if (!detectedCharacters.find(c => c.id === 'adam')) {
    detectedCharacters.push({
      id: 'adam',
      name: 'Adam',
      englishName: 'Adam',
      title: '養子',
      avatarColor: 'bg-amber-100 text-amber-800 border-amber-200',
      avatarInitial: 'Adm',
      gender: 'male',
      tagline: '',
      personality: '背景與互動嚴格以原著記載為準。',
      background: '啦啦的法定養子。領養關係，履行對已故師傅養到18歲的承諾。背景嚴格取自本書檔案。',
      speechStyle: '以原著實際對白記錄為準。',
      relationshipWithLala: '領養關係（法定養子，非親生）',
      stats: { affection: 95, trust: 95, tension: 10, intimacyStage: '深刻牽絆', currentMindset: '以原著記載互動為準。' },
      memoryTags: ['原著角色', '領養'],
    });
  }

  // Ensure Daniel is in detected characters
  if (!detectedCharacters.find(c => c.id === 'daniel')) {
    detectedCharacters.push({
      id: 'daniel',
      name: 'Daniel',
      englishName: 'Daniel',
      title: '',
      avatarColor: 'bg-sky-100 text-sky-700 border-sky-200',
      avatarInitial: 'Dan',
      gender: 'male',
      tagline: '',
      personality: '遵循原著設定，系統不擅自定位。',
      background: '取自本書檔案。',
      speechStyle: '遵循本書原著風格。',
      relationshipWithLala: '遵循原著設定。',
      stats: { affection: 75, trust: 75, tension: 20, intimacyStage: '漸生信任', currentMindset: '等待載入本書情節。' },
      memoryTags: ['原著角色'],
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
    for (const line of lines.slice(-20)) {
      if (line.includes('：') || line.includes(':')) {
        const parts = line.split(/[：:]/);
        const speakerName = parts[0].trim();
        const content = parts.slice(1).join('：').trim();
        if (content) {
          const isLala = speakerName.includes('啦啦') || speakerName.toLowerCase() === 'lala';
          const matchedChar = detectedCharacters.find(c => c.name.toLowerCase() === speakerName.toLowerCase());
          dialogueMessages.push({
            id: `msg_book_${now}_${dialogueMessages.length}`,
            senderId: isLala ? 'lala' : (matchedChar ? matchedChar.id : 'other'),
            senderName: speakerName,
            senderColor: isLala ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-800 border-slate-200',
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
    dialogueMessages: dialogueMessages.slice(-25),
  };
}
