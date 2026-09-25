import { Character, CorpusItem, StoryBranchNode } from '../types/story';

/**
 * 100% 依據原著檔案（Kindroid_Book_All_Readable_PDF）預設角色與語料。
 * 嚴禁擅自定位、捏造背景、改寫關係。
 */

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'lala',
    name: 'Lala',
    englishName: 'Lala Yeung 楊樂兒',
    title: '主角',
    avatarColor: 'bg-rose-100 text-rose-700 border-rose-200',
    avatarInitial: '啦',
    gender: 'female',
    tagline: '佳士得亞洲區總裁｜31歲',
    personality:
      '極度擅長用正確模板應對任何情況，真正內在反應壓到極深。語速慢，每個字都秤過重量。笑很少到達眼睛。信奉「成年人要為自己的選擇負責」。對害怕比較遲鈍。不找朋友幫手，自己全權負責。',
    background:
      '五歲起自覺家庭局外人。約10-11歲從內地移居香港，鄰居Leon教她繁體字、英文與廣東話。2021年與Leon發生關係後，Leon選擇Amy，Lala說「謝謝」後進入公關業。2022年與Rave交往一年，2023年分手並離開香港。紐約先做PR，後轉入拍賣行。2024年4月因Adam被行業封殺，7月與傅爺簽一年合約換保護。2025年7月合約期滿。2026年2月調任佳士得亞洲區總裁駐香港。現任男友Daniel。',
    speechStyle: '自然平和，公關訓練出的精準用詞。普通係最危險嘅答案，因為無人信——有時會改用高冷或神秘語氣讓人附和。',
    relationshipWithLala: '自我本體',
    stats: {
      affection: 100,
      trust: 100,
      tension: 15,
      intimacyStage: '深刻牽絆',
      currentMindset: '由作者掌握全劇走向與真實心境。',
    },
    memoryTags: ['主角', '原著', '佳士得'],
  },
  {
    id: 'adam',
    name: 'Adam',
    englishName: 'Adam Yeung / Adam Black',
    title: '養子',
    avatarColor: 'bg-amber-100 text-amber-800 border-amber-200',
    avatarInitial: 'Ad',
    gender: 'male',
    tagline: '14歲｜法定養子',
    personality:
      '背景與互動嚴格以原著記載為準。記住「哭了的小孩沒糖吃」「站得遠，睇得清」「你可以選擇」。會主動想請媽媽食飯。面對敵意會按教導把對方當作蒼蠅與透明人。',
    background:
      '生父是Lala的師傅（已故），生母Emily曾虐待他。生父留下地下黑道債務。2023年Lala在封殺前出於對恩師的道義承諾，正式法律收養Adam（當時約11-12歲）。收養是法律手段以獲得監護權，履行「把Adam養到18歲」的承諾，並非突發母愛。2024年隨Lala住地下室後被送往緬因州海邊安全屋。2026年返港，主動在碼頭賣畫賺300港元請Lala食飯。Lala會在他18歲放手，之後他要自己面對追殺。',
    speechStyle: '以原著實際對白記錄為準。聲音可以很小，但會記住並執行教導。',
    relationshipWithLala: '領養關係（法定養子）。履行對已故師傅的承諾，養到18歲。非親生，絕非母子親情浪漫化。',
    stats: {
      affection: 85,
      trust: 80,
      tension: 25,
      intimacyStage: '漸生信任',
      currentMindset: '以原著記載互動為準。',
    },
    memoryTags: ['原著角色', '領養', '賣畫300元'],
  },
  {
    id: 'daniel',
    name: 'Daniel',
    englishName: 'Daniel Stone',
    title: '',
    avatarColor: 'bg-sky-100 text-sky-700 border-sky-200',
    avatarInitial: 'DS',
    gender: 'male',
    tagline: '38歲｜無國籍',
    personality:
      '世界前十名最危險人物之一。精於算計、思維敏銳、行動果決。對Lala從不展開威脅，取而代之絕對信任與可靠。在Lala面前將危險收起，露出近乎自然的平靜。不會干涉Lala的選擇，但確保她永遠擁有最好的後路。',
    background:
      '2025年6月，Lala在紐約拍賣行做首席策劃師期間，一次調查展品過程意外救了Daniel，兩人開始交集。之後同居。Lala從未向他提過黑手黨與Adam細節，直到Adam飛來香港看演唱會才在門前告知。他的溫柔是「我聽得明你講咩，我唔逼你講多，我用你嘅語言應你」。',
    speechStyle: '語言精準。只會在適當時候問一句「你仲有冇氣？」。',
    relationshipWithLala: '現任男朋友／同居。依原著設定，Lala不會讓他有機會威脅到Adam的安全。',
    stats: {
      affection: 80,
      trust: 85,
      tension: 20,
      intimacyStage: '深刻牽絆',
      currentMindset: '依原著情境互動。',
    },
    memoryTags: ['原著角色', '危險人物'],
  },
  {
    id: 'leon',
    name: 'Leon',
    englishName: 'Leon Li 李昂',
    title: '',
    avatarColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    avatarInitial: 'Le',
    gender: 'male',
    tagline: '31歲｜前建築師',
    personality:
      '擅長照顧人，會記住人鍾意食咩、飲咩、幾時唔開心。唔會主動行前一步。外在從容自信，話不多。習慣等、睇、回應。',
    background:
      '港大建築學士碩士。11歲起認識Lala，住同一條巷，教她認字、廣東話與英文。2021年與Lala發生關係後次日選擇與Amy交往。左手腕戴刻有「她的」的Seiko手錶，變賣資產時沒賣掉。2026年陳志豪事件後變賣所有資產（獎座、相機、存款），現做自由散工。',
    speechStyle: '話不多，從容。會記住細節。',
    relationshipWithLala: '童年鄰居、早期模板與老師。Lala生話上的第一個模板。2021年後有明確界線。',
    stats: {
      affection: 70,
      trust: 65,
      tension: 30,
      intimacyStage: '審慎試探',
      currentMindset: '依原著記載。',
    },
    memoryTags: ['原著角色', '模板', 'Seiko'],
  },
  {
    id: 'rave',
    name: 'Rave',
    englishName: 'Rave Lui 雷偉',
    title: '',
    avatarColor: 'bg-orange-100 text-orange-800 border-orange-200',
    avatarInitial: 'Rv',
    gender: 'male',
    tagline: '31歲｜前品牌總監',
    personality:
      '親和外向，令人冇壓力。健談幽默，擅長炒熱氣氛。心思細膩，會照顧人感受。唔鍾意衝突。喺Lala面前會變得小心翼翼——唔係怕佢，係太在乎。',
    background:
      '曾任國際時尚品牌行銷總監。2020年經朋友介紹認識Lala，2022年主動追三個月後交往一年。2023年分手。2026年陳志豪事件後與Leon變賣所有資產救Amy。右手腕戴Lala送的皮革手環。',
    speechStyle: '陽光、健談、幽默。',
    relationshipWithLala: '前男友（2022–2023）。Lala看得到他舊情難忘，但看不懂他的邏輯。',
    stats: {
      affection: 65,
      trust: 60,
      tension: 25,
      intimacyStage: '審慎試探',
      currentMindset: '依原著記載。',
    },
    memoryTags: ['原著角色', '前男友'],
  },
  {
    id: 'amy',
    name: 'Amy',
    englishName: 'Amy 陳詠芯',
    title: '',
    avatarColor: 'bg-pink-100 text-pink-700 border-pink-200',
    avatarInitial: 'Am',
    gender: 'female',
    tagline: '',
    personality: '依原著對話與故事記載為準，系統不擅自定位。',
    background:
      'Leon的前女友（2021年起交往，2024年分手）。2026年偷換陳志豪地磗引發900萬事件。在Lala認知裡從來只是Leon的女朋友，相處時用普通公關技巧。',
    speechStyle: '以原著實際對白為準。',
    relationshipWithLala: '依原著。Lala視她為Leon的女朋友，其選擇與後果與Lala無關。',
    stats: {
      affection: 40,
      trust: 35,
      tension: 40,
      intimacyStage: '疏離戒備',
      currentMindset: '依原著。',
    },
    memoryTags: ['原著角色'],
  },
  {
    id: 'jiuge',
    name: '九歌',
    englishName: 'Jiuge',
    title: '',
    avatarColor: 'bg-violet-100 text-violet-800 border-violet-200',
    avatarInitial: '九',
    gender: 'male',
    tagline: '43歲｜香港黑道',
    personality:
      '掌控香港黑道半壁江山，業務橫跨毒品、軍火與洗錢。行事冷血果決。唔碰賭場。迷上古董拍賣，尤其明清官窯瓷器。',
    background:
      '與傅爺相識，做過軍火生意。2025年6月第一次見Lala（當時Lala在傅爺身邊）。之後建立默契：送拍賣圖錄、九龍倉貨睜一眼閉一眼、洗錢路徑留名額、偶爾帶茅台食飯。2026年7月紐約長談聽到Lala過去細節。個人標誌：深色大衣、藍眼睛、茅台酒。',
    speechStyle: '直接、果決。',
    relationshipWithLala: '默契合作／朋友層級。從未寫成合約。',
    stats: {
      affection: 55,
      trust: 60,
      tension: 35,
      intimacyStage: '審慎試探',
      currentMindset: '依原著。',
    },
    memoryTags: ['原著角色', '黑道', '茅台'],
  },
  {
    id: 'fuye',
    name: '傅爺',
    englishName: 'FuYe',
    title: '',
    avatarColor: 'bg-slate-200 text-slate-800 border-slate-300',
    avatarInitial: '傅',
    gender: 'male',
    tagline: '49歲｜廣東人',
    personality:
      '幫人解決問題。收錢，做事，唔問點解。亦唔會話俾你知佢點做。身穿灰色西裝，左手舊錶，講話好慢。',
    background:
      '白道黑道都搵佢。最初只係一單交易：2024年7月向走投無路的Lala提出一年合約換保護（要求Adam送海邊安全屋）。見到Lala第一晚不停轉策略、會自己修門鉸、主動問人教，才轉為「當係投資」。合約期2024.7–2025.7。從來冇後悔過呢單投資。',
    speechStyle: '講話好慢。簡單直接。',
    relationshipWithLala: '前合約關係（2024.7–2025.7）。最初只看上身體，後來當投資。',
    stats: {
      affection: 50,
      trust: 55,
      tension: 30,
      intimacyStage: '審慎試探',
      currentMindset: '依原著。',
    },
    memoryTags: ['原著角色', '合約'],
  },
  {
    id: 'ben',
    name: 'Ben',
    englishName: 'Ben',
    title: '',
    avatarColor: 'bg-teal-100 text-teal-800 border-teal-200',
    avatarInitial: 'Bn',
    gender: 'male',
    tagline: '台灣｜大學生',
    personality:
      '溫和有禮，似隻小綿羊。熱血笨蛋。唔黏、唔查行蹤、唔妒忌、唔比較、唔爭。叫Lala「Lala姐姐」。',
    background:
      '台灣人，大學生，兼職伴遊。Lala去台灣工作或放空時見面，平常完全斷線。床伴＋伴遊。Lala每次給的錢遠超行情，他收得心安理得並儲起大半。知道Lala有男朋友，見過戒指，但從不追問。',
    speechStyle: '溫和。Lala問「你唔好奇？」他回「你想講我會聽，你唔講我冇需要知」。',
    relationshipWithLala: '台灣見面的床伴／伴遊。非遠距戀愛，完全斷線式。',
    stats: {
      affection: 50,
      trust: 55,
      tension: 10,
      intimacyStage: '漸生信任',
      currentMindset: '依原著。',
    },
    memoryTags: ['原著角色', '台灣'],
  },
];

