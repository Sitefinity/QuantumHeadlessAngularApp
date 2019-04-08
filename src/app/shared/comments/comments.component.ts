import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { CommentsService } from "../services/comments.service";
import { newsItemsDataOptions } from "../services/news.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html"
})
export class CommentsComponent implements OnInit {
  @Input() commentableItemId: string;
  comments: Comment[] = [];
  showCommentsForm: boolean;
  commentsCount = 0;
  creatingComment: boolean;
  model: Comment = new Comment();

  constructor(private authService: AuthService, private commentsService: CommentsService, private router: Router) {}

  ngOnInit() {
    this.authService.init().subscribe(() => {
      this.authService.isLoggedIn().subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.showCommentsForm = true;
          this.authService.getUser().subscribe((user) => {
            this.model.Name = user.Username;
            this.model.ProfilePictureUrl = user.Picture;
          });
        }
      });
    });
    this.getComments();
  }

  submitComment(form: any) {
    if (form.valid) {
      this.creatingComment = true;
      this.commentsService.createComment(newsItemsDataOptions, this.model, this.commentableItemId).subscribe((isCommentCreated) => {
        if (isCommentCreated) {
          this.getComments();
        }
      });
    }
  }

  getComments() {
    this.commentsService.getComments(newsItemsDataOptions, this.commentableItemId).subscribe((data: Comment[]) => {
      if (data) {
        if (this.comments.length === 0) {
          this.comments = data.reverse();
        }

        const elementsToTake = data.length - this.comments.length;
        const newComments = data.slice(0, elementsToTake).reverse();
        this.comments.push(...newComments);
        this.commentsCount = this.comments.length;
        this.model.Message = null;
        this.creatingComment = false;
      }
    });
  }

  login() {
    this.authService.init().subscribe(() => {
      this.authService.signIn(this.router.routerState.snapshot.url).subscribe();
    });
  }
}

export class Comment {
  Message: string;
  Name: string;
  ProfilePictureUrl: string;
  DateCreated?: string;
}
