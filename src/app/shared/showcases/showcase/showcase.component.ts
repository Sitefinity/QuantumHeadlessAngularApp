import { Component, OnInit } from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {Showcase} from "../showcases.component";
import {RxBaseComponent} from "../../common/rx-base/rx-base.component";
import {ShowcasesService} from "../../services/showcases.service";

@Component({
  selector: "app-showcase",
  templateUrl: "./showcase.component.html"
})
export class ShowcaseComponent implements OnInit {
  showcase: Observable<Showcase>;

  constructor(private showcasesService: ShowcasesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getShowcase();
  }

  getShowcase() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.showcase = this.showcasesService.getShowcaseById(id);
    }
  }

}
