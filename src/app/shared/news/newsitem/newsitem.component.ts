import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NewsItem } from "../newsitems/newsitems.component";
import { NewsService } from "../../services/news.service";
import { RxBaseComponent } from "../../common/rx-base/rx-base.component";
import { Subscription } from "rxjs";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-newsitem",
  templateUrl: "./newsitem.component.html"
})
export class NewsItemComponent extends RxBaseComponent implements OnInit {
  newsItem: NewsItem;
  newsItemContent: SafeHtml;
  subscription: Subscription;

  constructor(private newsService: NewsService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.getNewsItem();
  }

  private getNewsItem() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.subscription = this.newsService.getNewsItem(id).subscribe((data) => {
        this.newsItem = data;
        if (data.Content) {
          this.newsItemContent = this.sanitizer.bypassSecurityTrustHtml(data.Content);
        }
      });

      this.registerSubscription(this.subscription);
    }
  }
}
