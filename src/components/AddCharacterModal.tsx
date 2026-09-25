import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Character, Gender, StorySession } from '../types/story';
import { StoryStorageService } from '../services/storage';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  session: StorySession;
  onSessionChange: (session: StorySession) => void;
  onRefreshData: () => void;
}

const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-teal-100 text-teal-700 border-teal-200',
];

export const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [title, setTitle] = useState('');
  const [gender, setGender] = useState<Gender>('other');
  const [tagline, setTagline] = useState('');
  const [personality, setPersonality] = useState('');
  const [background, setBackground] = useState('');
  const [speechStyle, setSpeechStyle] = useState('');
  const [relationshipWithLala, setRelationshipWithLala] = useState('');
  const [colorIndex, setColorIndex] = useState(0);

  if (!isOpen) return null;

  const reset = () => {
    setName('');
    setEnglishName('');
    setTitle('');
    setGender('other');
    setTagline('');
    setPersonality('');
    setBackground('');
    setSpeechStyle('');
    setRelationshipWithLala('');
    setColorIndex(0);
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    StoryStorageService.addCharacter({
      name: trimmed,
      englishName: englishName.trim(),
      title: title.trim() || '人物',
      avatarColor: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length],
      avatarInitial: trimmed[0],
      gender,
      tagline: tagline.trim(),
      personality: personality.trim(),
      background: background.trim(),
      speechStyle: speechStyle.trim(),
      relationshipWithLala: relationshipWithLala.trim(),
      isCustom: true,
    });

    onRefreshData();
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4">
      <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200">
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <UserPlus className="w-4 h-4 text-sky-500" />
            新增角色
          </div>
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div>
            <label className="block font-medium text-slate-700 mb-1">角色名稱 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：Adam"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">英文名</label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="optional"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">稱謂 / 頭銜</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：法定養子"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">性別</label>
            <div className="flex gap-2">
              {([
                ['female', '女'],
                ['male', '男'],
                ['other', '其他'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGender(value)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-medium transition ${
                    gender === value
                      ? 'bg-sky-50 border-sky-300 text-sky-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">頭像色</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorIndex(i)}
                  className={`w-8 h-8 rounded-full border-2 ${c} ${
                    colorIndex === i ? 'ring-2 ring-sky-400 ring-offset-1' : ''
                  }`}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">一句話定位</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="角色標語..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">與啦啦的關係</label>
            <input
              type="text"
              value={relationshipWithLala}
              onChange={(e) => setRelationshipWithLala(e.target.value)}
              placeholder="例如：法定養子、青梅竹馬..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">性格</label>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              rows={2}
              placeholder="性格特點..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">說話風格</label>
            <input
              type="text"
              value={speechStyle}
              onChange={(e) => setSpeechStyle(e.target.value)}
              placeholder="語氣、用詞習慣..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">背景</label>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              rows={2}
              placeholder="身世、經歷..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-sm"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm disabled:opacity-40"
          >
            確認新增
          </button>
        </div>
      </div>
    </div>
  );
};
