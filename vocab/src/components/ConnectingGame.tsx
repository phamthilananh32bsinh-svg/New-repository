import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Lock, Flame, CheckCircle2, RotateCcw, ArrowRightLeft, Sparkles, XCircle, Dices } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabRound, VocabPair, generateSynthesisPairs } from '../data/vocabData';
import { sound } from '../utils/soundEffects';

interface ConnectingGameProps {
  round: VocabRound;
  gameMode: 'en-vi' | 'vi-en';
  onGameModeChange: (mode: 'en-vi' | 'vi-en') => void;
  totalScore: number;
  onRoundComplete: (roundId: number, score: number, total: number) => void;
  onBackToRounds: () => void;
  showToast: (msg: string, isSuccess?: boolean) => void;
}

interface ColumnItem {
  id: string; // 'p0', 'p1', etc.
  text: string;
  isEn: boolean;
  wordEn: string;
  originalIndex: number;
}

interface Connection {
  leftId: string;
  rightId: string;
  isEvaluated?: boolean;
  isCorrect?: boolean;
}

const BOTANICAL_EMOJIS = ['🌿', '🌱', '🍃', '🍀', '🌸', '🌼', '🌻', '🌾', '🪴', '🌳', '🌵'];

export const ConnectingGame: React.FC<ConnectingGameProps> = ({
  round,
  gameMode,
  onGameModeChange,
  totalScore,
  onRoundComplete,
  onBackToRounds,
  showToast,
}) => {
  const [currentPairs, setCurrentPairs] = useState<VocabPair[]>(round.pairs);
  const [itemsA, setItemsA] = useState<ColumnItem[]>([]);
  const [itemsB, setItemsB] = useState<ColumnItem[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeSource, setActiveSource] = useState<{ id: string; side: 'left' | 'right' } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [dotChanges, setDotChanges] = useState<Record<string, number>>({});
  const [combo, setCombo] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [reviewList, setReviewList] = useState<
    Array<{ en: string; vi: string; chosen: string; isCorrect: boolean }>
  >([]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const leftDotsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightDotsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize round items with double-shuffle
  const initRound = useCallback(() => {
    // If Round 22 (Synthesis Round), generate fresh 8 random non-duplicate pairs from rounds 1-21
    const activePairs = round.id === 22 ? generateSynthesisPairs(8) : round.pairs;
    setCurrentPairs(activePairs);

    const listA: ColumnItem[] = [];
    const listB: ColumnItem[] = [];

    activePairs.forEach((pair: VocabPair, idx: number) => {
      const isEnLeft = gameMode === 'en-vi';
      listA.push({
        id: `p${idx}`,
        text: isEnLeft ? pair.en : pair.vi,
        isEn: isEnLeft,
        wordEn: pair.en,
        originalIndex: idx,
      });
      listB.push({
        id: `p${idx}`,
        text: isEnLeft ? pair.vi : pair.en,
        isEn: !isEnLeft,
        wordEn: pair.en,
        originalIndex: idx,
      });
    });

    // Fisher-Yates Shuffle
    const shuffleArray = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    setItemsA(shuffleArray(listA));
    setItemsB(shuffleArray(listB));
    setConnections([]);
    setActiveSource(null);
    setMousePos(null);
    setDotChanges({});
    setCombo(0);
    setRoundScore(0);
    setIsSubmitting(false);
    setIsCompleted(false);
    setShowResultModal(false);
    setReviewList([]);
  }, [round, gameMode]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  // Compute absolute dot center relative to SVG canvas
  const getDotCenter = useCallback((dotEl: HTMLButtonElement | null) => {
    if (!dotEl || !svgRef.current) return { x: 0, y: 0 };
    const svgRect = svgRef.current.getBoundingClientRect();
    const dotRect = dotEl.getBoundingClientRect();
    return {
      x: dotRect.left - svgRect.left + dotRect.width / 2,
      y: dotRect.top - svgRect.top + dotRect.height / 2,
    };
  }, []);

  // Window resize force re-render for SVG lines
  const [, setResizeTick] = useState(0);
  useEffect(() => {
    const handleResize = () => setResizeTick((t) => t + 1);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, []);

  // Global mousemove for floating drawing line
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeSource || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    });
  };

  const handleGlobalClick = (e: React.MouseEvent) => {
    if (!activeSource) return;
    const target = e.target as HTMLElement;
    if (!target.closest('.connect-dot')) {
      setActiveSource(null);
      setMousePos(null);
    }
  };

  // Dot Click handler
  const handleDotClick = (id: string, side: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting || isCompleted) return;

    // Check if dot already has a connection
    const existingConn = connections.find((c) =>
      side === 'left' ? c.leftId === id : c.rightId === id
    );
    if (existingConn) {
      showToast('Từ này đã được nối! Bấm vào đường nối để hủy và đổi đáp án.', false);
      return;
    }

    if (!activeSource) {
      // First dot selected
      setActiveSource({ id, side });
      sound.playConnectSound();
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - svgRect.left,
          y: e.clientY - svgRect.top,
        });
      }
    } else {
      // Second dot selected
      if (activeSource.side === side) {
        // Same side clicked -> switch selection or deselect
        if (activeSource.id === id) {
          setActiveSource(null);
          setMousePos(null);
        } else {
          setActiveSource({ id, side });
          sound.playConnectSound();
        }
      } else {
        // Opposite side clicked -> establish connection
        const leftId = side === 'left' ? id : activeSource.id;
        const rightId = side === 'right' ? id : activeSource.id;

        const newConn: Connection = { leftId, rightId };
        setConnections((prev) => [...prev, newConn]);
        setActiveSource(null);
        setMousePos(null);
        sound.playConnectSound();
      }
    }
  };

  // Disconnect handler with 1-Time Change Limit enforcement
  const handleRemoveConnection = (conn: Connection) => {
    if (isSubmitting || isCompleted) return;

    const leftChangeCount = dotChanges[conn.leftId] || 0;
    const rightChangeCount = dotChanges[conn.rightId] || 0;

    // 1-Time Change Lock: if either dot was already disconnected once, lock it!
    if (leftChangeCount >= 1 || rightChangeCount >= 1) {
      sound.playLockSound();
      showToast('Bạn đã hết lượt đổi đáp án cho cặp từ này! 🔒', false);
      return;
    }

    // Increment change counts
    setDotChanges((prev) => ({
      ...prev,
      [conn.leftId]: (prev[conn.leftId] || 0) + 1,
      [conn.rightId]: (prev[conn.rightId] || 0) + 1,
    }));

    setConnections((prev) =>
      prev.filter((c) => !(c.leftId === conn.leftId && c.rightId === conn.rightId))
    );

    sound.playRemoveSound();
    showToast('Đã xóa đường nối. Chú ý: bạn đã dùng 1 lượt đổi cho từ này!', true);
  };

  // Speak pronunciation
  const handlePronounce = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.speak(word);
  };

  // Submit and automated sequential grading
  const handleSubmit = async () => {
    if (connections.length !== currentPairs.length || isSubmitting || isCompleted) return;

    setIsSubmitting(true);
    let runningRoundScore = 0;
    let runningCombo = 0;
    let isAllPerfect = true;
    const evaluatedReviews: Array<{ en: string; vi: string; chosen: string; isCorrect: boolean }> = [];

    // Clone connections for mutation
    const currentConns = [...connections];

    for (let i = 0; i < currentConns.length; i++) {
      const conn = currentConns[i];
      const isCorrect = conn.leftId === conn.rightId;

      // Identify corresponding pair
      const pairIndex = parseInt(conn.leftId.replace('p', ''), 10);
      const originalPair = currentPairs[pairIndex];

      const rightIndex = parseInt(conn.rightId.replace('p', ''), 10);
      const chosenPair = currentPairs[rightIndex];
      const chosenText = gameMode === 'en-vi' ? chosenPair.vi : chosenPair.en;

      currentConns[i] = {
        ...conn,
        isEvaluated: true,
        isCorrect,
      };
      setConnections([...currentConns]);

      if (isCorrect) {
        runningCombo++;
        const baseScore = 10;
        const comboBonus = runningCombo > 1 ? runningCombo * 2 : 0;
        runningRoundScore += baseScore + comboBonus;
        setCombo(runningCombo);
        setRoundScore(runningRoundScore);
        sound.playCorrectSound();

        evaluatedReviews.push({
          en: originalPair.en,
          vi: originalPair.vi,
          chosen: chosenText,
          isCorrect: true,
        });
      } else {
        isAllPerfect = false;
        runningCombo = 0;
        setCombo(0);
        sound.playWrongSound();

        evaluatedReviews.push({
          en: originalPair.en,
          vi: originalPair.vi,
          chosen: chosenText,
          isCorrect: false,
        });
      }

      // Small delay between each answer reveal
      await new Promise((resolve) => setTimeout(resolve, 360));
    }

    // Play Victory sound effect
    sound.playVictoryEDM();

    // Trigger celebratory confetti if score is high
    if (isAllPerfect || runningRoundScore >= currentPairs.length * 8) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
        });
      } catch {
        // Fallback
      }
    }

    setReviewList(evaluatedReviews);
    setIsSubmitting(false);
    setIsCompleted(true);
    setShowResultModal(true);

    const finalRoundScore = runningRoundScore;
    onRoundComplete(round.id, finalRoundScore, totalScore + finalRoundScore);
  };

  const isAllConnected = connections.length === currentPairs.length;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleGlobalClick}
      className="w-full max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 relative select-none"
    >
      {/* Top Round Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-100 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                {round.id}
              </span>
              <h1 className="title-font text-2xl sm:text-3xl font-bold text-slate-800">
                {round.title}
              </h1>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 bg-slate-100/90 p-1 rounded-xl text-xs font-bold">
              <span className="text-slate-500 pl-1">Chế độ:</span>
              <button
                disabled={isSubmitting || connections.length > 0}
                onClick={() => onGameModeChange(gameMode === 'en-vi' ? 'vi-en' : 'en-vi')}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200/80 rounded-lg shadow-xs transition-colors disabled:opacity-60"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                {gameMode === 'en-vi' ? 'Anh ➡️ Việt (EN - VN)' : 'Việt ➡️ Anh (VN - EN)'}
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            Hướng dẫn: Nhấp chấm tròn để nối từ. Mỗi cặp được đổi đáp án 1 lần. Nhấp vào đường kẻ để hủy nối.
          </p>
        </div>

        {/* Score & Combo HUD */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="glass-panel px-5 py-3 rounded-2xl border border-amber-100 text-center min-w-[100px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Flame className={`w-3.5 h-3.5 ${combo > 1 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
              Combo
            </div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold title-font transition-all ${
                combo > 1 ? 'text-orange-500 combo-flame' : 'text-slate-700'
              }`}
            >
              x{combo}
            </div>
          </div>

          <div className="glass-panel px-6 py-3 rounded-2xl border border-emerald-100 text-center min-w-[130px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Điểm vòng này
            </div>
            <div className="text-3xl sm:text-4xl font-black title-font text-emerald-600 tabular-nums">
              +{roundScore}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Matching Canvas */}
      <div className="glass-panel p-5 sm:p-8 rounded-3xl relative border border-white/80 shadow-xl overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-2 gap-8 sm:gap-16 mb-6 relative z-20">
          <div
            className={`py-2.5 px-4 rounded-xl text-center font-bold text-base sm:text-lg title-font tracking-wide shadow-xs ${
              gameMode === 'en-vi'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
            }`}
          >
            {gameMode === 'en-vi' ? 'Tiếng Anh / English' : 'Tiếng Việt / Vietnamese'}
          </div>
          <div
            className={`py-2.5 px-4 rounded-xl text-center font-bold text-base sm:text-lg title-font tracking-wide shadow-xs ${
              gameMode === 'en-vi'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
            }`}
          >
            {gameMode === 'en-vi' ? 'Tiếng Việt / Vietnamese' : 'Tiếng Anh / English'}
          </div>
        </div>

        {/* SVG Drawing Surface */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          style={{ overflow: 'visible' }}
        >
          {/* Established connections */}
          {connections.map((conn) => {
            const leftDot = leftDotsRef.current[conn.leftId];
            const rightDot = rightDotsRef.current[conn.rightId];
            const p1 = getDotCenter(leftDot);
            const p2 = getDotCenter(rightDot);

            let strokeColor = '#94a3b8'; // Default slate-400
            let strokeWidth = 4;
            if (conn.isEvaluated) {
              strokeColor = conn.isCorrect ? '#10b981' : '#ef4444';
              strokeWidth = 6;
            }

            return (
              <g key={`conn-${conn.leftId}-${conn.rightId}`}>
                {/* Thick invisible click helper line */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="transparent"
                  strokeWidth="20"
                  className="cursor-pointer pointer-events-auto"
                  onClick={() => handleRemoveConnection(conn)}
                />
                {/* Visible connector line with smooth rounded cap */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className="cursor-pointer pointer-events-auto transition-all duration-300 hover:stroke-rose-500 hover:stroke-[6px]"
                  onClick={() => handleRemoveConnection(conn)}
                />
              </g>
            );
          })}

          {/* Active drawing line (following mouse pointer) */}
          {activeSource && mousePos && (
            <line
              x1={
                activeSource.side === 'left'
                  ? getDotCenter(leftDotsRef.current[activeSource.id]).x
                  : getDotCenter(rightDotsRef.current[activeSource.id]).x
              }
              y1={
                activeSource.side === 'left'
                  ? getDotCenter(leftDotsRef.current[activeSource.id]).y
                  : getDotCenter(rightDotsRef.current[activeSource.id]).y
              }
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeLinecap="round"
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Word Columns */}
        <div className="grid grid-cols-2 gap-8 sm:gap-16 relative z-20">
          {/* Column A (Left) */}
          <div className="flex flex-col gap-3.5">
            {itemsA.map((item, idx) => {
              const isLocked = (dotChanges[item.id] || 0) >= 1;
              const isConnected = connections.some((c) => c.leftId === item.id);
              const isActive = activeSource?.side === 'left' && activeSource.id === item.id;

              return (
                <div key={`colA-${item.id}`} className="relative flex items-center group">
                  <div
                    className={`w-full p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between shadow-xs ${
                      item.isEn
                        ? 'bg-blue-50/70 border-blue-200/90 text-blue-950 hover:border-blue-400'
                        : 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950 hover:border-emerald-400'
                    } ${isConnected ? 'ring-1 ring-slate-300' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 pr-2">
                      {item.isEn ? (
                        <button
                          type="button"
                          onClick={(e) => handlePronounce(item.wordEn, e)}
                          title="Nghe phát âm"
                          className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center shrink-0 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                      )}
                      <span className="font-bold text-sm sm:text-base leading-snug break-words">
                        {item.text}
                      </span>
                    </div>
                  </div>

                  {/* Right dot of Column A */}
                  <button
                    ref={(el) => {
                      leftDotsRef.current[item.id] = el;
                    }}
                    type="button"
                    disabled={isSubmitting || isCompleted}
                    onClick={(e) => handleDotClick(item.id, 'left', e)}
                    title={
                      isLocked
                        ? 'Đã hết lượt đổi đáp án'
                        : isConnected
                        ? 'Đã nối (nhấp đường thẳng để xóa)'
                        : 'Nhấp để nối'
                    }
                    className={`connect-dot absolute -right-3 sm:-right-3.5 z-40 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                      isLocked
                        ? 'bg-rose-500 ring-4 ring-rose-200 text-white cursor-pointer'
                        : isActive
                        ? 'bg-amber-400 ring-4 ring-amber-200 scale-125'
                        : isConnected
                        ? 'bg-emerald-500 ring-3 ring-emerald-200'
                        : 'bg-amber-500 hover:bg-amber-400 ring-3 ring-amber-100 hover:scale-110'
                    }`}
                  >
                    {isLocked && <Lock className="w-3 h-3 text-white" />}
                    {!isLocked && isConnected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Column B (Right) */}
          <div className="flex flex-col gap-3.5">
            {itemsB.map((item, idx) => {
              const isLocked = (dotChanges[item.id] || 0) >= 1;
              const isConnected = connections.some((c) => c.rightId === item.id);
              const isActive = activeSource?.side === 'right' && activeSource.id === item.id;
              const emoji = BOTANICAL_EMOJIS[idx % BOTANICAL_EMOJIS.length];

              return (
                <div key={`colB-${item.id}`} className="relative flex items-center group">
                  {/* Left dot of Column B */}
                  <button
                    ref={(el) => {
                      rightDotsRef.current[item.id] = el;
                    }}
                    type="button"
                    disabled={isSubmitting || isCompleted}
                    onClick={(e) => handleDotClick(item.id, 'right', e)}
                    title={
                      isLocked
                        ? 'Đã hết lượt đổi đáp án'
                        : isConnected
                        ? 'Đã nối (nhấp đường thẳng để xóa)'
                        : 'Nhấp để nối'
                    }
                    className={`connect-dot absolute -left-3 sm:-left-3.5 z-40 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                      isLocked
                        ? 'bg-rose-500 ring-4 ring-rose-200 text-white cursor-pointer'
                        : isActive
                        ? 'bg-amber-400 ring-4 ring-amber-200 scale-125'
                        : isConnected
                        ? 'bg-emerald-500 ring-3 ring-emerald-200'
                        : 'bg-amber-500 hover:bg-amber-400 ring-3 ring-amber-100 hover:scale-110'
                    }`}
                  >
                    {isLocked && <Lock className="w-3 h-3 text-white" />}
                    {!isLocked && isConnected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </button>

                  <div
                    className={`w-full p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between shadow-xs ${
                      item.isEn
                        ? 'bg-blue-50/70 border-blue-200/90 text-blue-950 hover:border-blue-400'
                        : 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950 hover:border-emerald-400'
                    } ${isConnected ? 'ring-1 ring-slate-300' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 pl-2">
                      <span className="text-xl sm:text-2xl shrink-0">{emoji}</span>
                      <span className="font-bold text-sm sm:text-base leading-snug break-words flex-1">
                        {item.text}
                      </span>
                      {item.isEn && (
                        <button
                          type="button"
                          onClick={(e) => handlePronounce(item.wordEn, e)}
                          title="Nghe phát âm"
                          className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center shrink-0 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating progress footer inside the board */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-500 font-semibold flex items-center gap-2">
            <span>Tiến độ nối:</span>
            <span className="font-extrabold text-emerald-700 text-base tabular-nums">
              {connections.length} / {currentPairs.length}
            </span>
            <span>cặp từ</span>
            {round.id === 22 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md ml-1">
                🎲 8 từ ngẫu nhiên
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {round.id === 22 && (
              <button
                onClick={initRound}
                disabled={isSubmitting}
                className="px-3.5 py-2 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                title="Tạo bộ 8 cặp từ ngẫu nhiên mới"
              >
                <Dices className="w-3.5 h-3.5 text-amber-600" />
                Đổi bộ 8 từ khác
              </button>
            )}

            <button
              onClick={initRound}
              disabled={isSubmitting}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại vòng này
            </button>
          </div>
        </div>
      </div>

      {/* Main Submit Action */}
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={!isAllConnected || isSubmitting || isCompleted}
          style={{ '--shadow-color': '#b45309' } as React.CSSProperties}
          className={`btn-3d px-12 sm:px-16 py-4 sm:py-5 rounded-2xl font-black text-xl sm:text-2xl tracking-wide flex items-center justify-center gap-3 mx-auto shadow-lg transition-all ${
            isAllConnected && !isSubmitting && !isCompleted
              ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 animate-bounce'
              : 'bg-amber-400 text-amber-950'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-3 border-amber-950 border-t-transparent rounded-full animate-spin"></div>
              <span>ĐANG CHẤM ĐIỂM...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-7 h-7 text-amber-900" />
              <span>CHẤM ĐIỂM / SUBMIT</span>
            </>
          )}
        </button>
      </div>

      {/* Result Modal / Overlay */}
      {showResultModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl p-6 sm:p-8 rounded-3xl text-center shadow-2xl border-2 border-white/90 animate-in fade-in zoom-in-95 duration-200">
            {/* Title / Performance */}
            {roundScore >= currentPairs.length * 10 ? (
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 text-amber-500 font-extrabold text-3xl sm:text-4xl title-font mb-1">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
                  XUẤT SẮC! 🎉
                </div>
                <p className="text-slate-600 font-semibold text-sm sm:text-base">
                  Tuyệt vời! Bạn đã nối chính xác 100% không mắc sai sót nào!
                </p>
              </div>
            ) : roundScore >= currentPairs.length * 5 ? (
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 text-blue-600 font-extrabold text-3xl sm:text-4xl title-font mb-1">
                  RẤT TỐT! 👍
                </div>
                <p className="text-slate-600 font-semibold text-sm sm:text-base">
                  Bạn đã nắm khá vững các thuật ngữ sinh học trong vòng này!
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 text-emerald-600 font-extrabold text-3xl sm:text-4xl title-font mb-1">
                  HOÀN THÀNH! 🍀
                </div>
                <p className="text-slate-600 font-semibold text-sm sm:text-base">
                  Hãy xem lại các đáp án đúng bên dưới để củng cố kiến thức nhé!
                </p>
              </div>
            )}

            {/* Score Summary Box */}
            <div className="grid grid-cols-2 gap-4 my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-100 shadow-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Điểm vòng này
                </div>
                <div className="text-3xl sm:text-4xl font-black title-font text-emerald-600 mt-1 tabular-nums">
                  +{roundScore}
                </div>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-100 shadow-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tổng điểm tích lũy
                </div>
                <div className="text-3xl sm:text-4xl font-black title-font text-blue-600 mt-1 tabular-nums">
                  {totalScore + roundScore}
                </div>
              </div>
            </div>

            {/* Detailed Review List */}
            <div className="max-h-[38vh] overflow-y-auto custom-scroll text-left p-3 bg-white rounded-2xl border border-slate-200/80 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase px-2 mb-2 tracking-wider">
                Bảng xem lại đáp án chi tiết
              </div>
              <div className="flex flex-col gap-2">
                {reviewList.map((item, i) => (
                  <div
                    key={`rev-${i}`}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm ${
                      item.isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold">{item.en}</span>
                        <span className="text-slate-400 mx-2">↔</span>
                        <span className="font-extrabold">{item.vi}</span>
                      </div>
                    </div>

                    {!item.isCorrect && (
                      <div className="text-xs font-semibold text-rose-700 bg-rose-100/80 px-2 py-1 rounded-md self-start sm:self-auto">
                        Bạn đã nối với: <span className="line-through">{item.chosen}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <button
                onClick={onBackToRounds}
                style={{ '--shadow-color': '#1d4ed8' } as React.CSSProperties}
                className="btn-3d w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2"
              >
                CHƠI TIẾP VÒNG KHÁC ➡️
              </button>
              <button
                onClick={() => {
                  setShowResultModal(false);
                  initRound();
                }}
                style={{ '--shadow-color': '#334155' } as React.CSSProperties}
                className="btn-3d w-full sm:w-auto flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2"
              >
                CHƠI LẠI VÒNG NÀY 🔄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
