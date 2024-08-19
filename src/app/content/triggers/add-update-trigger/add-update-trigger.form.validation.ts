export const addUpdateTriggerValidationMessages: any = {
  name: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  key: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  costType: {
    required: 'FORM.ERROR.required',
  },
  rewardType: {
    required: 'FORM.ERROR.required',
  },
  costAmount: {
    required: 'FORM.ERROR.required',
    min: 'FORM.ERROR.min',
  },
  costCurrencyId: {
    required: 'FORM.ERROR.required',
  },
  rewardAmount: {
    required: 'FORM.ERROR.required',
    min: 'FORM.ERROR.min',
  },
  rewardCurrencyId: {
    required: 'FORM.ERROR.required',
  },
}

export const addUpdateTriggerValidationMessageValues: any = {
  name: {
    maxlength: 255
  },
  key: {
    maxlength: 5
  },
  costAmount: {
    min: 1
  },
  rewardAmount: {
    min: 1
  }
};
