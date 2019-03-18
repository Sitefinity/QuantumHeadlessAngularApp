import { Injectable } from '@angular/core';
import {SitefinityService} from './sitefinity.service';
import {Observable, ReplaySubject} from 'rxjs';
import {Testimonial} from '../testimonials/testimonials.component';
import {ImagesService} from './images.service';

export const testimonialDataOptions = {
  urlName: 'testimonials',
  providerName: "dynamicProvider5",
  cultureName: "en"
};

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {

  constructor(
    private sitefinity: SitefinityService,
    private imageService: ImagesService) { }

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

  createTestimonial(testimonial: Testimonial):Observable<boolean> {
    const isTestimonialCreated = new ReplaySubject<boolean>(1);
    const sortedFields = this.imageService.sortFieldValues(testimonial);
    const primitiveFields = sortedFields.primitives;
    const relationalFields = sortedFields.relational;

    this.imageService.getLibraryByTitle('Default library').subscribe((library: any) => {
      let parentId = library.RootId ? library.RootId : library.Id;
      this.imageService.uploadImage(parentId, relationalFields['Photo']).subscribe((upload => {
        if (upload.success) {
          const success = (result) => {
            if(result.isSuccessful) {
              isTestimonialCreated.next(true);
            } else {
              isTestimonialCreated.next(false);
            }
          };
          const failure = () => {
            isTestimonialCreated.next(false);
          };
          const batch = this.sitefinity.instance.batch(success, failure, { providerName: testimonialDataOptions.providerName, cultureName: testimonialDataOptions.cultureName });
          const transaction = batch.beginTransaction();
          const entitySet = 'testimonials';
          const operation = { action: 'Publish' };
          const testimonialItemId = transaction.create({
            entitySet,
            data: primitiveFields
          });

          this.imageService.associateRelatedImage(relationalFields['Photo'], entitySet, upload.result.Id, testimonialItemId, transaction);

          transaction.operation({
            entitySet: entitySet,
            key: testimonialItemId,
            data: operation
          });

          batch.endTransaction(transaction);
          batch.execute();
        } else {
          isTestimonialCreated.next(false);
        }
      }));
    });
    return isTestimonialCreated.asObservable();
  }
}


