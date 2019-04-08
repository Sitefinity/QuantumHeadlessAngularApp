import { Component, OnInit } from "@angular/core";
import { ShowcasesService } from "../services/showcases.service";
import { Image } from "../news/newsitems/newsitems.component";
import { Observable } from "rxjs";
import { RxBaseComponent } from "../common/rx-base/rx-base.component";

@Component({
  selector: "app-showcases",
  templateUrl: "./showcases.component.html"
})
export class ShowcasesComponent extends RxBaseComponent implements OnInit {
  showcases: Observable<Showcase[]>;

  constructor(private showcasesService: ShowcasesService) {
    super();
  }

  ngOnInit() {
    this.showcases =  this.showcasesService.getShowcases();
  }
}

export class Showcase {
  Title: string;
  Client: string;
  Website: string;
  Challenge: string;
  Solution: string;
  Results: string;
  PublicationDate: string;
  Thumbnail?: Image;
  Download?: Image;
}
