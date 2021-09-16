import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { NewsItemsComponent } from "./shared/news/newsitems/newsitems.component";
import { NewsItemComponent } from "./shared/news/newsitem/newsitem.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { RouterModule} from "@angular/router";
import { AppRoutingModule} from "./app-routing/app-routing.module";
import { SearchComponent } from "./shared/search/search.component";
import { SearchResultComponent } from "./shared/search/search-result/search-result.component";
import { TaxaComponent } from "./shared/taxa/taxa.component";
import { ShowcasesComponent } from "./shared/showcases/showcases.component";
import { ShowcaseComponent } from "./shared/showcases/showcase/showcase.component";
import { ConfigComponent } from "./shared/config/config.component";
import { FormsModule } from "@angular/forms";
import { LOCAL_STORAGE, StorageService } from "./shared/services/storage.service";
import { LayoutComponent } from "./shared/layout/layout.component";
import { TestimonialsComponent } from "./shared/testimonials/testimonials.component";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { OIDC_PROVIDER } from './shared/auth/oidc/oidc.provider';
import { SignInRedirectComponent } from "./shared/auth/oidc/sign-in-redirect/sign-in-redirect.component";
import { SignOutRedirectComponent } from "./shared/auth/oidc/sign-out-redirect/sign-out-redirect.component";
import { PathLocationStrategy } from "@angular/common";
import { CommentsComponent } from "./shared/comments/comments.component";
import { TestimonialFormComponent } from "./shared/testimonials/testimonial-form/testimonial-form.component";
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { RxBaseComponent } from "./shared/common/rx-base/rx-base.component";
import { OAUTH_PROVIDER } from './shared/auth/oauth/oauth.provider';
import {WINDOW_TOKEN} from './shared/common.constants';

@NgModule({
  declarations: [
    AppComponent,
    NewsItemsComponent,
    NewsItemComponent,
    NotFoundComponent,
    ShowcasesComponent,
    SearchComponent,
    SearchResultComponent,
    TaxaComponent,
    ShowcaseComponent,
    ConfigComponent,
    LayoutComponent,
    TestimonialsComponent,
    SignInRedirectComponent,
    SignOutRedirectComponent,
    CommentsComponent,
    TestimonialFormComponent,
    SidebarComponent,
    RxBaseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    CarouselModule.forRoot()
  ],
  providers: [
    PathLocationStrategy,
    OIDC_PROVIDER,
    OAUTH_PROVIDER,
    { provide: "Sitefinity", useValue: window["Sitefinity"] },
    { provide: LOCAL_STORAGE, useValue: new StorageService(localStorage) },
    { provide: WINDOW_TOKEN, useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
