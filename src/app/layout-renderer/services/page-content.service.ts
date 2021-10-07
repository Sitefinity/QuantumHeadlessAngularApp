import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable, ReplaySubject } from "rxjs";
import { ModelBase } from "../models/model-base";
import { PageContentServiceResponse, ComponentContext, ODataEntityResponse } from "../models/service-response";
import {SettingsService} from '../../shared/services/settings.service';

@Injectable()
export class PageContentService {
    public receivedContent$ = new ReplaySubject<ModelBase<any>>();

    private readonly serviceApi = "api/default";

    constructor(private http: HttpClient, private settingsService: SettingsService) { }

    public get(pageName: string): Observable<PageContentServiceResponse> {
        const return$ = new Subject<PageContentServiceResponse>();
        const rootUrl = this.settingsService.url;
        this.http.get(`${rootUrl}/${this.serviceApi}/pages/Default.Model(url=@param)?@param='${pageName}'`)
            .subscribe((s: PageContentServiceResponse) => {
                return$.next(s);

                if (s.ComponentContext.HasLazyComponents) {
                    this.getLazy(pageName).subscribe(r => {
                        r.Components.forEach(c => {
                            this.receivedContent$.next(c);
                        });
                    });
                }

            }, error => {
                return$.error(error);
            });

        return return$;
    }

    public getLazy(url: string): Observable<ComponentContext> {
        const return$ = new Subject<ComponentContext>();
        const rootUrl = this.settingsService.url;

        this.http.get(`${rootUrl}/${this.serviceApi}/Default.LazyComponents(url=@param)?@param='${url}'`)
            .subscribe((s: ComponentContext) => {
                return$.next(s);
            }, error => {
                return$.error(error);
            });

        return return$;
    }

    public getShared(id: string, providerName: string, cultureName: string, siteId: string): Observable<ODataEntityResponse> {
        const return$ = new Subject<ODataEntityResponse>();
        const rootUrl = this.settingsService.url;

        this.http.get(`${rootUrl}/${this.serviceApi}/contentitems(${id})?sf_provider=${providerName}&sf_culture=${cultureName}&sf_site=${siteId}`)
            .subscribe((s: ODataEntityResponse) => {
                return$.next(s);
            }, error => {
                return$.error(error);
            });

        return return$;
    }
}
