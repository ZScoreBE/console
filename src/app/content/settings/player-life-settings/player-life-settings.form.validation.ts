export const playerLifeSettingsValidationMessages: any = {
  maxLives: {
    required: 'FORM.ERROR.required',
    min: 'FORM.ERROR.min',
  },
  giveLifeAfterSeconds: {
    min: 'FORM.ERROR.min',
  },
}

export const playerLifeSettingsValidationMessagesValues: any = {
  maxLives: {
    required: 'FORM.ERROR.required',
    min: 1,
  },
  giveLifeAfterSeconds: {
    min: 1
  }
}
