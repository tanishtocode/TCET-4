import type {ButtonHTMLAttributes,ReactNode} from 'react'
import type {Donation,Status} from '../types'
import {clock,effStatus} from '../lib/util'
export const Glass=({children,className=''}:{children:ReactNode;className?:string})=><div className={`glass rise ${className}`}>{children}</div>
export const Btn=({v='primary',className='',...p}:ButtonHTMLAttributes<HTMLButtonElement>&{v?:'primary'|'ghost'|'danger'})=><button {...p} className={`btn btn-${v} ${className}`}/>
export function Countdown({d,now}:{d:Donation;now:number}){
const s=effStatus(d,now)
if(s==='EXPIRED')return<div className="badge border-red-300/40 bg-red-500/30">⛔ Donation Expired</div>
if(s==='COMPLETED'||s==='PICKED_UP')return null
const ms=d.deadline-now,m=ms/60000,lv=m>60?['🟢','Normal','text-emerald-300']:m>20?['🟠','Urgent','text-amber-300']:['🔴','Critical','text-red-300']
return<div><div className={`text-2xl font-bold tabular-nums ${lv[2]}`}>{clock(ms)}</div><div className="text-xs text-white/70">{lv[0]} {Math.ceil(m)} min remaining · {lv[1]}</div></div>}
const STEPS=['Donation Created','AI Details Confirmed','NGO Matched','Donation Claimed','Pickup In Progress','Picked Up','Completed']
const IDX:Record<Status,number>={AVAILABLE:3,CLAIMED:4,PICKUP_IN_PROGRESS:5,PICKED_UP:6,COMPLETED:7,EXPIRED:3}
export function Timeline({status}:{status:Status}){const i=IDX[status]
return<ol className="space-y-1 text-sm">{STEPS.map((s,k)=><li key={s} className={k<i?'text-emerald-300':k===i&&status!=='EXPIRED'?'font-semibold text-white':'text-white/40'}>{k<i?'✓':k===i&&status!=='EXPIRED'?'●':'○'} {s}</li>)}</ol>}
export const StatusBadge=({s}:{s:Status})=><span className="badge">{s.replace(/_/g,' ')}</span>
