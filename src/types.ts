export type Status='AVAILABLE'|'CLAIMED'|'PICKUP_IN_PROGRESS'|'PICKED_UP'|'COMPLETED'|'EXPIRED'
export interface Ngo{id:string;userId:string|null;name:string;area:string;lat:number;lng:number;capacity:number;accepts:('veg'|'nonveg')[];pickup:'yes'|'limited'|'no';contact:string;demo:boolean}
export interface Donation{id:string;donorId:string;donor:string;quantity:number;foodType:string;veg:boolean;location:string;lat:number|null;lng:number|null;createdAt:number;deadline:number;status:Status;ngoId?:string;claimedAt?:number;pickedAt?:number}
export interface Profile{id:string;role:'donor'|'ngo';name:string}
export interface Extracted{quantity?:number;foodType?:string;veg?:boolean;location?:string;deadline?:number}
