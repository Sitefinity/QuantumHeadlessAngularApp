import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ModelBase } from "../models/model-base";
import { PageContentService } from "../services/page-content.service";

export class BaseComponent<T> implements OnDestroy {
    public Model: ModelBase<T> = {} as ModelBase<T>;

    private subscriptions: Subscription[] = [];
    protected pageContentService: PageContentService;

    constructor(pageContentService: PageContentService) {
        this.pageContentService = pageContentService;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

    protected registerSubscription(sub: Subscription) {
        this.subscriptions.push(sub);
    }
}
