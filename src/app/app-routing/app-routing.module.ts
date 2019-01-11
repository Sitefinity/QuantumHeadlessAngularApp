import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NewsItemsComponent} from '../shared/news/newsitems/newsitems.component';
import {NotFoundComponent} from '../shared/not-found/not-found.component';
import {NewsItemComponent} from '../shared/news/newsitem/newsitem.component';
import {SearchResultComponent} from '../shared/search/search-result/search-result.component';
import {ShowcasesComponent} from '../shared/showcases/showcases.component';
import {ShowcaseComponent} from '../shared/showcases/showcase/showcase.component';
import {ConfigComponent} from '../shared/config/config.component';
import {ConfigGuard} from '../config.guard';
import {ROUTE_PATHS} from './route-paths';
import {LayoutComponent} from '../shared/layout/layout.component';


const routes: Routes = [
  { path: ROUTE_PATHS.LAYOUT,
    component: LayoutComponent,
    canActivate: [ConfigGuard],
    children: [
      { path: '', redirectTo: 'news', pathMatch: 'full' },
      { path: ROUTE_PATHS.NEWS, component: NewsItemsComponent, canActivate: [ConfigGuard], data: { title: 'Quantum News', image: 'News Head Banner'}},
      { path: ROUTE_PATHS.NEWS + '/:id', component: NewsItemComponent, canActivate: [ConfigGuard] },
      { path: ROUTE_PATHS.SHOWCASES,  component: ShowcasesComponent, canActivate: [ConfigGuard], data: { title: 'Showcases', image: 'Development Head Banner' }},
      { path: ROUTE_PATHS.SHOWCASES + '/:id',  component: ShowcaseComponent, canActivate: [ConfigGuard] },
      { path: ROUTE_PATHS.SEARCH_RESULTS,  component: SearchResultComponent, canActivate: [ConfigGuard] }
    ]
  },
  { path: ROUTE_PATHS.CONFIG,  component: ConfigComponent},
  { path: ROUTE_PATHS.NOT_FOUND, component: NotFoundComponent },
  { path: ROUTE_PATHS.NOT_FOUND_ANY, redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
