import { Component, OnInit } from "@angular/core";
import { SearchService } from "../../services/search.service";
import { RxBaseComponent } from "../../common/rx-base/rx-base.component";
import { Observable } from "rxjs";
import { SettingsService } from "../../services/settings.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.component.html"
})
export class SearchResultComponent extends RxBaseComponent implements OnInit  {
  searchResults: Observable<any>;
  searchTerm: string;

  constructor(private searchService: SearchService, public settings: SettingsService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.searchResults = this.searchService.searchResults;
    this.route.params.subscribe(data => {
      if (data["searchTerm"]) {
        this.searchTerm = data["searchTerm"];
        this.searchService.getItemsBySearchWord(this.searchTerm);
      }
    });
  }
}
