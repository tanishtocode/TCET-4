import {useStore} from '../store'
import {Glass} from '../components/ui'
import {effStatus} from '../lib/util'
export default function Impact(){
const{donations,now}=useStore(),done=donations.filter(d=>d.status==='COMPLETED'),meals=done.reduce((a,d)=>a+d.quantity,0)
const expired=donations.filter(d=>effStatus(d,now)==='EXPIRED').length,closed=done.length+expired
const cl=donations.filter(d=>d.claimedAt),avg=cl.length?Math.round(cl.reduce((a,d)=>a+d.claimedAt!-d.createdAt,0)/cl.length/60000)+' min':'—'
const stats:[string,string,string][]=[['🍱',String(meals),'meals rescued'],['🤝',String(done.length),'completed donations'],['🏠',String(new Set(done.map(d=>d.ngoId)).size),'NGOs supported'],['🚚',closed?Math.round(done.length/closed*100)+'%':'—','successful pickups'],['⏱',avg,'avg time to claim']]
const days=[...Array(7)].map((_,i)=>{const t=new Date(now-(6-i)*864e5);return{l:i===6?'Today':t.toLocaleDateString([],{weekday:'short'}),v:done.filter(d=>new Date(d.pickedAt??d.claimedAt??d.createdAt).toDateString()===t.toDateString()).reduce((a,d)=>a+d.quantity,0)}}),max=Math.max(1,...days.map(x=>x.v))
return<div className="space-y-6"><Glass><h2 className="text-2xl font-bold">Impact</h2><p className="text-sm text-white/60">Live numbers from real completed donations on the platform.</p></Glass>
<div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{stats.map(([i,v,l])=><Glass key={l}><div className="text-2xl">{i}</div><div className="text-2xl font-extrabold">{v}</div><div className="text-xs text-white/70">{l}</div></Glass>)}</div>
<Glass><h3 className="mb-4 font-bold">Meals rescued by day</h3>{meals===0&&<p className="mb-2 text-sm text-white/60">No completed donations yet — complete one to see it here.</p>}<div className="flex h-48 items-end gap-2">{days.map(x=><div key={x.l} className="flex flex-1 flex-col items-center gap-1"><span className="text-xs">{x.v}</span><div className="w-full rounded-t-xl bg-gradient-to-t from-emerald-500/70 to-emerald-300" style={{height:`${Math.max(2,x.v/max*100)}%`}}/><span className="text-xs text-white/60">{x.l}</span></div>)}</div></Glass></div>}
