const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require(process.env.TYPESCRIPT_PATH || '/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const path = require('node:path');
const base = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(base, 'src/data/practiceData.ts'), 'utf8');
const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const dataExports = {};
new Function('exports', 'require', js)(dataExports, require);
const {TRUE_FALSE_QUESTIONS,FILL_GROUPS} = dataExports;
test('question identifiers are unique', () => {
 const ids = [...TRUE_FALSE_QUESTIONS.map(q=>q.id), ...FILL_GROUPS.flatMap(g=>g.questions.map(q=>q.id))];
 assert.equal(ids.length,new Set(ids).size);
});
test('all true false entries are complete', () => {
 assert.equal(TRUE_FALSE_QUESTIONS.length,12);
 for(const q of TRUE_FALSE_QUESTIONS) {
  assert.equal(typeof q.answer,'boolean');
  assert.ok(q.statement && q.explanation && q.topic);
 }
});
test('all fill entries have answer in their group bank', () => {
 assert.equal(FILL_GROUPS.length,4);
 assert.equal(FILL_GROUPS.reduce((n,g)=>n+g.questions.length,0),21);
 for(const g of FILL_GROUPS) for(const q of g.questions) {
  for(const answer of (q.answers || [q.answer])) assert.ok(g.words.includes(answer),`${g.id} ${q.id}: answer missing from word bank`);
  assert.ok((q.parts ? q.parts.length === q.answers.length + 1 : q.before !== undefined && q.after !== undefined) && q.explanation);
 }
});
test('group word bank has sufficient instances for repeated answers', () => {
 for(const g of FILL_GROUPS) {
  const counts = new Map();
  for(const q of g.questions) for(const answer of (q.answers || [q.answer])) counts.set(answer,(counts.get(answer)||0)+1);
  for(const [word,n] of counts) assert.ok(g.words.filter(w=>w===word).length>=n,`${g.id}: ${word} required ${n} times`);
 }
});
test('navigation and score safeguards',()=>{
 const app=fs.readFileSync(path.join(base,'src/App.tsx'),'utf8');
 const practice=fs.readFileSync(path.join(base,'src/components/VocabularyPractice.tsx'),'utf8');
 assert.ok(app.includes('<VocabularyPractice'));
 assert.ok(practice.includes('disabled={!answered} onClick={() => {sound.playPracticeSound(\'tap\');setTfIndex(0)'));
 assert.ok(practice.includes('usedElsewhere.length >= allowed'));
 assert.ok(practice.includes('blankKey(q.id,j)'));
});
