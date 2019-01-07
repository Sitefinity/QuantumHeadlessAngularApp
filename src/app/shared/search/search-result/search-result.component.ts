import { Component, OnInit } from '@angular/core';
import {SearchService} from '../../services/search.service';
import {RxBaseComponent} from '../../common/rx-base/rx-base.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html'
})
export class SearchResultComponent extends RxBaseComponent implements OnInit  {
  searchResults:Observable<any>;

  constructor(private searchService: SearchService) {
    super();
  }

  ngOnInit() {
    this.searchResults = this.searchService.searchResults;
  }
}
