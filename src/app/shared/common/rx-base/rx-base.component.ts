import {OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

export class RxBaseComponent implements OnDestroy {
  private subscriptions: Array<Subscription> = [];

  protected registerSubscription(sub: Subscription): void {
    this.subscriptions.push((sub));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
