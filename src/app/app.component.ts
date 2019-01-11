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
export class AppComponent{
  constructor() {}

}
