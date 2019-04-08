import { Injectable } from "@angular/core";
import { SitefinityService } from "./sitefinity.service";
import { Observable, ReplaySubject } from "rxjs";
import { Comment } from "../comments/comments.component";

@Injectable({
  providedIn: "root"
})
export class CommentsService {

  constructor(private sitefinity: SitefinityService) { }

  getComments(contentItemsDataOptions: DataOptions, contentItemId: string, skip?: number, take?: number ): Observable<Comment[]> {
    const commentSubject = new ReplaySubject<Comment[]>(1);
    this.sitefinity.instance.data(contentItemsDataOptions).getSingle({
      key: contentItemId,
      action: "Comments",
      successCb: data => { return commentSubject.next(data.value as Comment[]); },
      failureCb: data => console.log(data)
    });
    return commentSubject.asObservable();
  }

  createComment(contentItemsDataOptions: DataOptions, comment: Comment, contentItemId: string): Observable<boolean> {
    const isCommentCreated = new ReplaySubject<boolean>(1);

    this.sitefinity.instance.data({
      urlName: contentItemsDataOptions.urlName,
      providerName: contentItemsDataOptions.providerName,
      cultureName: "en"
    }).create({
      key: contentItemId,
      action: "postcomment",
      data: {"name": comment.Name, "message": comment.Message },
      successCb: () => isCommentCreated.next(true),
      failureCb: (error) => {
        console.log(error);
        isCommentCreated.next(false);
      }
    });

    return isCommentCreated.asObservable();
  }
}

export class DataOptions {
  urlName: string;
  providerName: string;
  cultureName: string;
}
