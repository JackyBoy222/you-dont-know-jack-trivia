import{achievements,awards,events,results,teams}from"@/data/demo";import{teamStatistics}from"@/lib/stats";
export interface DataService{getEvents():Promise<typeof events>;getTeams():Promise<typeof teams>;getResults():Promise<typeof results>}
export const mockDataService:DataService={async getEvents(){return structuredClone(events)},async getTeams(){return structuredClone(teams)},async getResults(){return structuredClone(results)}};
export async function getData(){const [eventList,teamList,resultList]=await Promise.all([mockDataService.getEvents(),mockDataService.getTeams(),mockDataService.getResults()]);return{events:eventList,teams:teamList,results:resultList,awards,achievements,stats:teamStatistics(teamList,resultList),isDemo:true};}
