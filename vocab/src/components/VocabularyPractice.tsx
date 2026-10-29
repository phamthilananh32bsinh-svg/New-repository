import React, { useEffect, useMemo, useState } from 'react';
import { sound } from '../utils/soundEffects';
import { TRUE_FALSE_QUESTIONS, FILL_GROUPS } from '../data/practiceData';

type Mode = 'truefalse' | 'fill';
const KEY = 'biology-lesson42-practice-v1';
type Progress = { tfBest: number; fillBest: Record<string, number> };
const empty: Progress = { tfBest: 0, fillBest: {} };
function load(): Progress {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || 'null');
    return parsed && typeof parsed === 'object'
      ? { tfBest: Number(parsed.tfBest) || 0, fillBest: parsed.fillBest && typeof parsed.fillBest === 'object' ? parsed.fillBest : {} }
      : empty;
  } catch { return empty; }
}
export function VocabularyPractice({ mode }: { mode: Mode }) {
  const [audioSettings, setAudioSettings] = useState(() => sound.getPracticeSettings());
  const [progress, setProgress] = useState<Progress>(load);
  const [tfIndex, setTfIndex] = useState(0);
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean>>({});
  const [groupId, setGroupId] = useState(FILL_GROUPS[0].id);
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const group = useMemo(() => FILL_GROUPS.find(g => g.id === groupId) || FILL_GROUPS[0], [groupId]);
  const tfScore = TRUE_FALSE_QUESTIONS.filter(q => tfAnswers[q.id] === q.answer).length;
  const tfDone = TRUE_FALSE_QUESTIONS.every(q => typeof tfAnswers[q.id] === 'boolean');
  const getAnswers = (q: typeof group.questions[number]) => q.answers ?? [q.answer ?? ''];
  const getParts = (q: typeof group.questions[number]) => q.parts ?? [q.before ?? '', q.after ?? ''];
  const blankKey = (id: string, index: number) => `${id}:${index}`;
  const blankCount = group.questions.reduce((n,q) => n + getAnswers(q).length, 0);
  const fillScore = group.questions.reduce((n,q) => n + getAnswers(q).filter((a,i) => fillAnswers[blankKey(q.id,i)] === a).length, 0);
  const filled = group.questions.every(q => getAnswers(q).every((_,i) => Boolean(fillAnswers[blankKey(q.id,i)])));
  useEffect(() => {
    if (mode === 'truefalse' && tfDone && tfScore > progress.tfBest) {
      setProgress(p => ({...p, tfBest: Math.max(p.tfBest, tfScore)}));
    }
  }, [mode, tfDone, tfScore, progress.tfBest]);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch {} }, [progress]);
  function setTf(answer: boolean) {
    const q = TRUE_FALSE_QUESTIONS[tfIndex];
    if (typeof tfAnswers[q.id] === 'boolean') return;
    sound.playPracticeSound(answer === q.answer ? 'correct' : 'wrong');
    setTfAnswers(p => ({...p, [q.id]: answer}));
    if (Object.keys(tfAnswers).length + 1 === TRUE_FALSE_QUESTIONS.length) window.setTimeout(() => sound.playPracticeSound('complete'), 500);
  }
  function assign(questionId: string, blankIndex: number, word: string) {
    if (checked || !group.words.includes(word)) return;
    setFillAnswers(p => {
      const next = {...p};
      const key = blankKey(questionId, blankIndex);
      const allowed = group.words.filter(item => item === word).length;
      const usedElsewhere = Object.entries(next).filter(([key, value]) => key !== blankKey(questionId, blankIndex) && value === word);
      if (usedElsewhere.length >= allowed) return next;
      next[key] = word;
      return next;
    });
    sound.playPracticeSound('place');
    setSelectedWord(null);
  }
  function checkFill() {
    if (!filled) return;
    setChecked(true);
    sound.playPracticeSound(fillScore === blankCount ? 'complete' : fillScore > 0 ? 'correct' : 'wrong');
    setProgress(p => ({...p, fillBest: {...p.fillBest, [groupId]: Math.max(p.fillBest[groupId] || 0, fillScore)}}));
  }
  function resetFill(id: string) {
    sound.playPracticeSound('tap');
    setGroupId(id);
    setFillAnswers({});
    setSelectedWord(null);
    setChecked(false);
  }
  const card = 'v29-glass-card rounded-[1.6rem] border border-emerald-100 bg-white/90 shadow-lg shadow-emerald-900/5 p-5 sm:p-8';
  const button = 'rounded-xl px-4 py-3 font-extrabold transition active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600';
  return (
    <section className="v29-practice max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5" aria-label={mode === 'truefalse' ? 'True or False practice' : 'Fill in the blanks practice'}>
      <div className={card}>
        <div className="text-sm font-extrabold tracking-widest text-emerald-700 uppercase">Lesson 4.2 · Key Vocabulary</div>
        <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 mt-2">{mode === 'truefalse' ? 'True / False' : 'Fill in the Blanks'}</h1>
        <p className="text-slate-600 mt-2">{mode === 'truefalse' ? 'Read the biology statement, choose an answer, and learn from the explanation.' : 'Choose a word, then tap a blank or drag the word into it. Check all answers when ready.'}</p>
        <p className="text-sm font-bold text-emerald-800 mt-3">{mode === 'truefalse' ? `Personal best: ${progress.tfBest}/${TRUE_FALSE_QUESTIONS.length}` : `Personal best for this group: ${progress.fillBest[groupId] || 0}/${blankCount}`}</p>
      </div>
      <div className={card}>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div><h2 className="font-black text-emerald-950">🔊 Interaction sounds</h2><p className="text-sm text-slate-600">Soft feedback for choices, results and completion</p></div>
          <button type="button" aria-pressed={audioSettings.enabled} onClick={() => {
            const next = sound.setPracticeSettings({enabled: !audioSettings.enabled});
            setAudioSettings(next);
            if (next.enabled) sound.playPracticeSound('tap');
          }} className={`${button} bg-emerald-100 text-emerald-900`}>{audioSettings.enabled ? '🔊 Sound ON' : '🔇 Sound OFF'}</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <label className="text-sm font-bold text-emerald-900">Sound style
            <select className="block w-full mt-2 rounded-xl border border-emerald-200 p-3 bg-white" value={audioSettings.preset}
              onChange={e => { const next = sound.setPracticeSettings({preset: e.target.value as 'gentle' | 'playful' | 'minimal'}); setAudioSettings(next); sound.playPracticeSound('correct'); }}>
              <option value="gentle">🌿 Gentle Botanical</option><option value="playful">🎮 Playful</option><option value="minimal">📖 Minimal</option>
            </select>
          </label>
          <label className="text-sm font-bold text-emerald-900">Volume · {Math.round(audioSettings.volume * 100)}%
            <input type="range" min="0" max="100" step="5" value={Math.round(audioSettings.volume * 100)} className="block w-full mt-4 accent-emerald-600"
              onChange={e => setAudioSettings(sound.setPracticeSettings({volume: Number(e.target.value)/100}))}/>
          </label>
        </div>
        <button type="button" onClick={() => sound.playPracticeSound('correct')} className="mt-3 text-sm font-bold text-emerald-700 underline">▶ Test sound</button>
      </div>
      {mode === 'truefalse' ? (() => {
        const q = TRUE_FALSE_QUESTIONS[tfIndex];
        const answer = tfAnswers[q.id];
        const answered = typeof answer === 'boolean';
        return <div className={card}>
          <div className="flex justify-between gap-3 text-sm font-extrabold text-emerald-700"><span>{q.topic}</span><span>{tfIndex + 1} / {TRUE_FALSE_QUESTIONS.length}</span></div>
          <div className="h-2 rounded-full bg-emerald-100 mt-4 overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{width:`${Object.keys(tfAnswers).length / TRUE_FALSE_QUESTIONS.length * 100}%`}} /></div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed mt-7 mb-6">{q.statement}</h2>
          <div className="grid grid-cols-2 gap-3">
            {([true,false] as const).map(value => <button key={String(value)} disabled={answered} onClick={() => setTf(value)}
              className={`${button} border-2 ${answered && answer === value ? (answer === q.answer ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-rose-100 border-rose-400 text-rose-900') : 'bg-white border-emerald-100 text-emerald-900'} disabled:cursor-default`}>{value ? '✓ True' : '✕ False'}</button>)}
          </div>
          {answered && <div role="status" className={`rounded-xl mt-5 p-4 ${answer === q.answer ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`}>
            <strong>{answer === q.answer ? 'Correct!' : `Not quite. Correct answer: ${q.answer ? 'True' : 'False'}.`}</strong><p className="mt-1">{q.explanation}</p>
          </div>}
          <div className="flex flex-wrap justify-between gap-3 mt-6">
            <button className={`${button} bg-slate-100 text-slate-700 disabled:opacity-40`} disabled={tfIndex === 0} onClick={() => {sound.playPracticeSound('tap');setTfIndex(i => Math.max(0,i-1));}}>← Previous</button>
            {tfIndex < TRUE_FALSE_QUESTIONS.length-1
              ? <button className={`${button} bg-emerald-600 text-white disabled:opacity-40`} disabled={!answered} onClick={() => {sound.playPracticeSound('tap');setTfIndex(i => i+1);}}>Next →</button>
              : <button className={`${button} bg-emerald-600 text-white disabled:opacity-40`} disabled={!answered} onClick={() => {sound.playPracticeSound('tap');setTfIndex(0);setTfAnswers({});}}>Try again ↻</button>}
          </div>
          {tfDone && <p role="status" className="mt-5 font-black text-emerald-900">Completed: {tfScore}/{TRUE_FALSE_QUESTIONS.length} correct · {Math.round(tfScore/TRUE_FALSE_QUESTIONS.length*100)}%</p>}
        </div>;
      })() : <>
        <div className={card}>
          <label htmlFor="practice-group" className="block text-sm font-extrabold text-emerald-800 mb-2">Practice group</label>
          <select id="practice-group" value={groupId} onChange={e => resetFill(e.target.value)} className="w-full rounded-xl border-2 border-emerald-200 p-3 bg-white text-emerald-950 font-bold">
            {FILL_GROUPS.map(g => <option value={g.id} key={g.id}>{g.title} · {g.questions.length} questions</option>)}
          </select>
          <p className="mt-4 text-sm text-slate-600">Word bank · Select a word first, then tap a blank. You can also drag and drop.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {group.words.filter((word, index, words) => words.indexOf(word) === index).map(word => {
              const used = Object.values(fillAnswers).filter(value => value === word).length >= group.words.filter(value => value === word).length;
              return <button key={word} draggable={!checked && !used} onDragStart={e => e.dataTransfer.setData('text/plain',word)}
                disabled={checked || used} aria-pressed={selectedWord === word} onClick={() => {sound.playPracticeSound('tap');setSelectedWord(word);}}
                className={`${button} text-sm border-2 ${selectedWord === word ? 'border-emerald-600 bg-emerald-100' : 'border-emerald-200 bg-white'} text-emerald-950 disabled:opacity-40`}>{word}</button>;
            })}
          </div>
        </div>
        <div className={`${card} space-y-5`}>
          {group.questions.map((q,i) => {
            const answers = getAnswers(q);
            const parts = getParts(q);
            return <div key={q.id} className="leading-loose text-slate-800 font-bold">
              <span className="text-emerald-700 mr-2">{i+1}.</span>
              {parts.map((part,j) => <React.Fragment key={j}>
                {part}
                {j < answers.length && (() => {
                  const key = blankKey(q.id,j);
                  const answer = fillAnswers[key];
                  const correct = answer === answers[j];
                  return <button type="button" onClick={() => { if (checked) return; if (selectedWord) assign(q.id,j,selectedWord); else {sound.playPracticeSound('remove');setFillAnswers(p => {const next={...p};delete next[key];return next;});} }}
                    onDragOver={e => {if (!checked) e.preventDefault();}}
                    onDrop={e => {e.preventDefault();assign(q.id,j,e.dataTransfer.getData('text/plain'));}}
                    aria-label={`Question ${i+1}, blank ${j+1}: ${answer || 'empty'}`}
                    className={`inline-block mx-1 px-3 py-1 min-w-28 min-h-11 rounded-lg border-2 border-dashed align-middle ${checked ? (correct ? 'bg-emerald-100 border-emerald-500' : 'bg-rose-100 border-rose-400') : 'bg-emerald-50 border-emerald-300'} text-emerald-950`}>{answer || 'Tap / drop here'}</button>;
                })()}
              </React.Fragment>)}
              {checked && <p className="text-sm font-normal mt-1 text-slate-600">{answers.every((a,j) => fillAnswers[blankKey(q.id,j)] === a) ? '✓ All correct' : `Correct answers: ${answers.join(' · ')}`} · {q.explanation}</p>}
            </div>;
          })}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-emerald-100">
            <button className={`${button} bg-emerald-600 text-white disabled:opacity-40`} disabled={!filled || checked} onClick={checkFill}>Check answers</button>
            <button className={`${button} bg-slate-100 text-slate-800`} onClick={() => resetFill(groupId)}>Try again ↻</button>
          </div>
          {checked && <p role="status" className="font-black text-emerald-900">Result: {fillScore}/{blankCount} blanks correct · {Math.round(fillScore/blankCount*100)}%</p>}
        </div>
      </>}
    </section>
  );
}
