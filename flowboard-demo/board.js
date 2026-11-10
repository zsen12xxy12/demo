export const columns = {todo:'待办',doing:'进行中',done:'已完成'};
export const priorities = {high:'高优先级',medium:'中优先级',low:'低优先级'};
export function task(input, id = crypto.randomUUID()) {
  const title = String(input.title ?? '').trim();
  if (!title || title.length > 100) throw new Error('标题需为 1–100 个字符');
  if (!(Object.hasOwn(columns,input.status)) || !(Object.hasOwn(priorities,input.priority))) throw new Error('无效的状态或优先级');
  return {id,title,description:String(input.description ?? '').slice(0,1000),status:input.status,priority:input.priority};
}
export function move(tasks,id,status) {
  if (!(Object.hasOwn(columns,status))) throw new Error('无效状态');
  return tasks.map(t => t.id === id ? {...t,status} : t);
}
export function search(tasks,query='',priority='all') {
  const q=query.trim().toLocaleLowerCase();
  return tasks.filter(t=>(priority==='all'||t.priority===priority)&&`${t.title} ${t.description}`.toLocaleLowerCase().includes(q));
}
export function decode(raw) {
  const parsed=JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('无效的看板数据');
  const ids=new Set();
  return parsed.map(t=>{if(!t || typeof t.id!=='string'||!t.id||ids.has(t.id))throw new Error('无效任务 ID');ids.add(t.id);return task(t,t.id);});
}
export const demo = [
{id:'demo-1',title:'梳理产品需求',description:'把想法拆成清晰、可执行的小任务。',status:'todo',priority:'high'},
{id:'demo-2',title:'设计移动端界面',description:'让看板在手机上也能轻松使用。',status:'todo',priority:'medium'},
{id:'demo-3',title:'开发任务管理',description:'支持新建、编辑、拖拽和状态切换。',status:'doing',priority:'high'},
{id:'demo-4',title:'建立项目骨架',description:'简单、轻量、零运行时依赖。',status:'done',priority:'low'}];
