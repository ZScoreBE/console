import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {debounceTime, delay, distinctUntilChanged, filter, fromEvent, take} from "rxjs";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements AfterViewInit {

  @ViewChild('searchField', {static: false}) searchField: ElementRef;

  @Input() shouldUpdateQueryParams: boolean = true;

  @Output() searchValueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() resetHappened: EventEmitter<boolean> = new EventEmitter<boolean>();

  public searched = false;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngAfterViewInit() {
    this.route.queryParams
      .pipe(take(1), delay(0))
      .subscribe((params: Params) => {
        if (params['s']) {
          this.searchField.nativeElement.value = params['s'];
          this.search(params['s']);
        }
      });

    fromEvent(this.searchField.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe(() => this.search(this.searchField.nativeElement.value));
  }

  search(value: string): void {
    if (value && value !== '' && value.trim() !== '') {
      this.updateQueryParams(value);
      this.searched = true;
      this.searchValueChanged.emit(value.trim());
    } else {
      this.searched = false;
    }
  }

  resetSearch() {
    this.updateQueryParams(undefined);
    this.searchField.nativeElement.value = '';
    this.searched = false;
    this.resetHappened.emit(true);
  }

  private updateQueryParams(value: string): void {
    if (this.shouldUpdateQueryParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {s: value},
        queryParamsHandling: 'merge'
      }).then();
    }
  }
}
