import {Directive, ElementRef} from '@angular/core';
import {FlashMessageService} from "../services/flash-message.service";

@Directive({
  selector: '[hasFlashMessage]',
  standalone: true
})
export class HasFlashMessageDirective {

  constructor(private el: ElementRef,
              private flashMessageService: FlashMessageService) {
    this.el.nativeElement.style.visibility = this.flashMessageService.hasMessage() ? 'visible' : 'hidden';
  }

}
