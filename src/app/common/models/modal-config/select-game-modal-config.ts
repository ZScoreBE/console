import {GameResponse} from "../resonse/game/game-response";

export interface SelectGameModalConfig {
  games: GameResponse[];
  selectedGameId: string|null;
}
