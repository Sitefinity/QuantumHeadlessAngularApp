import { Injectable } from '@angular/core';
import {SitefinityService} from './sitefinity.service';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Testimonial} from '../testimonials/testimonials.component';
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from './settings.service';
import {ImagesService} from './images.service';
import {Album} from '../news/newsitems/newsitems.component';

export const testimonialDataOptions = {
  urlName: 'testimonials'
};

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private primitiveFields: {} = {};
  private relationalFields: {} = {};

  constructor(private sitefinity: SitefinityService, private sanitizer: DomSanitizer, private settingsService: SettingsService, private imageService: ImagesService) { }

  getTestimonials(): Observable<Testimonial[]> {
    const testimonialReplaySubject = new ReplaySubject<Testimonial[]>(1);
    this.sitefinity.instance.data(testimonialDataOptions).get({
      query: this.sitefinity
        .query
        .select('JobTitle', 'TestimonialAuthor', 'Quote', 'Company', 'PublicationDate')
        .expand('Photo')
        .order('PublicationDate desc'),
      successCb: data => testimonialReplaySubject.next(data.value as Testimonial[]),
      failureCb: data => console.log(data)
    });
    return testimonialReplaySubject.asObservable();
  }

  createTestimonial(testimonial: Testimonial):void {
    const sortedFields = this.sortFieldValues(testimonial);
    this.primitiveFields = sortedFields.primitives;
    this.relationalFields = sortedFields.relational;
    this.imageService.getLibraryByTitle("Default library").subscribe((library: Album) => {
      this.uploadImage(library.Id).subscribe((imageId => {
        const batch = this.sitefinity.instance.batch();
        const transaction = batch.beginTransaction();
        const entitySet = 'testimonials';
        const operation = { action: "Publish" };
        const itemId = transaction.create({
          entitySet,
          data: this.primitiveFields
        });

        this.associateRelatedImage('Photo', entitySet, imageId, itemId, transaction);

        transaction.operation({
          entitySet: entitySet,
          key: itemId,
          data: operation
        });

        batch.endTransaction(transaction);
      }));
    });
  }

  private uploadImage(libraryId: string): Observable<string> {
    const imageIdSubject = new BehaviorSubject<string>("");

    const success = (result) => {
      const { data } = result.data[0].response[0];

      if (result.isSuccessful) {
        imageIdSubject.next(data.id);
      }
    };
    const reject = (result) => {
debugger;
    };

    const batch = this.sitefinity.instance.batch(success, reject);
    const transaction = batch.beginTransaction();
    const file = this.relationalFields['Photo'].file;
    const url = window.URL.createObjectURL(file);
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    const imagePrimitives: ImagePrimitives = {
      DirectUpload: true,
      Height: this.relationalFields['Photo'].height,
      Width: this.relationalFields['Photo'].width,
      ParentId: libraryId,
      Title: this.relationalFields['Photo'].file.name
    };

    const uploadedFile = transaction.upload({
      entitySet: "images",
      data: file,
      dataUrl: safeUrl,
      contentType: file.type,
      filename: file.name,
      uploadProperties: imagePrimitives
    });
    transaction.operation({
      entitySet: "images",
      key: uploadedFile,
      data: {
        action: "Publish"
      }
    });
    batch.endTransaction(transaction);
    batch.execute();

    return imageIdSubject.asObservable();
  }

  private associateRelatedImage(relationalField: string, entitySet: string, itemId: any, relationId: string, transaction: any) {
      transaction.destroyRelated({
        entitySet: entitySet,
        key: relationId,
        navigationProperty: relationalField
      });

      const relatedImageField = this.relationalFields[relationalField];
      const relationLink = this.settingsService.url + 'sf/system/images(' + itemId + ')';

      if (relatedImageField) {
        transaction.createRelated({
          entitySet: entitySet,
          key: relationId,
          navigationProperty: relationalField,
          link: relationLink
        });
      }
  }

  private sortFieldValues(obj: any): SortedProperties {
    const sortedFieldValues:SortedProperties = { primitives: {}, relational: {} };
    for(let key in obj){
      if(this.isPrimitiveProperty(obj[key])) {
        sortedFieldValues.primitives[key] = obj[key];
      } else {
        sortedFieldValues.relational[key] = obj[key];
      }
    }
    return sortedFieldValues;
  }

  private isPrimitiveProperty(property: any) {
    return !this.isObject(property);
  }


  private isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
  }

}

class SortedProperties {
  primitives: {};
  relational: {};
}

class ImagePrimitives{
  DirectUpload: boolean;
  Height: number;
  Width: number;
  ParentId: string;
  Title: string;
}
