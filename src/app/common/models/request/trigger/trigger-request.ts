import {TriggerCostType} from "../../util/trigger-cost-type";
import {TriggerRewardType} from "../../util/trigger-reward-type";

export interface TriggerRequest {
  name: string;
  key: string;
  costType: TriggerCostType;
  costAmount: number|null;
  costCurrencyId: string|null;
  rewardType: TriggerRewardType;
  rewardAmount: number|null;
  rewardCurrencyId: string|null;
}
