import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PaginatedCollection} from "../../models/util/paginated-collection";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges {

  @Input() collection: PaginatedCollection<any>;
  @Input() class: string = '';

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collection'] && changes['collection'].currentValue) {
      this.calculatePages();
    }
  }

  changePage(page: number): boolean {
    if (page !== this.collection.currentPage) {
      this.pageChange.emit(page);
    }
    return false;
  }

  private calculatePages(): void {
    this.pages = [];

    if (this.collection.lastPage > 5) {
      if (this.collection.currentPage - 2 < 1) {
        this.pages.push(1, 2, 3, 4, 5);
      } else if (this.collection.currentPage + 2 > this.collection.lastPage) {
        for (let i = this.collection.lastPage - 4; i <= this.collection.lastPage; i++) {
          this.pages.push(i);
        }
      } else {
        for (let i = this.collection.currentPage - 2; i <= this.collection.currentPage + 2; i++) {
          this.pages.push(i);
        }
      }
    } else {
      for (let i = 1; i <= this.collection.lastPage; i++) {
        this.pages.push(i);
      }
    }
  }

}
