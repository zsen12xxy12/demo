import {columns,priorities,task,move,search,decode,demo} from './board.js';
const $=s=>document.querySelector(s), key='flowboard.v1';
let tasks=structuredClone(demo), editing=null, storageError=false;
try {const saved=localStorage.getItem(key);if(saved!==null) tasks=decode(saved);} catch {storageError=true;}
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
function save(){try{localStorage.setItem(key,JSON.stringify(tasks));storageError=false;}catch{storageError=true;}render();}
function render(){
 $('#board').replaceChildren();
 const visible=search(tasks,$('#search').value,$('#filter').value);
 for(const [status,label] of Object.entries(columns)){
  const section=node('section',undefined,`column ${status}`);section.dataset.status=status;section.setAttribute('aria-label',label);
  const heading=node('h2',label);heading.append(node('span',tasks.filter(t=>t.status===status).length,'count'));section.append(heading);
  const cards=visible.filter(t=>t.status===status);
  for(const t of cards){
   const card=node('article',undefined,'card');card.draggable=true;card.dataset.id=t.id;
   card.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',t.id);e.dataTransfer.effectAllowed='move';});
   card.append(node('span',priorities[t.priority],`badge ${t.priority}`));
   const edit=node('button',t.title,'card-title');edit.setAttribute('aria-label',`编辑 ${t.title}`);edit.addEventListener('click',()=>open(t));card.append(edit);
   if(t.description)card.append(node('p',t.description,'description'));
   const select=node('select');select.setAttribute('aria-label',`${t.title} 的状态`);
   for(const [value,text] of Object.entries(columns)){const o=node('option',text);o.value=value;o.selected=value===t.status;select.append(o);}
   select.addEventListener('change',()=>{tasks=move(tasks,t.id,select.value);save();});card.append(select);section.append(card);
  }
  if(!cards.length)section.append(node('p','暂无任务','empty'));
  section.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';section.classList.add('dragover');});
  section.addEventListener('dragleave',()=>section.classList.remove('dragover'));
  section.addEventListener('drop',e=>{e.preventDefault();tasks=move(tasks,e.dataTransfer.getData('text/plain'),status);save();});
  const add=node('button','＋ 添加任务','add');add.addEventListener('click',()=>open(null,status));section.append(add);$('#board').append(section);
 }
 const done=tasks.filter(t=>t.status==='done').length, percent=tasks.length?Math.round(done/tasks.length*100):0;
 $('#total').textContent=tasks.length;$('#active').textContent=tasks.filter(t=>t.status==='doing').length;$('#completed').textContent=`${percent}%`;$('#progress').style.width=`${percent}%`;
 $('#notice').textContent=storageError?'无法读取或保存本地数据。当前修改仅在本次页面中保留，请检查浏览器存储权限。':'任务仅保存在当前浏览器，无需登录。拖动卡片或使用状态菜单移动任务。';
}
function open(t,status='todo'){
 editing=t?.id??null;$('#form').reset();$('#title').value=t?.title??'';$('#description').value=t?.description??'';$('#status').value=t?.status??status;$('#priority').value=t?.priority??'medium';$('#delete').hidden=!t;$('#error').textContent='';$('#dialog-title').textContent=t?'编辑任务':'新建任务';$('#editor').showModal();$('#title').focus();
}
$('#new').addEventListener('click',()=>open(null));
for(const id of ['close','cancel'])$('#'+id).addEventListener('click',()=>$('#editor').close());
$('#form').addEventListener('submit',e=>{e.preventDefault();try{const values=Object.fromEntries(new FormData(e.target));const value=editing?task(values,editing):task(values);tasks=editing?tasks.map(t=>t.id===editing?value:t):[...tasks,value];save();$('#editor').close();}catch(error){$('#error').textContent=error.message;}});
$('#delete').addEventListener('click',()=>{if(confirm('确定删除这个任务？')){tasks=tasks.filter(t=>t.id!==editing);save();$('#editor').close();}});
$('#search').addEventListener('input',render);$('#filter').addEventListener('change',render);render();
