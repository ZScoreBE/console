import {AfterViewInit, Component, ElementRef, HostListener, Inject, Renderer2} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DOCUMENT, NgOptimizedImage} from "@angular/common";
import {GlobalEmitter} from "../../common/utils/global-emitter";
import {MOBILE_NAV_FROM_WIDTH, WINDOW_SIZE_CHANGED} from "../../common/utils/defenitions";
import {BaseComponent} from "../../base.component";
import {takeUntil} from "rxjs";
import {document} from "ngx-bootstrap/utils";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    TranslateModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent  extends BaseComponent implements AfterViewInit{

  inSmallView: boolean = false;

  constructor(
    private elem: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    super();

    this.inSmallView = window.innerWidth < MOBILE_NAV_FROM_WIDTH;
  }



  @HostListener('document:click', ['$event'])
  onClick(event: any): void {
    const id = event.target.id;
    const parentId = event.target.parentElement.id;
    if (!this.inSmallView ||
      this.elem.nativeElement.contains(event.target) ||
      document.body.classList.contains("sidebar-closed") ||
      id === 'sidebar-toggle' || parentId === 'sidebar-toggle'
    ) {
      return;
    }

    this.renderer.addClass(this.document.body, 'sidebar-closed');
    this.renderer.addClass(this.document.body, 'sidebar-collapse');
    this.renderer.removeClass(this.document.body, 'sidebar-open');
  }

  ngAfterViewInit(): void {
    GlobalEmitter.of<boolean>(WINDOW_SIZE_CHANGED)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.inSmallView = result
      });
  }


}
