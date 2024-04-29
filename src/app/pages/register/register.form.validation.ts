export const registerValidationMessages: any = {
  name: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  email: {
    required: 'FORM.ERROR.required',
    email: 'FORM.ERROR.email',
    maxlength: 'FORM.ERROR.maxlength',
  },
  organizationName: {
    required: 'FORM.ERROR.required',
    maxlength: 'FORM.ERROR.maxlength',
  },
  password: {
    required: 'FORM.ERROR.required',
    notStrongEnough: 'FORM.ERROR.passwordNotStrong'
  },
  repeatPassword: {
    required: 'FORM.ERROR.required',
    notMatching: 'FORM.ERROR.passwordsDoNotMatch'
  },
}

export const registerValidationMessageValues: any = {
  name: {
    maxlength: 255
  },
  email: {
    maxlength: 255
  },
  organizationName: {
    maxlength: 255
  },
};
