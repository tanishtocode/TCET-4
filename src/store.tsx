import {createContext,useCallback,useContext,useEffect,useState,ReactNode} from 'react'
import type {Session} from '@supabase/supabase-js'
import {sb} from './lib/supabase'
import type {Donation,Ngo,Profile} from './types'
const toD=(r:any):Donation=>({id:r.id,donorId:r.donor_id,donor:r.donor_name,quantity:r.quantity,foodType:r.food_type,veg:r.veg,location:r.location,lat:r.lat,lng:r.lng,createdAt:+new Date(r.created_at),deadline:+new Date(r.deadline),status:r.status,ngoId:r.ngo_id??undefined,claimedAt:r.claimed_at?+new Date(r.claimed_at):undefined,pickedAt:r.picked_at?+new Date(r.picked_at):undefined})
const toN=(r:any):Ngo=>({id:r.id,userId:r.user_id,name:r.name,area:r.area??'',lat:r.lat,lng:r.lng,capacity:r.capacity,accepts:r.accepts,pickup:r.pickup,contact:r.contact??'',demo:r.is_demo})
export interface NewDonation{quantity:number;foodType:string;veg:boolean;location:string;lat:number;lng:number;deadline:number}
type Ctx={ready:boolean;uid?:string;profile:Profile|null;myNgo?:Ngo;donations:Donation[];ngos:Ngo[];now:number;publish:(x:NewDonation)=>Promise<string>;claim:(id:string)=>Promise<string|null>;advance:(id:string)=>Promise<string|null>;signOut:()=>void}
const C=createContext<Ctx>(null!)
export const useStore=()=>useContext(C)
export function Provider({children}:{children:ReactNode}){
const[session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(false),[profile,setProfile]=useState<Profile|null>(null)
const[donations,setD]=useState<Donation[]>([]),[ngos,setN]=useState<Ngo[]>([]),[now,setNow]=useState(Date.now())
const uid=session?.user.id
const load=useCallback(async()=>{await sb.rpc('expire_stale')
const[d,n]=await Promise.all([sb.from('donations').select('*').order('created_at',{ascending:false}),sb.from('ngos').select('*')])
if(d.data)setD(d.data.map(toD));if(n.data)setN(n.data.map(toN))},[])
useEffect(()=>{sb.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)})
const{data:l}=sb.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>l.subscription.unsubscribe()},[])
useEffect(()=>{if(!uid){setProfile(null);setD([]);return}
sb.from('profiles').select('*').eq('id',uid).maybeSingle().then(({data})=>setProfile(data as Profile|null));load()
const ch=sb.channel('live-donations').on('postgres_changes',{event:'*',schema:'public',table:'donations'},()=>load()).subscribe()
const t=setInterval(load,30000);return()=>{sb.removeChannel(ch);clearInterval(t)}},[uid,load])
useEffect(()=>{const i=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(i)},[])
const publish=async(x:NewDonation)=>{const{data,error}=await sb.from('donations').insert({donor_id:uid,donor_name:profile!.name,quantity:x.quantity,food_type:x.foodType,veg:x.veg,location:x.location,lat:x.lat,lng:x.lng,deadline:new Date(x.deadline).toISOString()}).select().single()
if(error)throw error;await load();return data.id as string}
const rpc=async(fn:string,id:string)=>{const{error}=await sb.rpc(fn,{p_id:id});await load();return error?error.message:null}
return<C.Provider value={{ready,uid,profile,myNgo:ngos.find(n=>n.userId===uid),donations,ngos,now,publish,claim:id=>rpc('claim_donation',id),advance:id=>rpc('advance_donation',id),signOut:()=>{sb.auth.signOut()}}}>{children}</C.Provider>}
