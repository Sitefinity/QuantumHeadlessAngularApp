import { Component, OnInit } from '@angular/core';
import {NewsService} from '../../services/news.service';
import { RxBaseComponent} from '../../common/rx-base/rx-base.component';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {Taxa, TaxaOptions} from '../../taxa/taxa.component';
import {tagsOptions, categoriesOptions, TaxaService, tagsProperty, categoryProperty} from '../../services/taxa.service';

@Component({
  selector: 'app-newsitems',
  templateUrl: './newsitems.component.html'
})
export class NewsItemsComponent extends RxBaseComponent implements OnInit {
  newsItems: NewsItem[] = [];
  tags: Observable<Taxa[]>;
  categories: Observable<Taxa[]>;
  tagsName: string = tagsProperty;
  categoryName: string = categoryProperty;
  private allItemsCount: number;
  private showMoreItemsLink: boolean = true;
  private subscription: Subscription;
  private newsItemsCountSubscription: Subscription;
  private newsItemsForTagSubscription: Subscription;
  private allNewsItemsSubscription: Subscription;
  private taxaServiceSubscription: Subscription;

  get shouldShowLoadMore(): boolean {
    return (this.allItemsCount > this.newsItems.length) && this.showMoreItemsLink;
  }

  constructor(private newsService: NewsService, private taxaService: TaxaService) {
    super();
  }

  ngOnInit() {
    this.getNewsItems();
    this.getTagsAndCategories();
    this.getAllNewsItemsCount();
    this.registerSubscription(this.subscription);
    this.registerSubscription(this.newsItemsCountSubscription);
    this.registerSubscription(this.newsItemsForTagSubscription);
    this.registerSubscription(this.taxaServiceSubscription);
  }

  LoadMore() {
    this.getNewsItems();
  }

  getTagsAndCategories() {
    this.allNewsItemsSubscription = this.newsService.getNewsItems().subscribe((data: NewsItem[]) => {
      this.tags = this.getTaxa(tagsOptions, tagsProperty);
      this.categories = this.getTaxa(categoriesOptions, categoryProperty);
    });
  }

  getTaxa(taxaOptions: TaxaOptions, propertyName: string): Observable<Taxa[]> {
    let taxaReplaySubject = new ReplaySubject<Taxa[]>(1);
    this.allNewsItemsSubscription = this.newsService.getNewsItems().subscribe((data: NewsItem[]) => {
      let newsItemsTaxas: Array<string> = [];
      if (data) {
        data.forEach((newsItem) => {
          if(newsItem[propertyName]) {
            newsItemsTaxas.push(...newsItem[propertyName]);
          }
        });
        this.taxaServiceSubscription = this.taxaService.getTaxaForIds(taxaOptions, newsItemsTaxas).subscribe(data =>taxaReplaySubject.next(data));
      }
    });
    return taxaReplaySubject.asObservable();
  }


  getNewsItems(): void {
    this.subscription = this.newsService.getNewsItems(6, this.newsItems.length).subscribe((data: NewsItem[]) => {
      if (data) {
        this.newsItems.push(...data);
      }
    });
  }

  getNewsItemsByTaxa(taxaName: string, taxaId: string) {
    this.newsItemsForTagSubscription = this.newsService.getNewsByTaxa(taxaName, taxaId).subscribe((newsItems) => {
      if (newsItems) {
        this.newsItems = newsItems;
      }
    });
    this.showMoreItemsLink = false;
  }

  getAllNewsItemsCount() {
    this.newsItemsCountSubscription = this.newsService.getAllNewsCount().subscribe((data) => {
      this.allItemsCount = data;
    });
  }
}

export class NewsItem {
  Id: string;
  Content: string;
  DateCreated: string;
  Summary: string;
  Title: string;
  UrlName: string;
  Featured: boolean;
  Author?: string;
  Thumbnail?: Image;
  Tags?: Array<string>;
  Category?: Array<string>;
}

export class Image {
  AlternativeText: string;
  ThumbnailUrl: string;
  Url?: string;
}

export class Album {
  Title: string;
  Id: string;
}
