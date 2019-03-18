import { Component, OnInit } from '@angular/core';
import {TestimonialsService} from '../services/testimonials.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {ROUTE_PATHS} from '../../app-routing/route-paths';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 8000, noPause: true, showIndicators: true } }
  ]
})
export class TestimonialsComponent implements OnInit {
  testimonials: Observable<Testimonial[]>;

  constructor(private testimonialsService: TestimonialsService, private router: Router) { }

  ngOnInit() {
    this.getTestimonials();
  }

  openTestimonialForm() {
    this.router.navigate([ROUTE_PATHS.SUBMIT_TESTIMONIAL]);
  }

  private getTestimonials(): void {
    this.testimonials = this.testimonialsService.getTestimonials();
  }
}

export class TestimonialImage {
  file: any;
  width: number;
  height: number;
}

export class Testimonial {
  TestimonialAuthor: string;
  Quote: string;
  JobTitle: String;
  Company: string;
  Photo?: TestimonialImage;
}
