export const addUpdateAchievementValidationMessages: any = {
  name: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  description: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  type: {
    required: 'FORM.ERROR.required',
  },
  neededCount: {
    min: 'FORM.ERROR.min',
  },
}

export const addUpdateAchievementValidationMessageValues: any = {
  name: {
    maxlength: 255
  },
  description: {
    maxlength: 1000
  },
  neededCount: {
    min: 1
  },
};
