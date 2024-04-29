import {GameEngine} from "../../util/game-engine";

export interface GameResponse {
  id: string;
  generationId: string;
  name: string;
  engine: GameEngine;
  active: boolean;
  sandboxMode: boolean;
  apiKey: string;
}
