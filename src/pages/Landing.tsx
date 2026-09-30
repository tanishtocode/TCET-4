import type {Page} from '../App'
import {Btn,Glass} from '../components/ui'
const PLANS=[['Starter','₹999/mo',['Food listings','NGO matching','Donation history','Notifications']],['Business','₹2,499/mo',['Unlimited listings','Multiple staff users','Analytics','Impact reports','Priority support']],['Enterprise','Custom',['Multiple locations','Chains','Advanced reporting','API integration']]] as const
export default function Landing({go}:{go:(p:Page)=>void}){
return<div className="space-y-12">
<section className="rise pt-6 text-center"><span className="badge">AI-powered surplus food matching</span>
<h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">Rescue surplus.<br/>Deliver meals.<br/><span className="text-emerald-300">Before time runs out.</span></h1>
<p className="mx-auto mt-4 max-w-2xl text-white/75">MealLink uses AI to turn messy surplus-food messages into structured donations and quickly connect them with suitable NGOs before the food expires.</p>
<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Btn onClick={()=>go('donor')}>Donate Food</Btn><Btn v="ghost" onClick={()=>go('ngo')}>Find Donations</Btn></div>
<div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">{['💬 Message','🤖 AI understands','📍 NGO matched','🍱 Food rescued'].map((s,i)=><span key={s} className="flex items-center gap-2"><span className="glass !rounded-full !px-4 !py-2">{s}</span>{i<3&&<span className="text-white/40">→</span>}</span>)}</div></section>
<section><h2 className="mb-4 text-2xl font-bold">How it works</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{['Tell us what food is left','AI creates the donation listing','We find suitable NGOs','NGO claims and picks it up'].map((t,i)=><Glass key={t}><div className="text-3xl font-black text-emerald-300">{i+1}</div><p className="mt-1 font-semibold">{t}</p></Glass>)}</div></section>
<section><h2 className="mb-4 text-2xl font-bold">Why MealLink?</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{['⚡ Fast matching','🤖 AI-assisted extraction','⏱ Deadline-aware','📍 Location-aware','🤝 Transparent matching','📊 Business impact tracking'].map(t=><Glass key={t}><p className="font-semibold">{t}</p></Glass>)}</div></section>
<section><h2 className="mb-1 text-2xl font-bold">Proposed pricing</h2><p className="mb-4 text-sm text-white/60">Businesses pay; NGOs are always free. Prototype prices, not validated market prices.</p>
<div className="grid gap-4 md:grid-cols-3">{PLANS.map(([n,p,f])=><Glass key={n}><h3 className="font-bold">{n}</h3><div className="text-2xl font-extrabold text-emerald-300">{p}</div><ul className="mt-2 space-y-1 text-sm text-white/80">{f.map(x=><li key={x}>✓ {x}</li>)}</ul></Glass>)}</div></section></div>}
