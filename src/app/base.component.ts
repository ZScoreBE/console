import {Directive, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";
import {AbstractControl} from "@angular/forms";

@Directive()
export abstract class BaseComponent implements OnDestroy {

  error: string = null;
  success: string = null;

  protected ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  protected onFormValueChanged(form: AbstractControl, formErrors: any, validationMessages: any): any {
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        formErrors[field] = ''; // clear the errors
        const control: AbstractControl = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (messages[key]) {
              formErrors[field] = messages[key];
              break;
            }
          }
        }
      }
    }

    return formErrors;
  }

  protected handleError(error: string): void {
    this.resetMessages();
    this.error = error;
    this.scrollTo();
  }

  protected setSuccessMessage(success: string): void {
    this.resetMessages();
    this.success = success;
    this.scrollTo();
  }

  protected resetMessages(): void {
    this.error = null;
    this.success = null;
  }

  protected scrollTo(scrollToId: string = null) {
    if (scrollToId) {
      const elem = document.getElementById(scrollToId);
      elem.scrollIntoView();
    } else {
      window.scroll(0, 0);
    }
  }
}
