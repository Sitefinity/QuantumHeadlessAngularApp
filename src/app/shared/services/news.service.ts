import {Injectable} from '@angular/core';
import {SitefinityService} from './sitefinity.service';
import {ReplaySubject, Observable} from 'rxjs';
import {NewsItem} from '../news/newsitems/newsitems.component';
export const newsItemsDataOptions = {
  urlName: 'newsitems',
  providerName: 'OpenAccessDataProvider',
  cultureName: 'en'
};

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private sitefinity: SitefinityService) { }

  getNewsItems(take?: number, skip?: number): Observable<NewsItem[]> {
    let query;
    const newsReplaySubject = new ReplaySubject<NewsItem[]>(1);
    if ((take !== null && take !== undefined) && (skip !== null && skip !== undefined)) {
      query = this.sitefinity
        .query
        .select('Title', 'Id', 'Content', 'DateCreated', 'PublicationDate', 'Summary', 'UrlName', 'Author', 'Tags', 'Category', 'Featured')
        .expand('Thumbnail')
        .order('PublicationDate desc')
        .skip(skip).take(take);
    } else {
      query = this.sitefinity
        .query
        .select('Title', 'Id', 'Content', 'DateCreated', 'PublicationDate', 'Summary', 'UrlName', 'Author', 'Tags', 'Category', 'Featured')
        .expand('Thumbnail')
        .order('PublicationDate desc');
    }
      this.sitefinity.instance.data(newsItemsDataOptions).get({
      query: query,
      successCb: data => newsReplaySubject.next(data.value as NewsItem[]),
      failureCb: data => console.log(data)
    });
    return newsReplaySubject.asObservable();
  }

  getNewsByTaxa(propertyName: string, taxaId: string): Observable<NewsItem[]> {
    const newsSubject = new ReplaySubject<any>(1);
    this.sitefinity.instance.data(newsItemsDataOptions).get({
      query: this.sitefinity
        .query
        .select('Title', 'Id', 'Content', 'DateCreated', 'Summary', 'UrlName', 'Author')
        .expand('Thumbnail')
        .order('Title desc')
        .where()
        .any()
        .eq(propertyName, taxaId)
        .done().done(),
      successCb: data => newsSubject.next(data.value as NewsItem[]),
      failureCb: data => console.log(data)
    });
    return newsSubject.asObservable();
  }

  getNewsItem(id: string): Observable<NewsItem> {
    const newsReplaySubject = new ReplaySubject<any>(1);
      this.sitefinity.instance.data(newsItemsDataOptions).getSingle({
          key: id,
          query: this.sitefinity
            .query
            .select('Title', 'Id', 'Content', 'DateCreated', 'Summary', 'UrlName', 'Author', 'Tags')
            .expand('Thumbnail')
            .order('Title desc'),
          successCb: (data: NewsItem) => {newsReplaySubject.next(data); },
          failureCb: data => console.log(data)
        });
    return newsReplaySubject.asObservable();
  }

  getAllNewsCount(): Observable<number> {
    const newsReplaySubject = new ReplaySubject<any>(1);
      this.sitefinity.instance.data(newsItemsDataOptions).get({
        query: this.sitefinity
          .query
          .count(false),
        successCb: (data: number) => newsReplaySubject.next(data),
        failureCb: data => console.log(data)
      });
    return newsReplaySubject.asObservable();
  }
}
