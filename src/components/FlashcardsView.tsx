import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Shuffle, CheckCircle, RotateCcw } from 'lucide-react';
import { VOCAB_ROUNDS, VocabPair } from '../data/vocabData';
import { sound } from '../utils/soundEffects';

interface FlashcardsViewProps {
  initialRoundId?: number;
  masteredWords: string[];
  onToggleMastered: (wordEn: string) => void;
  onPlayRound: (roundId: number) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  initialRoundId = 1,
  masteredWords,
  onToggleMastered,
  onPlayRound,
}) => {
  const [selectedRoundId, setSelectedRoundId] = useState<number>(initialRoundId);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentRound = VOCAB_ROUNDS.find((r) => r.id === selectedRoundId) || VOCAB_ROUNDS[0];
  const pairs: VocabPair[] = currentRound.pairs;
  const currentPair: VocabPair | undefined = pairs[cardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % pairs.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCardIndex(Math.floor(Math.random() * pairs.length));
  };

  const isMastered = currentPair ? masteredWords.includes(currentPair.en) : false;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4">
      {/* Top Controls */}
      <div className="glass-panel p-5 rounded-3xl border border-emerald-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            Chế độ ôn tập
          </span>
          <h1 className="title-font text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
            Thẻ Flashcards Học Từ Vựng
          </h1>
        </div>

        {/* Round select dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedRoundId}
            onChange={(e) => {
              setSelectedRoundId(Number(e.target.value));
              setCardIndex(0);
              setIsFlipped(false);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 shadow-xs focus:outline-none cursor-pointer"
          >
            {VOCAB_ROUNDS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({r.pairs.length} từ)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Flashcard Container */}
      {currentPair && (
        <div className="flex flex-col items-center">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg h-72 sm:h-80 cursor-pointer [perspective:1000px] mb-6 select-none"
          >
            <div
              className={`w-full h-full relative duration-500 rounded-3xl [transform-style:preserve-3d] transition-transform ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* Front Side (English) */}
              <div className="glass-panel absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between items-center text-center [backface-visibility:hidden] border-2 border-emerald-200/80 shadow-lg bg-gradient-to-b from-white to-emerald-50/30">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                    Tiếng Anh / English
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Thẻ {cardIndex + 1} / {pairs.length}
                  </span>
                </div>

                <div className="my-auto">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 title-font tracking-tight mb-2">
                    {currentPair.en}
                  </h2>
                  {currentPair.phonetic && (
                    <p className="text-sm font-mono text-emerald-600 font-medium">
                      {currentPair.phonetic}
                    </p>
                  )}
                </div>

                <div className="w-full flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.speak(currentPair.en);
                    }}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Phát âm</span>
                  </button>
                  <span className="italic">Nhấp thẻ để lật xem tiếng Việt</span>
                </div>
              </div>

              {/* Back Side (Vietnamese) */}
              <div className="glass-panel absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden] border-2 border-blue-200/80 shadow-lg bg-gradient-to-b from-white to-blue-50/30">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg">
                    Tiếng Việt / Vietnamese
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Thẻ {cardIndex + 1} / {pairs.length}
                  </span>
                </div>

                <div className="my-auto">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 title-font tracking-tight mb-2">
                    {currentPair.vi}
                  </h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Thuộc chủ đề: {currentRound.nameVi}
                  </p>
                </div>

                <div className="w-full flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.speak(currentPair.en);
                    }}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe lại</span>
                  </button>
                  <span className="italic">Nhấp thẻ để quay lại</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
              title="Thẻ trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleShuffle}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Xáo trộn thẻ ngẫu nhiên"
            >
              <Shuffle className="w-4 h-4 text-emerald-600" />
              <span>Ngẫu nhiên</span>
            </button>

            <button
              onClick={() => onToggleMastered(currentPair.en)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs ${
                isMastered
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border-slate-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isMastered ? 'Đã thành thạo' : 'Đánh dấu đã thuộc'}</span>
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
              title="Thẻ kế tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick jump to game for this round */}
          <button
            onClick={() => onPlayRound(currentRound.id)}
            style={{ '--shadow-color': '#15803d' } as React.CSSProperties}
            className="btn-3d px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2"
          >
            <span>Vào chơi nối từ vòng này ngay 🎯</span>
          </button>
        </div>
      )}
    </div>
  );
};
