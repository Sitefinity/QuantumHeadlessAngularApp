import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NewsItemsComponent} from '../shared/news/newsitems/newsitems.component';
import {NotFoundComponent} from '../shared/not-found/not-found.component';
import {NewsItemComponent} from '../shared/news/newsitem/newsitem.component';
import {SearchResultComponent} from '../shared/search/search-result/search-result.component';
import {ShowcasesComponent} from '../shared/showcases/showcases.component';
import {ShowcaseComponent} from '../shared/showcases/showcase/showcase.component';


const routes: Routes = [
  { path: 'news',  component: NewsItemsComponent, data: { title: 'Quantum News',  image: 'News Head Banner' }},
  { path: 'news/:id', component: NewsItemComponent},
  { path: 'showcases',  component: ShowcasesComponent, data: { title: 'Showcases', image: 'Development Head Banner' }},
  { path: 'showcase/:id',  component: ShowcaseComponent},
  { path: 'search-results',  component: SearchResultComponent},
  { path: '', redirectTo: 'news', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
