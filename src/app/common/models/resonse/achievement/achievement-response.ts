import {AchievementType} from "../../util/achievement-type";

export interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  neededCount: number|null;
}
