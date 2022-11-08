import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  isDarkBackground = true;
  loaderSubscription$: Subscription = new Subscription();

  constructor(
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loaderSubscription$ = this.loaderService
      .onLoaderStateChange()
      .subscribe((state: any) => {
        this.isLoading = state.loading ? true : false;
        this.isDarkBackground = state.isDarkBackground ? true : false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.loaderSubscription$) {
      this.loaderSubscription$.unsubscribe();
    }
  }
}
