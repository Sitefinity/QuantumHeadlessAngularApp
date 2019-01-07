import { Injectable } from '@angular/core';
import {SitefinityService} from './sitefinity.service';
import {Observable, ReplaySubject} from 'rxjs';
import {Image} from '../news/newsitems/newsitems.component';

export const imageDataOptions = {
  urlName: 'images',
};

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private sitefinity: SitefinityService) { }

  getImageByTitle(title: string): Observable<Image>{
    const replaySubjectImage = new ReplaySubject<Image>(1);
    this.sitefinity.instance.data(imageDataOptions).get({
      query: this.sitefinity
        .query
        .order('Title desc')
        .where()
        .eq('Title', title)
        .done(),
      successCb: data => replaySubjectImage.next(data.value[0]),
      failureCb: data => console.log(data)
    });
    return replaySubjectImage.asObservable();
  }
}
