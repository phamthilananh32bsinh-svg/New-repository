import React, { useState } from 'react';
import { ArrowRightLeft, CheckCircle2, Trophy, Play, Star, BookOpen, Layers } from 'lucide-react';
import { VOCAB_ROUNDS, VocabRound } from '../data/vocabData';

interface RoundSelectorProps {
  completedRounds: number[];
  roundHighScores: Record<number, number>;
  totalScore: number;
  playerName: string;
  gameMode: 'en-vi' | 'vi-en';
  onGameModeChange: (mode: 'en-vi' | 'vi-en') => void;
  onSelectRound: (round: VocabRound) => void;
  onOpenLeaderboard: () => void;
  onSaveAndExit: () => void;
  onSwitchToFlashcards: (roundId?: number) => void;
}

export const RoundSelector: React.FC<RoundSelectorProps> = ({
  completedRounds,
  roundHighScores,
  totalScore,
  playerName,
  gameMode,
  onGameModeChange,
  onSelectRound,
  onOpenLeaderboard,
  onSaveAndExit,
  onSwitchToFlashcards,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: `Tất cả (${VOCAB_ROUNDS.length} Vòng)` },
    { id: 'Synthesis', label: '⭐ Vòng Tổng Hợp' },
    { id: 'Structure', label: 'Cấu trúc tế bào & Lá' },
    { id: 'Pigments', label: 'Sắc tố quang hợp' },
    { id: 'Processes', label: 'Pha sáng & Calvin' },
    { id: 'Energy & Molecules', label: 'Năng lượng & ATP' },
    { id: 'Plant Types', label: 'C3, C4 & CAM' },
    { id: 'Environment & Factors', label: 'Yếu tố môi trường' },
    { id: 'Biomass & Yield', label: 'Năng suất cây trồng' },
    { id: 'Academic Terms', label: 'Thuật ngữ & Cụm từ' },
  ];

  const filteredRounds = VOCAB_ROUNDS.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  const completionPercent = Math.round((completedRounds.length / VOCAB_ROUNDS.length) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Top Banner / Progress Overview */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-100 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200/60">
              🌱 Biology 11 · Photosynthesis
            </div>
            <h1 className="title-font text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Chọn Vòng Chơi / Select Round
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
              Thực hành 21 chủ đề quang hợp và vòng thử thách tổng hợp ngẫu nhiên. Hoàn thành để ghi tên lên Bảng Vàng!
            </p>
          </div>

          {/* Mode Selector and Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 pl-2">Chế độ:</span>
              <select
                value={gameMode}
                onChange={(e) => onGameModeChange(e.target.value as 'en-vi' | 'vi-en')}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-sm text-emerald-800 focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="en-vi">Anh ➡️ Việt (EN to VN)</option>
                <option value="vi-en">Việt ➡️ Anh (VN to EN)</option>
              </select>
            </div>

            <button
              onClick={onOpenLeaderboard}
              className="px-4 py-2 text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Bảng Vàng</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <span>Tiến độ tổng quát:</span>
            <div className="w-44 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <span className="font-extrabold text-emerald-700 tabular-nums">
              {completedRounds.length}/{VOCAB_ROUNDS.length} Vòng ({completionPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              Người chơi: <span className="font-bold text-slate-900">{playerName || 'Học sinh'}</span>
            </div>
            <div>
              Tổng điểm: <span className="font-extrabold text-emerald-600 text-base tabular-nums">{totalScore} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 custom-scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 21 Rounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {filteredRounds.map((r) => {
          const isDone = completedRounds.includes(r.id);
          const highScore = roundHighScores[r.id];

          return (
            <div
              key={r.id}
              className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`w-8 h-8 rounded-xl font-extrabold text-sm flex items-center justify-center shrink-0 ${
                      r.id === 22 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300/60' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {r.id === 22 ? '⭐' : r.id}
                  </span>
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Đã hoàn thành
                    </span>
                  ) : r.id === 22 ? (
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md">
                      🎲 8 cặp ngẫu nhiên
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {r.pairs.length} cặp từ
                    </span>
                  )}
                </div>

                <h3 className="title-font text-xl font-bold text-slate-800 mb-1 leading-snug">
                  {r.nameVi}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mb-2">
                  {r.nameEn}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {r.description}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-500 font-medium">
                  {highScore !== undefined ? (
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      Kỷ lục: {highScore} pts
                    </span>
                  ) : (
                    <span>Chưa có điểm</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSwitchToFlashcards(r.id)}
                    title="Học thẻ từ vựng của vòng này"
                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectRound(r)}
                    style={{ '--shadow-color': isDone ? '#047857' : '#15803d' } as React.CSSProperties}
                    className={`btn-3d px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isDone ? 'Chơi lại' : 'Bắt đầu'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Save & Exit Strip */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-slate-600">
          Điểm sẽ tự động cộng dồn qua từng vòng chơi. Bạn có thể lưu điểm bất cứ lúc nào!
        </div>

        <button
          onClick={onSaveAndExit}
          style={{ '--shadow-color': '#be123c' } as React.CSSProperties}
          className="btn-3d px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 shrink-0"
        >
          <span>Dừng lại & Lưu bảng vàng</span>
        </button>
      </div>
    </div>
  );
};
