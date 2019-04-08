import { Component, OnInit } from '@angular/core';
import {Image} from '../news/newsitems/newsitems.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from '@angular/router';
import {ImagesService} from '../services/images.service';
import {Title} from '@angular/platform-browser';
import {filter, map, mergeMap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  bannerImage: Observable<Image>;
  logoImage: Observable<Image>;
  title: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private imageService: ImagesService, private router: Router, private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    )
      .subscribe((event) => {
        this.setImageAndTitle(event);
      });

    this.route.url.subscribe(() => {
      const routeData = this.route.snapshot.firstChild.data;
      this.setImageAndTitle(routeData);
    });

    this.logoImage = this.imageService.getImageByTitle('Logo_Quantum');
  }

  setImageAndTitle(data: any) {
    this.bannerImage = this.imageService.getImageByTitle(data['image']);
    this.title.next(data['title']);
    this.titleService.setTitle(data['title']);
  }
}
