import {PlayerResponse} from "../player/player-response";

export interface LeaderboardScoreResponse {
  id: string;
  score: number;
  player: PlayerResponse;
}
