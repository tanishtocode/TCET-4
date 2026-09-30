// @ts-nocheck

// Supabase Edge Function. Secret required: GEMINI_API_KEY (optional: GEMINI_MODEL)
import {serve} from 'https://deno.land/std@0.224.0/http/server.ts'
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'}
const json=(b:unknown,status=200)=>new Response(JSON.stringify(b),{status,headers:{...cors,'content-type':'application/json'}})
serve(async req=>{
if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
try{
const{text,now}=await req.json()
if(!text||String(text).length>1500)return json({error:'Invalid message'},400)
const key=Deno.env.get('GEMINI_API_KEY');if(!key)return json({error:'GEMINI_API_KEY not set'},500)
const model=Deno.env.get('GEMINI_MODEL')??'gemini-2.5-flash'
const prompt=`Current time (UTC ISO): ${now}. The donor is in India (IST, +05:30).
Extract surplus cooked-food donation details from this message (English, Hindi or Hinglish).
Return ONLY JSON: {"quantity":number|null,"food_type":string|null,"veg":boolean|null,"location":string|null,"deadline_iso":string|null}
Rules: NEVER guess; use null for anything not clearly stated. food_type = short English dish name, prefixed "Vegetarian" or "Non-Vegetarian" when known (e.g. "Vegetarian Biryani"). veg=true only if vegetarian is stated or obvious. location = the pickup place as written. deadline_iso = the stated pickup-by time as ISO 8601 with +05:30 offset: the next occurrence of that clock time, or now + the stated duration. A bare hour for a meal ("10 baje", "by 11") means evening/night.
Message: """${text}"""`
const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0}})})
if(!r.ok)return json({error:'Gemini '+r.status},502)
const j=await r.json();return json(JSON.parse(j.candidates[0].content.parts[0].text))
}catch(e){return json({error:String(e)},500)}})
