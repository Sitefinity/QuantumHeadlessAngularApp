import { Component, OnInit } from "@angular/core";
import { PageContentService } from "../services/page-content.service";
import { ActivatedRoute } from "@angular/router";
import { ModelBase } from "../models/model-base";
import { ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./root.component.html",
  styleUrls: ["./landing-page-styles/quantum-landing-page.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit {
  public content: ModelBase<any>[];
  public culture: string;
  public siteId: string;

  constructor(private route: ActivatedRoute,
    private pageContentService: PageContentService) {
  }

  ngOnInit(): void {
    let query = "?";

    const queryParams = this.route.snapshot.queryParams;
    Object.keys(queryParams).forEach(key => {
      query += `${key}=${queryParams[key]}`;
    });

    this.route.url.subscribe(r => {
      const pageUrl = `${r.map(u => u.path).join("/")}${query}`;
      this.pageContentService.get(pageUrl).subscribe(s => {
        this.content = s.ComponentContext.Components;
        this.culture = s.Culture;
        this.siteId = s.SiteId;
      });
    });
  }
}
