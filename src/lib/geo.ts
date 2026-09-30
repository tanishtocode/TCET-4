const CITY=(import.meta.env.VITE_DEFAULT_CITY as string)||'Mumbai'
type P={lat:number;lng:number}
async function one(q:string):Promise<P|null>{try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`);if(!r.ok)return null;const j=await r.json();return j[0]?{lat:+j[0].lat,lng:+j[0].lon}:null}catch{return null}}
export const geocode=async(q:string)=>(await one(q))??(await one(`${q}, ${CITY}`))
/** Haversine distance ×1.3 as a rough road-distance factor */
export const km=(a:P,b:P)=>{const t=(x:number)=>x*Math.PI/180,dl=t(b.lat-a.lat),dg=t(b.lng-a.lng),h=Math.sin(dl/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dg/2)**2;return Math.round(2*6371*Math.asin(Math.sqrt(h))*13)/10}
