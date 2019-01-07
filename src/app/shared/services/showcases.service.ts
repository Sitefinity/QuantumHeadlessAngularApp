import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {SitefinityService} from './sitefinity.service';
import {Showcase} from '../showcases/showcases.component';
export const showcasesDataOptions = {
  urlName: 'showcases'
};

@Injectable({
  providedIn: 'root'
})
export class ShowcasesService {

  constructor(private sitefinity: SitefinityService) { }

  getShowcases(): ReplaySubject<Showcase[]> {
    const showcasesReplaySubject = new ReplaySubject<Showcase[]>(1);
    this.sitefinity.instance.data(showcasesDataOptions).get({
      query: this.sitefinity
        .query
        .select('Title', 'Client', 'Website', 'Challenge', 'Solution', 'Results', 'PublicationDate')
        .expand('Thumbnail', 'Download')
        .order('PublicationDate desc'),
      successCb: data => showcasesReplaySubject.next(data.value as Showcase[]),
      failureCb: data => console.log(data)
    });

    return showcasesReplaySubject;
  }

  getShowcaseById(id: string): ReplaySubject<Showcase> {
    const showcaseReplaySubject = new ReplaySubject<Showcase>(1);
    this.sitefinity.instance.data(showcasesDataOptions).getSingle({
      key: id,
      query: this.sitefinity
        .query
        .select('Title', 'Client', 'Website', 'Challenge', 'Solution', 'Results', 'PublicationDate')
        .expand('Thumbnail', 'Download')
        .order('PublicationDate desc'),
      successCb: data => showcaseReplaySubject.next(data),
      failureCb: data => console.log(data)
    });

    return showcaseReplaySubject;
  }
}
