import { EventEmitter, Injectable, Output } from "@angular/core";
import { SitefinityService } from "./sitefinity.service";
import { Observable, ReplaySubject } from "rxjs";
import { Router } from "@angular/router";
import { SearchResultItem} from "../search/search.component";

@Injectable({
  providedIn: "root"
})
export class SearchService {
  @Output() searchTriggered = new EventEmitter<any>();
  private _searchResults: ReplaySubject<SearchResultItem[]> = new ReplaySubject<SearchResultItem[]>(1);
  get searchResults(): Observable<SearchResultItem[]> {
      return this._searchResults.asObservable();
  }

  constructor(private router: Router, private sitefinity: SitefinityService) { }

  search(searchWord: string) {
    this.router.navigate(["/search-results", searchWord]);
  }

   getItemsBySearchWord(searchWord: string): void {
    const batch = this.sitefinity.instance.batch(data => this._searchResults.next(this.mapSearchResults(data)));
    batch.get({ entitySet: "showcases", query: this.sitefinity
        .query
        .select("Title", "Client", "Challenge", "Solution", "Results", "Id")
        .order("Title asc")
        .where()
        .or()
        .contains("Title", searchWord)
        .or()
        .contains("Client", searchWord)
        .or()
        .contains("Challenge", searchWord)
        .or()
        .contains("Solution", searchWord)
        .or()
        .contains("Results", searchWord)
        .done().done().done().done().done().done()});
    batch.get({ entitySet: "images", query: this.sitefinity
        .query
        .where()
        .contains("Title", searchWord)
        .done()});
    batch.get({ entitySet: "newsitems", query: this.sitefinity
        .query
        .select("Title", "Content", "Summary", "Id")
        .order("Title asc")
        .where()
        .or()
        .contains("Title", searchWord)
        .or()
        .contains("Content", searchWord)
        .or()
        .contains("Summary", searchWord)
        .done().done().done().done()});
    batch.execute();
  }

  mapSearchResults(result: any): SearchResultItem[] {
    const searchResults = [];
    const data = result.data;
    if (data.length > 0) {
      data.forEach((item) => {
        const context = item.response.data["@odata.context"];
        let contentType;
        const valuesArray = item.response.data.value;
        if (context) {
          contentType = context.substring(context.indexOf("#") + 1, context.indexOf("("));
        }

        if (valuesArray && valuesArray.length > 0) {
          switch (contentType) {
            case "newsitems":
              valuesArray.forEach(contentItm => {
                searchResults.push({ Title: contentItm.Title, DetailLink: "/news/" + contentItm.Id, Content: contentItm.Summary });
              });
              break;
            case "showcases":
              valuesArray.forEach(contentItm => {
                searchResults.push({ Title: contentItm.Title, DetailLink: "/showcases/" + contentItm.Id, Content: contentItm.Challenge });
              });
              break;
            case "images":
              valuesArray.forEach(contentItm => {
                searchResults.push({ Title: contentItm.Title, ImageUrl: contentItm.Url });
              });
              break;
            default:
              break;
          }
        }
      });
    }

    return searchResults;
  }
}
