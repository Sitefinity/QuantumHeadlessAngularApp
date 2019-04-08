import { Component, OnInit } from "@angular/core";
import {NewsService } from "../../services/news.service";
import { RxBaseComponent } from "../../common/rx-base/rx-base.component";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "app-newsitems",
  templateUrl: "./newsitems.component.html"
})
export class NewsItemsComponent extends RxBaseComponent implements OnInit {
  newsItems: NewsItem[] = [];
  allNewsItems: Observable<NewsItem[]> = new Observable();
  private allItemsCount: number;
  private showMoreItemsLink = true;
  private newsSubscription: Subscription;
  private newsItemsCountSubscription: Subscription;
  private newsItemsForTagSubscription: Subscription;

  get shouldShowLoadMore(): boolean {
    return (this.allItemsCount > this.newsItems.length) && this.showMoreItemsLink;
  }

  constructor(private newsService: NewsService) {
    super();
  }

  ngOnInit() {
    this.getNewsItems();
    this.getAllNewsItemsCount();
  }

  getNewsItemsByTaxa(event: any) {
    const taxaName = event.taxaName;
    const taxaId = event.taxa;
    this.newsItemsForTagSubscription = this.newsService.getNewsByTaxa(taxaName, taxaId).subscribe((newsItems) => {
      if (newsItems) {
        this.newsItems = newsItems;
      }
    });
    this.registerSubscription(this.newsItemsForTagSubscription);
    this.showMoreItemsLink = false;
  }

  LoadMore() {
    this.getNewsItems();
  }

  private getNewsItems(): void {
    this.allNewsItems = this.newsService.getNewsItems();
    this.newsSubscription = this.newsService.getNewsItems(6, this.newsItems.length).subscribe((data: NewsItem[]) => {
      if (data) {
        this.newsItems.push(...data);
      }
    });

    this.registerSubscription(this.newsSubscription);
  }

  private getAllNewsItemsCount() {
    this.newsItemsCountSubscription = this.newsService.getAllNewsCount().subscribe((data) => {
      this.allItemsCount = data;
    });

    this.registerSubscription(this.newsItemsCountSubscription);
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
