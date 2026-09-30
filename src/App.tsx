import {useEffect,useState} from 'react'
import {Provider,useStore} from './store'
import {Glass} from './components/ui'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Donor from './pages/Donor'
import NgoDash from './pages/Ngo'
import Impact from './pages/Impact'
export type Page='home'|'donor'|'ngo'|'impact'|'auth'
function Shell(){
const[page,setPage]=useState<Page>('home'),s=useStore(),role=s.profile?.role
useEffect(()=>{if(role&&page==='auth')setPage(role==='ngo'?'ngo':'donor')},[role,page])
if(!s.ready)return<div className="grid min-h-screen place-items-center text-white/70">Loading…</div>
const go=(p:Page)=>setPage(!s.uid&&(p==='donor'||p==='ngo')?'auth':p)
const tabs=[['home','🏠 Home'],...(role==='donor'?[['donor','🍱 Donate']]:role==='ngo'?[['ngo','🤝 Claim']]:[]),['impact','📊 Impact']] as [Page,string][]
const guard=(need:string,el:JSX.Element)=>role===need?el:<Glass>This area is for {need} accounts. Please sign in with a {need} account.</Glass>
return<div className="relative min-h-screen overflow-x-hidden pb-28 md:pb-10">
<div className="pointer-events-none fixed inset-0 -z-10"><div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl"/><div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl"/><div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl"/></div>
<header className="sticky top-0 z-20 mx-auto max-w-5xl px-4 pt-4"><div className="glass flex items-center justify-between !rounded-2xl !p-3">
<button onClick={()=>setPage('home')} className="text-lg font-extrabold">🍱 Meal<span className="text-emerald-300">Link</span></button>
<nav className="hidden gap-1 md:flex">{tabs.map(([k,l])=><button key={k} onClick={()=>setPage(k)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${page===k?'bg-white/20':'hover:bg-white/10'}`}>{l}</button>)}</nav>
{s.uid?<button onClick={s.signOut} className="badge hover:bg-white/20">{s.profile?.name??'Account'} · Sign out</button>:<button onClick={()=>setPage('auth')} className="badge hover:bg-white/20">Sign in</button>}</div></header>
<main className="mx-auto max-w-5xl px-4 py-6">{page==='home'?<Landing go={go}/>:page==='auth'?<Auth/>:page==='donor'?guard('donor',<Donor/>):page==='ngo'?guard('ngo',<NgoDash/>):<Impact/>}
<p className="mt-10 text-center text-xs text-white/50">The platform does not independently certify food safety. Donors and recipient organizations remain responsible for following applicable food-safety requirements.</p></main>
<nav className="fixed inset-x-3 bottom-3 z-20 md:hidden"><div className="glass flex justify-around !rounded-2xl !p-2">{tabs.map(([k,l])=><button key={k} onClick={()=>setPage(k)} className={`rounded-xl px-3 py-2 text-xs font-semibold ${page===k?'bg-white/20':''}`}>{l}</button>)}</div></nav></div>}
export default()=><Provider><Shell/></Provider>
