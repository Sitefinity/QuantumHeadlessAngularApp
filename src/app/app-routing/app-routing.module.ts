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
import {AUTH_ROUTE_PATHS, ROUTE_PATHS} from './route-paths';
import {LayoutComponent} from '../shared/layout/layout.component';
import {config} from 'rxjs';
import {SignInRedirectComponent} from '../shared/auth/oidc/sign-in-redirect/sign-in-redirect.component';
import {SignOutRedirectComponent} from '../shared/auth/oidc/sign-out-redirect/sign-out-redirect.component';
import {AuthGuard} from '../shared/auth/auth.guard';
import {TestimonialFormComponent} from '../shared/testimonials/testimonial-form/testimonial-form.component';


const routes: Routes = [
  { path: ROUTE_PATHS.LAYOUT,
    component: LayoutComponent,
    canActivate: [ConfigGuard],
    runGuardsAndResolvers: 'always',
    children: [
      { path: '', redirectTo: 'news', pathMatch: 'full' },
      { path: ROUTE_PATHS.NEWS, component: NewsItemsComponent, data: { title: 'Quantum News', image: 'News Head Banner'}},
      { path: ROUTE_PATHS.NEWS + '/:id', component: NewsItemComponent},
      { path: ROUTE_PATHS.SHOWCASES,  component: ShowcasesComponent, data: { title: 'Showcases', image: 'Development Head Banner' }},
      { path: ROUTE_PATHS.SHOWCASES + '/:id',  component: ShowcaseComponent},
      { path: ROUTE_PATHS.SEARCH_RESULTS + '/:searchTerm',  component: SearchResultComponent, data: { title: 'Search results', image: 'Forums Head Banner'} },
      { path: ROUTE_PATHS.SUBMIT_TESTIMONIAL, component: TestimonialFormComponent, canActivate: [AuthGuard]}
    ]
  },
  { path: "auth", children: [
      {
        path: "oidc", children: [
          {
            path: AUTH_ROUTE_PATHS.SIGN_IN_REDIRECT, component: SignInRedirectComponent
          },
          {
            path: AUTH_ROUTE_PATHS.SIGN_OUT_REDIRECT, component: SignOutRedirectComponent
          }
        ]
      }
    ]},
  { path: ROUTE_PATHS.CONFIG,  component: ConfigComponent},
  { path: ROUTE_PATHS.NOT_FOUND, component: NotFoundComponent },
  { path: ROUTE_PATHS.NOT_FOUND_ANY, redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
