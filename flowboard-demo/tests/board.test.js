import {test} from 'node:test';
import assert from 'node:assert/strict';
import {task,move,search,decode,demo} from '../board.js';
test('creates a trimmed task with unique ID',()=>{const t=task({title:' hello ',status:'todo',priority:'high'});assert.equal(t.title,'hello');assert.ok(t.id);assert.equal(t.description,'');});
test('rejects blank and overlong titles and invalid fields',()=>{for(const title of [' ','x'.repeat(101)])assert.throws(()=>task({title,status:'todo',priority:'low'}));assert.throws(()=>task({title:'x',status:'bad',priority:'low'}));});
test('moves task without mutating original data',()=>{const changed=move(demo,'demo-1','done');assert.equal(changed[0].status,'done');assert.equal(demo[0].status,'todo');});
test('unknown task is harmless and invalid target rejected',()=>{assert.deepEqual(move(demo,'missing','done'),demo);assert.throws(()=>move(demo,'demo-1','invalid'));});
test('searches title and description and combines priority filter',()=>{assert.equal(search(demo,'移动').length,1);assert.equal(search(demo,'','high').length,2);assert.equal(search(demo,'移动','high').length,0);});
test('restores valid storage and an intentionally empty board',()=>{assert.deepEqual(decode(JSON.stringify(demo)),demo);assert.deepEqual(decode('[]'),[]);});
test('rejects malformed storage and duplicate IDs',()=>{for(const raw of ['null','{}','broken',JSON.stringify([demo[0],demo[0]])])assert.throws(()=>decode(raw));});
test('rejects inherited property names as statuses or priorities',()=>{
 for(const invalid of ['constructor','toString','__proto__']){
  assert.throws(()=>task({title:'x',status:invalid,priority:'low'}));
  assert.throws(()=>task({title:'x',status:'todo',priority:invalid}));
  assert.throws(()=>move(demo,'demo-1',invalid));
 }
});
test('restores more than 500 tasks without discarding saved data',()=>{
 const large=Array.from({length:501},(_,i)=>task({title:`Task ${i}`,status:'todo',priority:'low'},`task-${i}`));
 assert.deepEqual(decode(JSON.stringify(large)),large);
});
