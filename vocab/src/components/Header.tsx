import React from 'react';
import { Volume2, VolumeX, Music, Trophy, BookOpen, Layers, PlayCircle, CheckCircle2, PencilLine } from 'lucide-react';
import { sound } from '../utils/soundEffects';

type VocabularyTab = 'glossary' | 'flashcards' | 'game' | 'truefalse' | 'fill';

interface HeaderProps {
  currentTab: VocabularyTab;
  setCurrentTab: (tab: VocabularyTab) => void;
  playerName: string;
  totalScore: number;
  onOpenLeaderboard: () => void;
  onExitToSelect?: () => void;
  showExitBtn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  playerName,
  totalScore,
  onOpenLeaderboard,
  onExitToSelect,
  showExitBtn,
}) => {
  const [isMusic, setIsMusic] = React.useState(sound.getMusicState());
  const [isSfx, setIsSfx] = React.useState(sound.getSfxState());

  const handleToggleMusic = () => {
    const newState = sound.toggleMusic();
    setIsMusic(newState);
  };

  const handleToggleSfx = () => {
    const newState = sound.toggleSfx();
    setIsSfx(newState);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
            🌱
          </div>
          <div>
            <span className="title-font text-xl font-bold tracking-tight text-emerald-950 block leading-tight">
              Biology 11 · Photosynthesis
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 hidden sm:block">
              Team Sinh cô Jessica
            </span>
          </div>
        </div>

        {/* Zone 3: Actions & Audio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio Toggles */}
          <button
            onClick={handleToggleMusic}
            title={isMusic ? 'Tắt nhạc nền (BGM)' : 'Bật nhạc nền thư giãn (BGM)'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm border transition-all ${
              isMusic
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleSfx}
            title={isSfx ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm border transition-all ${
              isSfx
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            {isSfx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Bảng Vàng</span>
          </button>

          {/* Player stats info in header */}
          {playerName && (
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <span className="text-slate-500">Người chơi:</span>
              <span className="font-bold text-slate-800 max-w-[100px] truncate">{playerName}</span>
              <span className="text-emerald-700 font-extrabold bg-emerald-100/70 px-2 py-0.5 rounded-md tabular-nums">
                {totalScore} pts
              </span>
            </div>
          )}

          {showExitBtn && onExitToSelect && (
            <button
              onClick={onExitToSelect}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Chọn vòng
            </button>
          )}
        </div>
      </div>

      {/* All five activities share one responsive navigation bar. */}
      <nav aria-label="Vocabulary learning activities" className="max-w-7xl mx-auto mt-3 pt-3 border-t border-emerald-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {([
          { tab: 'glossary', label: 'Từ điển', Icon: BookOpen },
          { tab: 'flashcards', label: 'Thẻ từ', Icon: Layers },
          { tab: 'game', label: 'Nối từ', Icon: PlayCircle },
          { tab: 'truefalse', label: 'True / False', Icon: CheckCircle2 },
          { tab: 'fill', label: 'Fill in the Blanks', Icon: PencilLine },
        ] as const).map(({ tab, label, Icon }) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCurrentTab(tab)}
            aria-pressed={currentTab === tab}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-extrabold transition-colors ${
              currentTab === tab
                ? 'bg-emerald-700 border-emerald-700 text-white'
                : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};
