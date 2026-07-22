import { GAME_RULES } from "@/config/game";
import type { Result } from "@/types";
export function bonusPoints(correct:boolean[]){return correct.reduce((sum,v,i)=>sum+(v?(GAME_RULES.bonusValues[i]??0):0),0);}
export function cappedBribePoints(requested:number){return Math.max(0,Math.min(requested,GAME_RULES.bribePointsPerQualifyingSpend*GAME_RULES.rounds));}
export function scoreTotal(r:Pick<Result,"roundScores"|"bonusCorrect"|"pantyPoints"|"bribePoints"|"doubleScoreRound"|"adjustments">){const base=r.roundScores.reduce((a,b)=>a+b,0);const doubled=r.doubleScoreRound===undefined?0:(r.roundScores[r.doubleScoreRound]??0);return base+doubled+bonusPoints(r.bonusCorrect)+(r.pantyPoints?GAME_RULES.pantyPoints:0)+cappedBribePoints(r.bribePoints)+r.adjustments;}
export function qualifiesForJackpot(correct:boolean[]){return correct.length===GAME_RULES.rounds&&correct.every(Boolean);}
