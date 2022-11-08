import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loaderState = new Subject<any>();

  constructor() {}

  /**
   * Shows loader
   */
  showLoader(isDarkBackground = true) {
    this.loaderState.next({ loading: true, isDarkBackground });
  }

  /**
   * Hides loader
   */
  hideLoader() {
    this.loaderState.next({ loading: false });
  }

  /**
   * Fires on loader state changed.
   * @returns {Observable<any>}
   */
  onLoaderStateChange(): Observable<any> {
    return this.loaderState.asObservable();
  }
}
