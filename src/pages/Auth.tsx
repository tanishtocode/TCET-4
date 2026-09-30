import {useState} from 'react'
import {sb} from '../lib/supabase'
import {geocode} from '../lib/geo'
import {Btn,Glass} from '../components/ui'
export default function Auth(){
const[mode,setMode]=useState<'in'|'up'>('up'),[role,setRole]=useState<'donor'|'ngo'>('donor')
const[f,setF]=useState({email:'',password:'',name:'',address:'',capacity:'50',pickup:'yes',contact:'',veg:true,nonveg:true})
const[err,setErr]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false)
const set=(k:string)=>(e:any)=>setF({...f,[k]:e.target.type==='checkbox'?e.target.checked:e.target.value})
async function submit(){setErr('');setMsg('');setBusy(true)
try{
if(mode==='in'){const{error}=await sb.auth.signInWithPassword({email:f.email,password:f.password});if(error)throw error}
else{
if(!f.name.trim())throw new Error('Please enter your name or organization.')
let extra={}
if(role==='ngo'){const g=await geocode(f.address);if(!g)throw new Error("We couldn't locate that address. Please add the area and city.")
const accepts=[f.veg&&'veg',f.nonveg&&'nonveg'].filter(Boolean);if(!accepts.length)throw new Error('Select at least one food type you accept.')
extra={address:f.address,lat:g.lat,lng:g.lng,capacity:+f.capacity,accepts,pickup:f.pickup,contact:f.contact}}
const{data,error}=await sb.auth.signUp({email:f.email,password:f.password,options:{data:{role,name:f.name,...extra}}})
if(error)throw error;if(!data.session)setMsg('Account created. Confirm your email, then sign in.')}
}catch(e:any){setErr(e.message||'Something went wrong. Please try again.')}
setBusy(false)}
return<Glass className="mx-auto max-w-md space-y-3"><h2 className="text-2xl font-bold">{mode==='up'?'Create your account':'Welcome back'}</h2>
{mode==='up'&&<div className="grid grid-cols-2 gap-2">{(['donor','ngo'] as const).map(r=><Btn key={r} v={role===r?'primary':'ghost'} onClick={()=>setRole(r)}>{r==='donor'?'🍽 I have food':'🤝 I am an NGO'}</Btn>)}</div>}
{mode==='up'&&<input className="input" placeholder={role==='ngo'?'NGO name':'Business / hall name'} value={f.name} onChange={set('name')}/>}
<input className="input" type="email" placeholder="Email" value={f.email} onChange={set('email')}/>
<input className="input" type="password" placeholder="Password (min 6 characters)" value={f.password} onChange={set('password')}/>
{mode==='up'&&role==='ngo'&&<><input className="input" placeholder="Address (area, city)" value={f.address} onChange={set('address')}/>
<div className="grid grid-cols-2 gap-2"><input className="input" type="number" placeholder="Capacity (meals)" value={f.capacity} onChange={set('capacity')}/><select className="input" value={f.pickup} onChange={set('pickup')}><option value="yes">Pickup available</option><option value="limited">Limited pickup</option><option value="no">No pickup</option></select></div>
<input className="input" placeholder="Contact phone" value={f.contact} onChange={set('contact')}/>
<div className="flex gap-4 text-sm"><label><input type="checkbox" checked={f.veg} onChange={set('veg')}/> Vegetarian</label><label><input type="checkbox" checked={f.nonveg} onChange={set('nonveg')}/> Non-vegetarian</label></div></>}
{err&&<p className="rounded-xl bg-red-500/20 p-3 text-sm">{err}</p>}{msg&&<p className="rounded-xl bg-emerald-400/20 p-3 text-sm">{msg}</p>}
<Btn className="w-full" disabled={busy} onClick={submit}>{busy?'Please wait…':mode==='up'?'Sign up':'Sign in'}</Btn>
<button className="w-full text-sm text-white/70 underline" onClick={()=>{setMode(mode==='up'?'in':'up');setErr('')}}>{mode==='up'?'Already have an account? Sign in':'New here? Create an account'}</button></Glass>}
