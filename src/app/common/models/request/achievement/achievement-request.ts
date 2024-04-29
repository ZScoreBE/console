import {AchievementType} from "../../util/achievement-type";

export interface AchievementRequest {
  name: string;
  description: string;
  type: AchievementType;
  neededCount: number|null
}
