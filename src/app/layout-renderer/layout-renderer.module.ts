import { NgModule } from "@angular/core";
import { RootComponent } from "./components/root.component";
import {ContentComponent} from './components/content-block/content-block.component';
import {WrapperComponentDirective} from './directives/component-wrapper.directive';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import { PageContentService } from "./services/page-content.service";
import {LayoutComponent} from './components/layout/layout.component';

@NgModule({
  declarations: [
    RootComponent,
    ContentComponent,
    WrapperComponentDirective,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    PageContentService
  ]
})
export class LayoutRendererModule { }
