import{unstable_noStore as noStore}from"next/cache";import{achievements,awards,events,quips,results,teams,venues}from"@/data/demo";import{teamStatistics}from"@/lib/stats";import{createSupabaseAdmin}from"@/lib/supabase/server";
export interface DataService{getEvents():Promise<typeof events>;getTeams():Promise<typeof teams>;getResults():Promise<typeof results>;getVenues():Promise<typeof venues>}
export const mockDataService:DataService={async getEvents(){return structuredClone(events)},async getTeams(){return structuredClone(teams)},async getResults(){return structuredClone(results)},async getVenues(){return structuredClone(venues)}};
export async function getData(){
  noStore();
  if(process.env.NEXT_PUBLIC_USE_DEMO_DATA==="false"){
    const supabase=createSupabaseAdmin();
    if(supabase){
      const{data}=await supabase.from("app_settings").select("value").eq("key","host_console_state").maybeSingle();
      const state=data?.value as{shows?:typeof events;teams?:typeof teams;results?:typeof results;venues?:typeof venues}|undefined;
      if(state?.shows&&state.teams&&state.results&&state.venues){
        return{events:state.shows,teams:state.teams,results:state.results,venues:state.venues,quips,awards,achievements,stats:teamStatistics(state.teams,state.results),isDemo:state.shows.some(item=>item.isDemo)||state.teams.some(item=>item.isDemo)};
      }
    }
  }
  const[eventList,teamList,resultList,venueList]=await Promise.all([mockDataService.getEvents(),mockDataService.getTeams(),mockDataService.getResults(),mockDataService.getVenues()]);
  return{events:eventList,teams:teamList,results:resultList,venues:venueList,quips,awards,achievements,stats:teamStatistics(teamList,resultList),isDemo:true};
}
