import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Taxa, TaxaOptions} from '../taxa/taxa.component';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {categoriesOptions, categoryProperty, tagsOptions, tagsProperty, TaxaService} from '../services/taxa.service';
import {RxBaseComponent} from '../common/rx-base/rx-base.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent extends RxBaseComponent implements OnInit {
  categories: Observable<Taxa[]>;
  tags: Observable<Taxa[]>;
  tagsName: string = tagsProperty;
  categoryName: string = categoryProperty;
  contentItemsSubscription: Subscription;
  taxaServiceSubscription: Subscription;
  @Input() contentItems: Observable<any>;
  @Output() taxaClicked: EventEmitter<any> = new EventEmitter();

  constructor(private taxaService: TaxaService) {
    super();
  }

  ngOnInit() {
    this.tags = this.getTaxa(tagsOptions, tagsProperty);
    this.categories = this.getTaxa(categoriesOptions, categoryProperty);
  }

  onTaxaClicked(taxaName: string, taxa: string) {
    this.taxaClicked.emit({ taxaName: taxaName, taxa: taxa });
  }

  private getTaxa(taxaOptions: TaxaOptions, propertyName: string): Observable<Taxa[]> {
    const taxaReplaySubject = new ReplaySubject<Taxa[]>(1);
    this.contentItemsSubscription = this.contentItems.subscribe((data: any) => {

      const itemsTaxas: Array<string> = [];
      if (data) {
        data.forEach((item) => {
          if (item[propertyName]) {
            itemsTaxas.push(...item[propertyName]);
          }
        });
        this.taxaServiceSubscription = this.taxaService.getTaxaForIds(taxaOptions, itemsTaxas).subscribe(data => taxaReplaySubject.next(data));
        this.registerSubscription(this.taxaServiceSubscription);
      }
    });
    this.registerSubscription(this.contentItemsSubscription);
    return taxaReplaySubject.asObservable();
  }

}
