export interface CurrencyOfferRequest {
  name: string
  key: string;
  amount:  number;
  priceEx: number;
  discountPriceEx: number|null;
}
