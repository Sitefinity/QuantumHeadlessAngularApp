import { Component } from "@angular/core";
import { SearchService} from "../services/search.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html"
})
export class SearchComponent {
  open: boolean;

  constructor(private searchService: SearchService) {}

  onEnter(event: any) {
      this.searchService.search(event.target.value);
  }
}

export class SearchResultItem {
  Title: string;
  DetailLink: string;
  Content?: string;
  ImageUrl?: string;
}
