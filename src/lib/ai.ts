import type {Donation,Extracted,Ngo} from '../types'
import {sb} from './supabase'
import {timeStr} from './util'
/** Real LLM extraction via the Supabase Edge Function (Gemini). Throws with the real reason on failure. */
export async function extract(text:string):Promise<{data:Extracted;source:'llm'}>{
const{data,error}=await sb.functions.invoke('clever-worker',{body:{text,now:new Date().toISOString()}})
let detail:string=data?.error||''
if(error){try{detail=(await (error as any).context.json()).error}catch{detail=error.message}}
if(error||!data||data.error)throw new Error(detail||'AI extraction failed')
const dl=data.deadline_iso?+new Date(data.deadline_iso):NaN
return{source:'llm',data:{quantity:data.quantity??undefined,foodType:data.food_type??undefined,veg:data.veg??undefined,location:data.location??undefined,deadline:isNaN(dl)?undefined:dl}}}
export const pickupMessage=(d:Donation,n:Ngo)=>`${n.name} has accepted the donation of ${d.quantity} ${d.foodType.toLowerCase()} meals from ${d.location}. Pickup should be completed before ${timeStr(d.deadline)}. Please keep the food packed and ready.`