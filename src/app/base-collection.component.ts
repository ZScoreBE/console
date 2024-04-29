import {Directive, inject, OnInit} from "@angular/core";
import {BaseComponent} from "./base.component";
import {PaginatedCollection} from "./common/models/util/paginated-collection";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable, takeUntil} from "rxjs";

@Directive()
export abstract class BaseCollectionComponent<T> extends BaseComponent implements  OnInit {

  protected static readonly DEFAULT_PAGE: number = 1;
  protected static readonly DEFAULT_PAGE_SIZE: number = 25;

  collection: PaginatedCollection<T>;
  currentPage: number;
  pageSize: number;

  protected searchString: string;
  protected currentQueryParams: Params|null;


  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  protected constructor(
    protected updateQueryParams: boolean = true
  ) {
    super();

    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
  }

  ngOnInit(): void {
    this.handleQueryParams(this.route.snapshot.params);
  }

  search(searchString: string): void {
    if (this.searchString !== searchString) {
      this.searchString = searchString;
      this.setPage(1);
    }
  }

  searchReset(): void {
    this.searchString = null;
    this.setPage(1);
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.setPage(1);
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.fetch()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PaginatedCollection<T>) => this.handleSuccess(res),
        error: (error: string) => this.handleError(error)
      });
  }

  protected abstract fetch(): Observable<PaginatedCollection<T>>;

  protected handleQueryParams(params: Params): void {
    this.currentQueryParams = params;

    const page = params['page'] ? +params['page'] : BaseCollectionComponent.DEFAULT_PAGE;
    this.pageSize = params['size'] ? +params['size'] : BaseCollectionComponent.DEFAULT_PAGE_SIZE;
    this.searchString = params['s'] ? params['s'] : null;

    this.handleCustomParams(params);

    this.setPage(page);
  }

  protected handleCustomParams(params: Params): void {}

  protected deleteSuccess(id: string, msg: string): void {
    this.setSuccessMessage(msg);
    this.collection.items = this.collection.items.filter((item: any) => item.id !== id);
  }

  protected setQueryParamsInUrl(): void {
    if (!this.updateQueryParams) {
      return;
    }

    let queryParams: any = {};

    if (this.currentQueryParams['page'] || this.currentPage !== BaseCollectionComponent.DEFAULT_PAGE) {
      queryParams.page = this.currentPage;
    }

    if (this.currentQueryParams['size'] || this.pageSize !== BaseCollectionComponent.DEFAULT_PAGE_SIZE) {
      queryParams.size = this.pageSize;
    }

    if (this.currentQueryParams['s'] || (this.searchString && this.searchString !== '')) {
      queryParams.s = this.searchString;
    }

    queryParams = this.addExtraQueryParams(queryParams);

    this.currentQueryParams = queryParams;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  protected addExtraQueryParams(queryParams: any): any {
    return queryParams;
  }

  protected handleSuccess(collection: PaginatedCollection<T>): void {
    this.collection = collection;
    this.setQueryParamsInUrl();
  }

}
