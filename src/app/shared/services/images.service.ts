import { Injectable } from "@angular/core";
import { endpoint, SitefinityService } from "./sitefinity.service";
import { Observable, ReplaySubject } from "rxjs";
import { Album, Image } from "../news/newsitems/newsitems.component";
import { SettingsService } from "./settings.service";
import { DomSanitizer } from "@angular/platform-browser";

export const imageDataOptions = {
  urlName: "images",
};

export const albumDataOptions = {
  urlName: "albums",
};

@Injectable({
  providedIn: "root"
})
export class ImagesService {

  constructor(private sitefinity: SitefinityService,  private settingsService: SettingsService, private sanitizer: DomSanitizer) { }

  getImageByTitle(title: string): Observable<Image> {
    const replaySubjectImage = new ReplaySubject<Image>(1);
    this.sitefinity.instance.data(imageDataOptions).get({
      query: this.sitefinity
        .query
        .order("Title desc")
        .where()
        .eq("Title", title)
        .done(),
      successCb: data => replaySubjectImage.next(data.value[0]),
      failureCb: data => console.log(data)
    });
    return replaySubjectImage.asObservable();
  }

  getLibraryByTitle(title: string): Observable<Album> {
    const replaySubjectLibrary = new ReplaySubject<Album>(1);
    this.sitefinity.instance.data(albumDataOptions).get({
      query: this.sitefinity
        .query
        .order("Title desc")
        .where()
        .eq("Title", title)
        .done(),
      successCb: data => replaySubjectLibrary.next(data.value[0]),
      failureCb: data => console.log(data)
    });
    return replaySubjectLibrary.asObservable();
  }

  public uploadImage(libraryId: string, imageProperties: any ): Observable<any> {
    const upload = { success: false, failure: false, result: null, errorMessage: null };
    const resultSubject = new ReplaySubject<any>(1);

    const success = (result) => {
      const { data } = result.data[0].response[0];

      if (result.isSuccessful) {
        upload.result = data;
        upload.success = true;
        resultSubject.next(upload);
        resultSubject.complete();
      } else {
        upload.failure = true;
        upload.errorMessage = data.error;
        resultSubject.next(upload);
      }
    };
    const reject = (result) => {
      upload.failure = true;
      resultSubject.next(upload);
    };

    const progress = () => {};

    const batch = this.sitefinity.instance.batch(success, reject, progress, {
      providerName: "OpenAccessDataProvider",
      cultureName: "en"
    });

    const transaction = batch.beginTransaction();
    const file = imageProperties.File || imageProperties.file;
    const url = window.URL.createObjectURL(file);
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    const imagePrimitives: ImagePrimitives = {
      ParentId: libraryId,
      DirectUpload: true,
      Height: imageProperties.height,
      Width: imageProperties.width,
      Title: imageProperties.File.name || imageProperties.file
    };

    const uploadedFile = transaction.upload({
      entitySet: "images",
      data: file,
      dataUrl: safeUrl,
      contentType: file.type,
      fileName: file.name,
      uploadProperties: imagePrimitives
    });

    transaction.operation({
      entitySet: "images",
      key: uploadedFile,
      data: {
        action: "Publish"
      }
    });
    batch.endTransaction(transaction);
    batch.execute();

    return resultSubject.asObservable();
    }

  public associateRelatedImage(relationalFieldName: string, relationalField: {}, entitySet: string, itemId: any, relationId: string, transaction: any) {
      transaction.destroyRelated({
        entitySet: entitySet,
        key: relationId,
        navigationProperty: relationalFieldName
      });
      const relationLink = this.settingsService.url + endpoint + "images(" + itemId + ")";

      transaction.createRelated({
        entitySet: entitySet,
        key: relationId,
        navigationProperty: relationalFieldName,
        link: relationLink
    });
  }

  public sortFieldValues(obj: any): SortedProperties {
    const sortedFieldValues: SortedProperties = { primitives: {}, relational: {} };
    for (const key in obj) {
      if (this.isPrimitiveProperty(obj[key])) {
        sortedFieldValues.primitives[key] = obj[key];
      } else {
        sortedFieldValues.relational[key] = obj[key];
      }
    }
    return sortedFieldValues;
  }

  private isPrimitiveProperty(property: any) {
    return !this.isObject(property);
  }

  private isObject(val) {
    if (val === null) { return false; }
    return ( (typeof val === "function") || (typeof val === "object") );
  }
}

class ImagePrimitives {
  DirectUpload: boolean;
  Height: number;
  Width: number;
  ParentId: string;
  Title: string;
}

class SortedProperties {
  primitives: {};
  relational: {};
}
