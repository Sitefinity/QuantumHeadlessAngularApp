import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { NewsItemsComponent } from './shared/news/newsitems/newsitems.component';
import { NewsItemComponent } from './shared/news/newsitem/newsitem.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing/app-routing.module';
import { SearchComponent } from './shared/search/search.component';
import { SearchResultComponent } from './shared/search/search-result/search-result.component';
import { TaxaComponent } from './shared/taxa/taxa.component';
import {ShowcasesComponent} from './shared/showcases/showcases.component';
import { ShowcaseComponent } from './shared/showcases/showcase/showcase.component';
import {ConfigComponent} from './shared/config/config.component';
import {FormsModule} from '@angular/forms';
import {LOCAL_STORAGE, StorageService} from './shared/services/storage.service';
import {LayoutComponent} from './shared/layout/layout.component';
import { RxBaseComponent } from './shared/common/rx-base/rx-base.component';

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
    RxBaseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    { provide: 'Sitefinity', useValue: window['Sitefinity'] },
    { provide: LOCAL_STORAGE, useValue: new StorageService(localStorage) },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
