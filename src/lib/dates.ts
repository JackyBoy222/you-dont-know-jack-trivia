import { addMonths, format, getDay, setDate } from "date-fns";
export function nthWednesday(year:number, month:number, occurrence:1|2):Date { const first=setDate(new Date(year,month,1,19,0,0,0),1); const offset=(3-getDay(first)+7)%7; return setDate(first,1+offset+(occurrence-1)*7); }
export function regularDates(year:number,month:number){return [nthWednesday(year,month,1),nthWednesday(year,month,2)];}
export function nextRegularDates(from=new Date(),count=6){const out:Date[]=[]; let cursor=new Date(from.getFullYear(),from.getMonth(),1); while(out.length<count){for(const d of regularDates(cursor.getFullYear(),cursor.getMonth())) if(d>=from) out.push(d); cursor=addMonths(cursor,1);} return out.slice(0,count);}
export function toISODate(d:Date){return format(d,"yyyy-MM-dd'T'HH:mm:ss");}
