import { Component, OnInit } from '@angular/core';
import {Image} from '../news/newsitems/newsitems.component';
import {TestimonialsService} from '../services/testimonials.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 8000, noPause: true, showIndicators: true } }
  ]
})
export class TestimonialsComponent implements OnInit {
  testimonials: Observable<Testimonial[]>;
  model: Testimonial = new Testimonial();

  constructor(private testimonialsService: TestimonialsService) { }

  ngOnInit() {
    this.testimonials = this.testimonialsService.getTestimonials();
  }

  submitTestimonial(testimonialForm: any) {
    if (testimonialForm.valid) {
      this.testimonialsService.createTestimonial(this.model);
    }
  }
}

export class Testimonial {
  TestimonialAuthor: string;
  Quote: string;
  JobTitle: String;
  Company: string;
  Photo?: Image;
}
