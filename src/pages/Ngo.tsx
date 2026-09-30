import {useState} from 'react'
import {useStore} from '../store'
import {scoreNgo} from '../lib/match'
import {pickupMessage} from '../lib/ai'
import {effStatus,timeStr} from '../lib/util'
import {Btn,Countdown,Glass,Timeline,StatusBadge} from '../components/ui'
const NEXT:Record<string,string>={CLAIMED:'Start pickup',PICKUP_IN_PROGRESS:'Mark picked up',PICKED_UP:'Mark completed'}
export default function NgoDash(){
const s=useStore(),me=s.myNgo,[pend,setPend]=useState(''),[err,setErr]=useState(''),[copied,setCopied]=useState(''),[busy,setBusy]=useState(false)
if(!me)return<Glass>We couldn't find your NGO profile. Please sign out and register again as an NGO.</Glass>
const avail=s.donations.filter(d=>effStatus(d,s.now)==='AVAILABLE').map(d=>({d,m:scoreNgo(d,me,s.now)})).filter(x=>x.m.feasible).sort((a,b)=>b.m.score-a.m.score)
const mine=s.donations.filter(d=>d.ngoId===me.id),pd=s.donations.find(d=>d.id===pend)
async function claim(){setBusy(true);setErr((await s.claim(pd!.id))??'');setBusy(false);setPend('')}
return<div className="space-y-6">
<Glass><h2 className="text-2xl font-bold">Available Near You</h2><p className="text-sm text-white/70">{me.name} · live feed. Only donations you can realistically collect are shown, and new listings appear instantly.</p></Glass>
{err&&<p className="rounded-xl bg-red-500/20 p-3 text-sm">{err}</p>}
{avail.length===0&&<Glass className="text-center text-white/75">🌙 Nothing available right now. This page updates automatically when a donor posts.</Glass>}
<div className="grid gap-4 md:grid-cols-2">{avail.map(({d,m})=><Glass key={d.id}><div className="flex justify-between gap-2"><h3 className="text-lg font-bold">{d.quantity} {d.foodType} Meals</h3><span className="text-xl font-extrabold text-emerald-300">{m.score}%</span></div>
<p className="text-sm text-white/75">📍 {m.km} km · {d.location}<br/>🏢 {d.donor}</p><div className="my-3"><Countdown d={d} now={s.now}/></div>
<Btn className="w-full" onClick={()=>{setErr('');setPend(d.id)}}>CLAIM DONATION</Btn></Glass>)}</div>
{mine.length>0&&<><h2 className="text-2xl font-bold">Your claimed donations</h2><div className="grid gap-4 md:grid-cols-2">{mine.map(d=>{const msg=pickupMessage(d,me);return<Glass key={d.id}>
{d.status==='CLAIMED'&&<h3 className="font-bold text-emerald-300">Donation Claimed</h3>}<StatusBadge s={d.status}/>
<p className="mt-2 text-sm">🏢 Donor: {d.donor}<br/>🤝 NGO: {me.name}<br/>🍱 {d.quantity} meals · {d.foodType}<br/>📍 {d.location}<br/>⏰ Deadline: {timeStr(d.deadline)}</p>
<div className="mt-3 rounded-2xl bg-white/10 p-3 text-sm"><div className="mb-1 text-xs text-white/60">Pickup message</div>{msg}<Btn v="ghost" className="mt-2 !py-1 text-xs" onClick={()=>{navigator.clipboard?.writeText(msg);setCopied(d.id)}}>{copied===d.id?'Copied ✓':'Copy Message'}</Btn></div>
<div className="mt-3"><Timeline status={d.status}/></div>
{NEXT[d.status]&&<Btn className="mt-3 w-full" onClick={async()=>setErr((await s.advance(d.id))??'')}>{NEXT[d.status]}</Btn>}</Glass>})}</div></>}
{pd&&<div className="fixed inset-0 z-30 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"><Glass className="w-full max-w-md !bg-slate-900/70"><h3 className="text-xl font-bold">Confirm claim</h3>
<p className="my-3 text-white/80">You are about to claim {pd.quantity} {pd.veg?'vegetarian':'non-vegetarian'} meals from {pd.location}.</p>
<div className="flex gap-3"><Btn className="flex-1" disabled={busy} onClick={claim}>Confirm Claim</Btn><Btn v="ghost" className="flex-1" onClick={()=>setPend('')}>Cancel</Btn></div></Glass></div>}</div>}
