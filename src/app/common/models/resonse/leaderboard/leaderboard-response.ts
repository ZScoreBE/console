import {SortDirection} from "../../util/sort-direction";
import {LeaderboardScoreType} from "../../util/leaderboard-score-type";

export interface LeaderboardResponse {
  id: string;
  name: string;
  direction: SortDirection;
  scoreType: LeaderboardScoreType;
}
