export type EventStatus = "upcoming"|"active"|"completed"|"canceled"|"postponed";
export type ShowType = "weekly"|"private"|"corporate"|"fundraiser"|"special";
export interface Venue {id:string;slug:string;name:string;address:string;city:string;description?:string;bookingUrl?:string;isActive:boolean;isDemo:boolean}
export interface Event {id:string;slug:string;date:string;theme:string;venueId?:string;venue:string;address:string;showType?:ShowType;status:EventStatus;jackpot:number;announcement?:string;prizes?:string;attendance?:number;winnerId?:string;recap?:string;funniestAnswers?:string[];isDemo:boolean;roundThemes:string[]}
export interface Team {id:string;slug:string;name:string;players:string[];archived?:boolean;avatar?:string;isDemo:boolean}
export interface Result {eventId:string;teamId:string;roundScores:number[];bonusCorrect:boolean[];pantyPoints:number;bribePoints:number;doubleScoreRound?:number;adjustments:number;adjustmentReason?:string;recordedTotal?:number;jackpotQualified:boolean;jackpotWon:boolean;place:number;published:boolean}
export interface Award {id:string;eventId:string;teamId:string;name:string;description:string}
export interface Achievement {id:string;name:string;description:string;icon:string;criterion:string}
export interface TeamStats {teamId:string;name:string;totalPoints:number;averageScore:number;highestScore:number;wins:number;gamesAttended:number;bonusesCorrect:number;jackpotQualifications:number;jackpotWins:number;pantyPoints:number;bribePoints:number;doubleScoreUses:number;consecutiveWins:number}
export interface BookingInquiry {name:string;email:string;organization?:string;eventType:ShowType;eventDate?:string;guestCount?:number;venue?:string;message?:string}