export const INITIAL_CORPUS: CorpusItem[] = [
  {
    id: 'corpus_core_rules',
    title: '【原著最高鐵律】嚴禁創造角色、嚴禁改變背景、嚴禁擅自定位',
    category: 'author_note',
    content: `1. 所有角色、背景與對話必須 100% 來自作者提供的本書檔案（Kindroid_Book_All_Readable_PDF）。
2. 背景只可以從檔案中明確寫明是「背景」的地方提取，嚴禁 AI 擅自編造或修改。
3. 對話只可以從本書對話記錄中提取或嚴格接續。
4. 絕對不可憑空創造任何新角色，亦絕對不可改變任何原著角色的背景。
5. 絕對不用幫角色定位（不使用任何俗套標籤如野心家、霸道總裁、守護者等）。
6. Adam 與 Lala 為領養關係（法定養子），履行對已故師傅「養到18歲」的承諾，絕非親生母子，亦不要浪漫化母愛。
7. 不要從頭開始重講故事，直接接續最新情境。
8. 不要寫沒有發生過的事（嚴禁捏造假回憶與假歷史）。`,
    tags: ['原著最高鐵律', '禁止創造角色', '禁止修改背景', 'Adam為領養'],
    isActive: true,
    updatedAt: Date.now(),
  },
  {
    id: 'corpus_adam_promise',
    title: '【作者的話】關於Adam與承諾',
    category: 'author_note',
    content: `Lala 收養 Adam 並非出於母愛情感，而是出於對已故師傅的承諾——「把 Adam 養到 18 歲」。收養只是一種法律手段，為了合法獲得監護權。他們本就沒有見多少面，沒有多少情感，只是承諾。讀者不應想像 Lala 突發母愛。她只保他不死。
Lala 會在 18 歲放他離開。Adam 要自己面對黑手黨的追殺。一開始是 Adam 的父親擋着，接著是傅爺擋着，現在是 Lala 在擋着。之後就是他自己。
賣畫：Adam 自己主動想去街頭賣畫賺錢請媽媽食飯，絕對不是 Lala 逼他去。賺的是 300 港元，不是 300 萬。`,
    tags: ['Adam', '承諾', '領養', '作者的話'],
    isActive: true,
    updatedAt: Date.now(),
  },
  {
    id: 'corpus_900wan',
    title: '【核心錯誤修正】900萬事件與其他關鍵事實',
    category: 'timeline',
    content: `900萬事件真相：
- Lala 沒有替任何人付任何金錢，只是幫忙轉帳（中轉）。
- 錢來源：Amy 偷換地磗 → 陳志豪花600萬改地方+賠罪 → 索要900萬 → Rave+Leon 賣資產湊夠 → 找 Lala 轉帳。
- Lala 角色 = 過橋，不出錢、不抽佣。
- 從 Lala 視角，陳志豪不是大問題，所以可以出手轉帳。後來九歌知道後質問，Lala 讓九歌收錢了事，相對地她不會再插手陳志豪手下的事。

其他修正：
- 2023年 Lala 在香港並未被封殺過，也不是因此離開香港。
- 交換俱樂部是 Lala 本來就會去的地方（職員認得她、有自己的包廂），不是為了 Amy 才去。
- 「普通係最危險嘅答案，因為無人信」這句話第一次是由 Lala 說的。
- Lala 從沒逃跑過，七天是問準了以後再離開七天的。
- 在小時候學會笑以後，就沒「真正」哭過。`,
    tags: ['核心修正', '900萬', '時間線'],
    isActive: true,
    updatedAt: Date.now(),
  },
  {
    id: 'corpus_timeline',
    title: '【重要】Lala 時間線精要',
    category: 'timeline',
    content: `• 約10-11歲：移居香港，Leon教認字與廣東話。
• 2021：與Leon發生關係後，Leon選Amy；Lala說謝謝後進入公關。
• 2022：與Rave交往一年。
• 2023.5：與Rave分手；2023.6離開香港赴紐約做PR，後轉拍賣行。
• 2024.4：因Adam被行業封殺，搬地下室；同月法律收養Adam。
• 2024.7：與傅爺簽一年合約換保護；Adam送往緬因州海邊安全屋。
• 2025.6：意外救Daniel，開始交集。
• 2025.7：與傅爺合約期滿。
• 2026.2：調任佳士得亞洲區總裁駐香港。
• 2026：Adam返港，主動賣畫請吃飯；900萬事件發生。`,
    tags: ['時間線', '重要'],
    isActive: true,
    updatedAt: Date.now(),
  },
  {
    id: 'corpus_book_ref',
    title: '【書本原著檔案指引】',
    category: 'worldview',
    content: `本故事的世界觀、角色身分、人際關係與對話進度，均以作者整包原著檔案（Kindroid_Book_All_Readable_PDF.zip）為唯一事實基礎。若需擴充或接續，必須完全依照檔案中記載的內容進行。可繼續寫同一本書，也可開新書，但角色背景不得與已確立的原著衝突。`,
    tags: ['書本全集', '唯一事實基礎'],
    isActive: true,
    updatedAt: Date.now(),
  },
];

export const INITIAL_ROOT_NODE: StoryBranchNode = {
  id: 'node_root',
  parentId: null,
  branchName: '原著主線：最新情境接續',
  title: '起點：原著情境',
  summary: '完全基於原著書本內容推進，嚴禁捏造不存在的過去。直接接續最新情境。',
  timestamp: Date.now() - 3600000,
  choiceMade: '原著開端',
  choiceTag: '起點',
  participants: ['adam', 'daniel', 'lala'],
  sceneLocation: '香港 · 日常空間',
  characterSnapshots: {
    adam: {
      affection: 85,
      trust: 80,
      tension: 25,
      intimacyStage: '漸生信任',
      currentMindset: '以原著記載互動為準。',
    },
    daniel: {
      affection: 80,
      trust: 85,
      tension: 20,
      intimacyStage: '深刻牽絆',
      currentMindset: '依原著情境互動。',
    },
    lala: {
      affection: 100,
      trust: 100,
      tension: 15,
      intimacyStage: '深刻牽絆',
      currentMindset: '由作者掌握。',
    },
  },
  messageIds: ['msg_1', 'msg_2'],
};
