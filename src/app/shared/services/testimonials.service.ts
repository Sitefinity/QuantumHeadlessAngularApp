import { Injectable } from '@angular/core';
import {SitefinityService} from './sitefinity.service';
import {Observable, ReplaySubject} from 'rxjs';
import {Testimonial} from '../testimonials/testimonials.component';

export const testimonialDataOptions = {
  urlName: 'testimonials'
};

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {

  constructor(private sitefinity: SitefinityService) { }

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
    this.sitefinity.instance.create({
      data: testimonial,
      successCb: data => console.log(data),
      failureCb: data => console.log(data)
    });
  }

}
