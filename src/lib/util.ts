import type {Donation,Status} from '../types'
export const effStatus=(d:Donation,now:number):Status=>d.status==='AVAILABLE'&&now>=d.deadline?'EXPIRED':d.status
export const clock=(ms:number)=>{const s=Math.max(0,Math.floor(ms/1000));return[s/3600,(s/60)%60,s%60].map(n=>String(Math.floor(n)).padStart(2,'0')).join(':')}
export const timeStr=(ms:number)=>new Date(ms).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})
export const toHHMM=(ms:number)=>{const d=new Date(ms);return`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`}
export const fromHHMM=(v:string,now=Date.now())=>{const[h,m]=v.split(':').map(Number);if(isNaN(h)||isNaN(m))return undefined;const d=new Date(now);d.setHours(h,m,0,0);return d.getTime()}
