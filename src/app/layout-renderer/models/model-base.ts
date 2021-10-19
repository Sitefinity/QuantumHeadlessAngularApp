export class ModelBase<T> {
    Id: string;
    Name: string;
    Caption: string;

    Lazy: boolean;
    ViewName: string;
    PlaceHolder: string;
    Properties: T;
    Children: ModelBase<any>[];

    Culture: string;
    SiteId: string;
}
