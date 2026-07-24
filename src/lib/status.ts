import type { EventStatus } from "@/types";
export function effectiveStatus(date:string,stored:EventStatus,now=new Date()):EventStatus {if(["canceled","postponed","active"].includes(stored))return stored; const d=new Date(date); if(stored==="completed"||d.getTime()+4*60*60*1000<now.getTime())return "completed";return "upcoming";}
