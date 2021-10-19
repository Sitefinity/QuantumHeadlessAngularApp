import { Component, OnInit } from "@angular/core";
import { PageContentService } from "../../services/page-content.service";
import { ContentBlockProperties } from "../../models/content-block-model";
import { ODataEntityResponse } from "../../models/service-response";
import { BaseComponent } from "../base.component";

@Component({
    templateUrl: "content-block.component.html",
    selector: "app-content"
})
export class ContentComponent extends BaseComponent<ContentBlockProperties> implements OnInit {
    constructor(protected pageContentService: PageContentService) {
        super(pageContentService);
    }

    ngOnInit() {
        if (this.Model.Properties && this.Model.Properties.SharedContentID && this.Model.Properties.ProviderName) {
            const sub = this.pageContentService.getShared(this.Model.Properties.SharedContentID, this.Model.Properties.ProviderName, this.Model.Culture, this.Model.SiteId)
                            .subscribe((response: ODataEntityResponse) => {
                this.Model.Properties.Content = response.Content;
            });

            this.registerSubscription(sub);
        }
    }
}
