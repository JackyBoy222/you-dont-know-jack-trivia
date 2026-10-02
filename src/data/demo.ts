import type{Achievement,Award,Event,Result,Team,Venue}from"../types";
export const venues:Venue[]=[{id:"lecabaret",slug:"lecabaret",name:"LeCabaret",address:"834 N. Rampart St.",city:"New Orleans, Louisiana",description:"An intimate French Quarter room and the original home of the show.",isActive:true,isDemo:true},{id:"private",slug:"private-event",name:"Private Event",address:"Details shared with guests",city:"New Orleans, Louisiana",description:"A custom show for a private crowd.",isActive:true,isDemo:true}];
export const teams:Team[]=[
  {id:"gays-anatomy",slug:"gays-anatomy",name:"Gay’s Anatomy",players:[],isDemo:false},
  {id:"tits-and-slits",slug:"tits-and-slits",name:"Tits and Slits",players:[],isDemo:false},
  {id:"just-dan-two-towers",slug:"just-dan-two-towers",name:"Just Dan: The Two Towers",players:["Dan"],isDemo:false},
  {id:"lump-space-pussies",slug:"lump-space-pussies",name:"Lump Space Pussies",players:[],isDemo:false},
  {id:"the-splice-girls",slug:"the-splice-girls",name:"The Splice Girls",players:[],isDemo:false},
  {id:"tim-richard-company",slug:"tim-richard-company",name:"Tim & Richard and Company",players:["Tim","Richard"],isDemo:false},
  {id:"tim-ava",slug:"tim-ava",name:"Tim Ava",players:[],isDemo:false},
  {id:"queens-of-the-kingdom",slug:"queens-of-the-kingdom",name:"Queens of the Kingdom",players:[],isDemo:false},
  {id:"sharon-stone-fan-club",slug:"sharon-stone-fan-club",name:"The Sharon Stone Fan Club",players:[],isDemo:false},
  {id:"know-nothing",slug:"know-nothing",name:"Know Nothing",players:[],isDemo:false},
  {id:"bug-n-bear",slug:"bug-n-bear",name:"Bug N Bear",players:[],isDemo:false},
  {id:"dan-and-a-friend",slug:"dan-and-a-friend",name:"Dan & A Friend",players:["Dan"],isDemo:false},
  {id:"sainted-by-day",slug:"sainted-by-day",name:"Sainted by Day, Slutted by Night",players:[],isDemo:false},
  {id:"new-year-new-v-c",slug:"new-year-new-v-c",name:"New Year New V & C",players:[],isDemo:false},
  {id:"the-munchees",slug:"the-munchees",name:"The Munchees",players:[],isDemo:false},
  {id:"tony",slug:"tony",name:"Tony",players:["Tony"],isDemo:false},
  {id:"who-da-thunk-it",slug:"who-da-thunk-it",name:"Who Da Thunk It",players:[],isDemo:false},
  {id:"ok-rose",slug:"ok-rose",name:"O.K. Rose",players:[],isDemo:false},
];
export const events:Event[]=[
  {id:"2026-01-07",slug:"regretful-decisions",date:"2026-01-07T19:00:00-06:00",theme:"Regretful Decisions",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,isDemo:false,roundThemes:[]},
  {id:"2026-01-14",slug:"anatomy-of-a-hangover",date:"2026-01-14T19:00:00-06:00",theme:"Anatomy of a Hangover",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,isDemo:false,roundThemes:["Before and After Science","Quote Unquote","High Proof Science","Life of the Party"]},
  {id:"2026-02-04",slug:"sins-saints-spectacle-week-one",date:"2026-02-04T19:00:00-06:00",theme:"Sins, Saints & Spectacle",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,isDemo:false,roundThemes:["Fusion Delusion","Float Your Boat"]},
  {id:"2026-02-11",slug:"sins-saints-spectacle-week-two",date:"2026-02-11T19:00:00-06:00",theme:"Sins, Saints & Spectacle",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,isDemo:false,roundThemes:["Rhyme Time: Mardi Gras Words","Redemption Song","Rhyme Time","Clip Show"]},
  {id:"2026-03-04",slug:"terms-of-phrase",date:"2026-03-04T19:00:00-06:00",theme:"Terms of Phrase",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,isDemo:false,roundThemes:["Idioms","Rhyme Time","Before and After","Clip Show"]},
  {id:"2026-03-11",slug:"seeing-double",date:"2026-03-11T19:00:00-05:00",theme:"Seeing Double",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,isDemo:false,roundThemes:["Dynamic Duo Divided"]},
  {id:"2026-04-01",slug:"nature-is-gross",date:"2026-04-01T19:00:00-05:00",theme:"Nature Is Gross",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,winnerId:"queens-of-the-kingdom",isDemo:false,roundThemes:["Nature Is Gross"]},
  {id:"2026-04-08",slug:"when-nature-calls",date:"2026-04-08T19:00:00-05:00",theme:"When Nature Calls",venueId:"lecabaret",venue:"LeCabaret",address:"834 N. Rampart St., New Orleans, Louisiana",showType:"weekly",status:"completed",jackpot:0,winnerId:"the-splice-girls",isDemo:false,roundThemes:["Word Ladder","Creatures by Species","Biology 101","Clip Show"]},
];
export const quips=["Confidence is encouraged. Accuracy remains optional.","Stretch first. You’re about to reach.","The phones are smart enough. Put them away.","Panty Points: dignity’s final exchange rate.","We have questions. You have confidence.","Congratulations. You remembered something useless.","Bring your smartest friend. You’ll need someone to blame.","No Googling. We’re disappointable.","Come lose to strangers. It builds character.","The answers get funnier after a drink.","Cheating is frowned upon. Publicly.","Your group chat cannot save you now."];
const mk=(eventId:string,teamId:string,roundScores:number[],bonusCorrect:boolean[],place:number,extra:Partial<Result>={}):Result=>({eventId,teamId,roundScores,bonusCorrect,pantyPoints:0,bribePoints:0,adjustments:0,jackpotQualified:false,jackpotWon:false,place,published:true,...extra});
export const results:Result[]=[
  mk("2026-04-01","queens-of-the-kingdom",[],[],1,{recordedTotal:1385}),
  mk("2026-04-01","tim-ava",[],[],2,{recordedTotal:1130}),
  mk("2026-04-08","the-splice-girls",[],[],1,{recordedTotal:1840}),
  mk("2026-04-08","lump-space-pussies",[],[],2,{recordedTotal:1270}),
  mk("2026-04-08","tim-richard-company",[],[],3,{recordedTotal:645}),
];
export const awards:Award[]=[];
export const achievements:Achievement[]=[{id:"first",name:"First Win",description:"Won a first game.",icon:"★",criterion:"first_win"},{id:"five",name:"Five-Time Champion",description:"Five wins. Greedy, frankly.",icon:"♛",criterion:"five_wins"},{id:"perfect",name:"Perfect Bonus Round",description:"Nailed every bonus in a game.",icon:"✦",criterion:"jackpot_qualified"},{id:"qualified",name:"JackPot Qualified",description:"Reached sudden death.",icon:"⚡",criterion:"jackpot_qualified"},{id:"winner",name:"JackPot Winner",description:"Took the whole delicious pot.",icon:"$",criterion:"jackpot_winner"},{id:"panty",name:"Panty Point Professional",description:"Earned Panty Points twice.",icon:"♥",criterion:"panty_100"},{id:"comeback",name:"Biggest Comeback",description:"Clawed back from the brink.",icon:"↗",criterion:"manual"},{id:"average",name:"Perfectly Average",description:"Remarkably middle of the road.",icon:"≈",criterion:"average"},{id:"wrong",name:"Frequently Wrong, Never Uncertain",description:"Confidence is its own prize.",icon:"?",criterion:"manual"}];
