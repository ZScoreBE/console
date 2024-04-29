export const addInviteValidationMessages: any = {
  name: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  email: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
    email: 'FORM.ERROR.email',
  }
}

export const addInviteValidationMessageValues: any = {
  name: {
    maxlength: 255
  },
  email: {
    maxlength: 255
  },
};
