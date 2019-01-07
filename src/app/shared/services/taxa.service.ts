import { Injectable } from '@angular/core';
import { SitefinityService } from './sitefinity.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Taxa, TaxaOptions } from '../taxa/taxa.component';

export const tagsOptions: TaxaOptions = {
  taxonomyId: 'cb0f3a19-a211-48a7-88ec-77495c0f5374',
  taxonomyOptions: {
    urlName: 'flat-taxa'
  }
};

export const categoriesOptions: TaxaOptions = {
  taxonomyId: 'e5cd6d69-1543-427b-ad62-688a99f5e7d4',
  taxonomyOptions: {
    urlName: 'hierarchy-taxa'
  }
};

export const tagsProperty: string = 'Tags';
export const categoryProperty: string = 'Category';

@Injectable({
  providedIn: 'root'
})
export class TaxaService {

  constructor(private sitefinity: SitefinityService) { }

  getAllTaxa(taxonomyOptions: TaxaOptions ): Observable<Taxa[]>{
    const tagsReplaySubject = new ReplaySubject<Taxa[]>(1);
    this.sitefinity.instance.data(taxonomyOptions.taxonomyOptions).get({
      query: this.sitefinity
        .query
        .select('Title', 'Id')
        .order('Title desc')
        .where()
        .eq('TaxonomyId', taxonomyOptions.taxonomyId)
        .done(),
      successCb: data => tagsReplaySubject.next(data.value as Taxa[]),
      failureCb: data => console.log(data)
    });
    return tagsReplaySubject.asObservable();
  }

  getTaxaForIds(taxonomyOptions: TaxaOptions, ids: string[]): Observable<Taxa[]> {
    const tagsByIdReplaySubject = new ReplaySubject<Taxa[]>(1);
    this.getAllTaxa(taxonomyOptions).subscribe((data) => {
      let taxas: Taxa[] = [];
      if (data) {
        data.forEach((taxa) => {
          const occurencesInArray = this.getCountInArray(ids, taxa.Id);
          if (occurencesInArray > 0) {
            taxas.push({ Title: taxa.Title, Id: taxa.Id, Count: occurencesInArray });
          }
        });
        tagsByIdReplaySubject.next(taxas);
      }
    });
    return tagsByIdReplaySubject.asObservable();
  }

  private getCountInArray(arr: any, item: any): number {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        count++;
      }
    }
    return count;
  }
}
