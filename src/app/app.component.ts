import {Component, OnInit} from '@angular/core';
import {Image} from './shared/news/newsitems/newsitems.component';
import {ImagesService} from './shared/services/images.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {filter, map, mergeMap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  bannerImage: Observable<Image>;
  logoImage: Observable<Image>;
  title: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private imageService: ImagesService, private router: Router, private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    )
    .subscribe((event) => {
      this.bannerImage = this.imageService.getImageByTitle(event['image']);
      this.title.next(event['title']);
      this.titleService.setTitle(event['title']);
    });

    this.logoImage = this.imageService.getImageByTitle('Logo_Quantum');
  }
}
