export interface CurrencyOfferResponse {
  id: string;
  name: string;
  key: string;
  amount:  number;
  priceEx: number;
  discountPriceEx: number|null;
}
