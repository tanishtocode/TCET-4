import type {Donation,Ngo} from '../types'
import {km} from './geo'
export const WEIGHTS={distance:.3,capacity:.25,food:.2,pickup:.15,time:.1}
export interface Match{ngo:Ngo;km:number;score:number;feasible:boolean;reasons:string[]}
/** Transparent scoring. Hard requirements: capacity, food type, pickup, ETA before deadline. */
export function scoreNgo(d:Donation,n:Ngo,now:number):Match{
const dist=d.lat==null||d.lng==null?99:km({lat:d.lat,lng:d.lng},n),mins=(d.deadline-now)/60000,eta=dist*3+10
const dS=Math.max(0,1-dist/12),cap=n.capacity>=d.quantity?1:0,food=n.accepts.includes(d.veg?'veg':'nonveg')?1:0
const pick=n.pickup==='yes'?1:n.pickup==='limited'?.5:0,time=mins>0&&eta<=mins?.5+.5*(1-eta/mins):0
const W=WEIGHTS,score=Math.round(100*(W.distance*dS+W.capacity*cap+W.food*food+W.pickup*pick+W.time*time))
const reasons=[`${dist} km from pickup location`,cap?`Can accommodate all ${d.quantity} meals (capacity ${n.capacity})`:`Capacity ${n.capacity} is below ${d.quantity} meals`,
food?`Accepts ${d.veg?'vegetarian':'non-vegetarian'} food`:`Does not accept ${d.veg?'vegetarian':'non-vegetarian'} food`,
pick===1?'Pickup is currently available':pick?'Pickup availability is limited':'Pickup is not available',
time?`Estimated arrival ~${Math.round(eta)} min, before the deadline`:'Cannot realistically arrive before the deadline']
return{ngo:n,km:dist,score,feasible:!!(cap&&food&&pick&&time),reasons}}
export const matchNgos=(d:Donation,ngos:Ngo[],now:number)=>ngos.map(n=>scoreNgo(d,n,now)).filter(m=>m.feasible).sort((a,b)=>b.score-a.score)
