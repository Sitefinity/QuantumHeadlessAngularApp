import { Component } from "@angular/core";
import { Testimonial } from "../testimonials.component";
import { TestimonialsService } from "../../services/testimonials.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-testimonial-form",
  templateUrl: "./testimonial-form.component.html"
})
export class TestimonialFormComponent {
  model: Testimonial = new Testimonial();
  createdTestimonialMessage: string = null;
  creatingTestimonial: boolean;

  constructor(private testimonialsService: TestimonialsService, private router: Router) { }

  submitTestimonial(testimonialForm: any) {
    if (testimonialForm.valid) {
      this.creatingTestimonial = true;
      this.testimonialsService.createTestimonial(this.model).subscribe(isCreated => {
        this.creatingTestimonial = false;
        if (isCreated) {
          this.createdTestimonialMessage = "Thank you for your testimonial!";
          this.model = new Testimonial();
        } else {
          this.createdTestimonialMessage = "Whoops! Something went wrong";
        }
      });
    }
  }

  onImageChange(event) {
    const image = event.target.files[0];
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        this.model.Photo = {File: image, Width: img.width, Height: img.height};
      };

      img.src = fr.result.toString();
    };

    fr.readAsDataURL(image);
  }
}
