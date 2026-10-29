import React, { useState } from 'react';
import { Search, Volume2, Copy, Check, Play, BookOpen } from 'lucide-react';
import { VOCAB_ROUNDS, VocabPair } from '../data/vocabData';
import { sound } from '../utils/soundEffects';

interface GlossaryViewProps {
  onPlayRound: (roundId: number) => void;
  showToast: (msg: string, isSuccess?: boolean) => void;
}

interface FlattenedWord extends VocabPair {
  roundId: number;
  roundName: string;
  category: string;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onPlayRound, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  // Flatten all words with round metadata
  const allWords: FlattenedWord[] = React.useMemo(() => {
    const list: FlattenedWord[] = [];
    VOCAB_ROUNDS.forEach((r) => {
      if (r.id === 22) return; // Keep dictionary terms unique without duplicates from synthesis round
      r.pairs.forEach((p) => {
        list.push({
          ...p,
          roundId: r.id,
          roundName: r.nameVi,
          category: r.category,
        });
      });
    });
    return list;
  }, []);

  const filteredWords = allWords.filter((w) => {
    const matchCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchCategory;
    const matchSearch =
      w.en.toLowerCase().includes(term) ||
      w.vi.toLowerCase().includes(term) ||
      w.roundName.toLowerCase().includes(term);
    return matchCategory && matchSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWord(text);
    showToast(`Đã sao chép: "${text}"`, true);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const categories = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Structure', label: 'Cấu trúc' },
    { id: 'Pigments', label: 'Sắc tố' },
    { id: 'Processes', label: 'Quá trình' },
    { id: 'Energy & Molecules', label: 'Năng lượng' },
    { id: 'Plant Types', label: 'Nhóm C3/C4/CAM' },
    { id: 'Environment & Factors', label: 'Môi trường' },
    { id: 'Biomass & Yield', label: 'Năng suất' },
    { id: 'Academic Terms', label: 'Thuật ngữ' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Search Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-100 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Tra cứu nhanh
            </span>
            <h1 className="title-font text-3xl font-extrabold text-slate-800 mt-1">
              Từ Điển Thuật Ngữ Quang Hợp (140+ Từ)
            </h1>
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Hiển thị <span className="text-emerald-700 font-black">{filteredWords.length}</span> thuật ngữ
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo từ tiếng Anh, tiếng Việt hoặc chủ đề (ví dụ: Calvin, stroma, lục lạp...)"
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 shadow-xs placeholder-slate-400 text-sm sm:text-base"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scroll">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredWords.map((word, i) => (
          <div
            key={`${word.en}-${i}`}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {word.en}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => sound.speak(word.en)}
                    title="Nghe phát âm chuẩn"
                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(`${word.en} = ${word.vi}`)}
                    title="Sao chép từ"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copiedWord === `${word.en} = ${word.vi}` ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {word.phonetic && (
                <div className="text-xs font-mono text-emerald-600 font-medium mb-2">
                  {word.phonetic}
                </div>
              )}

              <div className="text-sm sm:text-base font-extrabold text-emerald-800 mb-2">
                {word.vi}
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Vòng {word.roundId}: {word.roundName}</span>
              <button
                onClick={() => onPlayRound(word.roundId)}
                className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
              >
                <span>Chơi</span>
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
