import { Injectable} from '@angular/core';
import { SitefinityService} from './sitefinity.service';
import { ReplaySubject} from 'rxjs';
import { NewsItem } from '../news/newsitems/newsitems.component';

export const usersDataOptions = {
  urlName: "users"
};

@Injectable({
  providedIn: "root"
})
export class UserService {

  constructor(private sitefinity: SitefinityService) {
  }

  getUserInfo() {
    const usersReplaySubject = new ReplaySubject<any>(1);
    this.sitefinity.instance.data(usersDataOptions).getSingle({
      key: "current",
      query: this.sitefinity
        .query
        .select("Username", "Avatar"),
      successCb: (data: NewsItem) => {usersReplaySubject.next(data); },
      failureCb: data => console.log(data)
    });
    return usersReplaySubject.asObservable();
  }
}
