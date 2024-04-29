import { Component } from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {Subject} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  isLoading: Subject<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading = loaderService.isLoading;
  }
}
