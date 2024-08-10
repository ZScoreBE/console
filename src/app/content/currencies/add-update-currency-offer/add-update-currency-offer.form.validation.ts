export const addUpdateCurrencyOfferValidationMessages: any = {
  name: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  key: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  amount: {
    required: 'FORM.ERROR.required',
    min: 'FORM.ERROR.min',
  },
  priceEx: {
    required: 'FORM.ERROR.required',
    min: 'FORM.ERROR.min',
  },
  discountPriceEx: {
    min: 'FORM.ERROR.min',
  }
}

export const addUpdateCurrencyOfferValidationMessageValues: any = {
  name: {
    maxlength: 255
  },
  key: {
    maxlength: 5
  },
  amount: {
    min: 1
  },
  priceEx: {
    min: 0.01
  },
  discountPriceEx: {
    min: 0.01
  },
};
