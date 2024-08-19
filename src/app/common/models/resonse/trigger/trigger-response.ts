import {TriggerCostType} from "../../util/trigger-cost-type";
import {TriggerRewardType} from "../../util/trigger-reward-type";
import {CurrencyResponse} from "../currency/currency-response";

export interface TriggerResponse {
  id: string;
  name: string;
  key: string;
  costType: TriggerCostType;
  costAmount: number|null;
  costCurrency: CurrencyResponse|null;
  rewardType: TriggerRewardType;
  rewardAmount: number|null;
  rewardCurrency: CurrencyResponse|null;
}
