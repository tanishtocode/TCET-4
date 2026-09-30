import {useState} from 'react'
import {useStore} from '../store'
import {extract} from '../lib/ai'
import {matchNgos} from '../lib/match'
import {geocode} from '../lib/geo'
import {fromHHMM,toHHMM,timeStr} from '../lib/util'
import type {Extracted} from '../types'
import {Btn,Countdown,Glass,Timeline,StatusBadge} from '../components/ui'
import {effStatus} from '../lib/util'
type Form={quantity:string;foodType:string;veg:string;location:string;time:string}
const SAMPLES=['50 plate dal chawal bacha hai Sunrise Lawns, Andheri East pe, 10 baje tak utha lo','60 veg biryani meals left at Royal Banquet Hall. Pickup within 45 minutes.','We have around 70 veg thalis left from today\'s function. We\'re at Sunrise Lawns. Someone can collect them within 90 minutes.','some food left at our place']
const toForm=(e:Extracted):Form=>({quantity:e.quantity?String(e.quantity):'',foodType:e.foodType??'',veg:e.veg===undefined?'':e.veg?'veg':'nonveg',location:e.location??'',time:e.deadline?toHHMM(e.deadline):''})
function validate(f:Form){const e:string[]=[],dl=fromHHMM(f.time)
if(!(+f.quantity>0))e.push('I couldn\'t determine the quantity. Please enter it before continuing.')
if(!f.foodType.trim())e.push('I couldn\'t determine the food type. Please enter it.')
if(!f.veg)e.push('Please choose vegetarian or non-vegetarian.')
if(!f.location.trim())e.push('I couldn\'t determine the pickup location. Please enter it before continuing.')
if(!f.time)e.push('We couldn\'t determine the pickup deadline. Please add one before publishing the donation.')
else if(!dl||dl<=Date.now())e.push('The pickup deadline is invalid or has already passed.')
return e}
export default function Donor(){
const s=useStore();const[text,setText]=useState('');const[step,setStep]=useState<'in'|'review'|'match'|'result'>('in')
const[f,setF]=useState<Form>(toForm({}));const[src,setSrc]=useState('llm');const[busy,setBusy]=useState(false);const[err,setErr]=useState('')
const[edit,setEdit]=useState(false);const[cur,setCur]=useState('');const[why,setWhy]=useState('')
const d=s.donations.find(x=>x.id===cur)
async function analyze(){setErr('')
if(!text.trim())return setErr('Please describe the surplus food first.')
setBusy(true)
try{const r=await extract(text);setF(toForm(r.data));setSrc(r.source);setEdit(false);setStep('review')}catch(e:any){setF(toForm({}));setSrc('manual');setEdit(true);setStep('review');setErr('AI error: '+(e.message||'unknown')+'. Please enter the details manually.')}
setBusy(false)}
async function confirm(){setErr('');setBusy(true)
try{const g=await geocode(f.location)
if(!g){setErr("We couldn't locate that pickup address. Please add the area and city, e.g. 'Royal Banquet Hall, Andheri East'.");setBusy(false);return}
const id=await s.publish({quantity:+f.quantity,foodType:f.foodType,veg:f.veg==='veg',location:f.location,lat:g.lat,lng:g.lng,deadline:fromHHMM(f.time)!})
setCur(id);setStep('match');setTimeout(()=>setStep('result'),1800)}catch{setErr('Could not publish the donation. Check your connection and try again.')}
setBusy(false)}
const errs=validate(f);const set=(k:keyof Form)=>(e:{target:{value:string}})=>setF({...f,[k]:e.target.value})
const matches=d?matchNgos(d,s.ngos,s.now).slice(0,3):[]
const tiles:[string,string,string][]=[['🍱','Quantity',f.quantity&&`${f.quantity} meals`],['🥗','Food Type',f.foodType],['📍','Location',f.location],['⏰','Pickup Deadline',f.time&&timeStr(fromHHMM(f.time)!)]] as any
const mine=s.donations.filter(x=>x.donorId===s.uid)
return<div className="space-y-6">
{step==='in'&&<Glass><h2 className="text-2xl font-bold">Create Food Donation</h2><p className="mb-3 text-sm text-white/70">Just tell us what's left — no long forms.</p>
<textarea className="input h-36" value={text} onChange={e=>setText(e.target.value)} placeholder="40 plates biryani, pickup before 11 pm from Royal Banquet Hall"/>
<div className="mt-2 flex flex-wrap gap-2">{SAMPLES.map(x=><button key={x} onClick={()=>setText(x)} className="badge text-left hover:bg-white/20">Try: {x.slice(0,34)}…</button>)}</div>
{err&&<p className="mt-3 rounded-xl bg-red-500/20 p-3 text-sm">{err}</p>}
<Btn className="mt-4 w-full sm:w-auto" disabled={busy} onClick={analyze}>{busy?'Reading your message…':'✨ Create Listing with AI'}</Btn></Glass>}
{step==='review'&&<Glass><div className="flex items-center justify-between"><h2 className="text-2xl font-bold">{src==='llm'?'AI Understood':'Enter Details'}</h2><span className="badge">{src==='llm'?'Gemini AI':'Manual entry'}</span></div>
<p className="mb-4 text-sm text-white/70">Please verify these details before publishing.</p>
{!edit?<div className="grid gap-3 sm:grid-cols-2">{tiles.map(([i,l,v])=><div key={l} className={`rounded-2xl border p-4 ${v?'border-white/20 bg-white/10':'border-amber-300/50 bg-amber-400/10'}`}><div className="text-xs text-white/60">{i} {l}</div><div className="text-lg font-bold">{v||'Missing'}</div></div>)}</div>
:<div className="grid gap-3 sm:grid-cols-2"><input className="input" type="number" placeholder="Quantity" value={f.quantity} onChange={set('quantity')}/><input className="input" placeholder="Food type" value={f.foodType} onChange={set('foodType')}/>
<select className="input" value={f.veg} onChange={set('veg')}><option value="">Veg / Non-veg?</option><option value="veg">Vegetarian</option><option value="nonveg">Non-vegetarian</option></select>
<input className="input" placeholder="Pickup location" value={f.location} onChange={set('location')}/><input className="input" type="time" value={f.time} onChange={set('time')}/></div>}
{errs.length>0&&<ul className="mt-3 space-y-1 rounded-xl bg-amber-400/15 p-3 text-sm">{errs.map(x=><li key={x}>⚠️ {x}</li>)}</ul>}
{err&&<p className="mt-3 rounded-xl bg-red-500/20 p-3 text-sm">{err}</p>}<div className="mt-4 flex flex-wrap gap-3"><Btn v="ghost" onClick={()=>setEdit(!edit)}>{edit?'Done Editing':'Edit Details'}</Btn><Btn disabled={errs.length>0||busy} onClick={confirm}>Confirm Donation</Btn><Btn v="ghost" onClick={()=>setStep('in')}>Back</Btn></div></Glass>}
{step==='match'&&<Glass className="py-12 text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-emerald-300"/><h2 className="text-2xl font-bold">Finding the Right NGO…</h2></Glass>}
{step==='result'&&d&&<>
<Glass className="flex flex-wrap items-center justify-between gap-4"><div><StatusBadge s={effStatus(d,s.now)}/><h2 className="mt-2 text-xl font-bold">{d.quantity} meals · {d.foodType}</h2><p className="text-sm text-white/70">📍 {d.location}</p></div><Countdown d={d} now={s.now}/></Glass>
{matches.length?<><h2 className="text-2xl font-bold">{matches.length} Suitable NGO{matches.length>1?'s':''} Found</h2>
<div className="grid gap-4 md:grid-cols-3">{matches.map((m,i)=><Glass key={m.ngo.id}><div className="text-sm">{i===0?'🥇 Best fit':'Good fit'}</div><h3 className="text-lg font-bold">{m.ngo.name}</h3>{m.ngo.demo&&<span className="badge">Demo NGO</span>}<div className="text-3xl font-extrabold text-emerald-300">{m.score}% Match</div>
<p className="mt-1 text-sm text-white/75">📍 {m.km} km · 👥 {m.ngo.capacity} meals<br/>🚗 {m.ngo.pickup==='yes'?'Pickup available':'Limited pickup availability'}</p>
<Btn v="ghost" className="mt-3 w-full !py-2" onClick={()=>setWhy(why===m.ngo.id?'':m.ngo.id)}>Why this match?</Btn>
{why===m.ngo.id&&<div className="mt-3 rounded-2xl bg-white/10 p-3 text-sm"><b>Recommended because:</b><ul className="mt-1 space-y-1">{m.reasons.map(r=><li key={r}>✓ {r}</li>)}</ul></div>}</Glass>)}</div>
<p className="text-sm text-white/70">Matching NGOs can now see this listing on their dashboard. Switch to the NGO tab to claim it.</p></>
:<Glass className="text-center"><h2 className="text-xl font-bold">No Suitable Match Yet</h2><p className="text-white/75">We couldn't find an NGO that currently meets the donation requirements. The donation remains active until the deadline.</p><div className="my-3 flex justify-center"><Countdown d={d} now={s.now}/></div><Btn onClick={()=>{setStep('match');setTimeout(()=>setStep('result'),1500)}}>Keep Searching</Btn></Glass>}
<Glass><h3 className="mb-2 font-bold">Live status</h3><Timeline status={effStatus(d,s.now)}/></Glass>
<Btn v="ghost" onClick={()=>{setText('');setStep('in')}}>+ New donation</Btn></>}
{step==='in'&&mine.length>0&&<div className="space-y-3"><h3 className="font-bold">Your donations</h3>{mine.map(x=><Glass key={x.id} className="flex items-center justify-between gap-3"><div><StatusBadge s={effStatus(x,s.now)}/><p className="mt-1 font-semibold">{x.quantity} meals · {x.foodType}</p></div><Countdown d={x} now={s.now}/></Glass>)}</div>}
</div>}