import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "app-taxa",
  templateUrl: "./taxa.component.html"
})
export class TaxaComponent {
  @Input() taxas: Taxa[];
  @Input() classes: string;
  @Output() taxaClicked: EventEmitter<any> = new EventEmitter();

  handleClick(taxa: string) {
    this.taxaClicked.emit(taxa);
  }
}
 export class Taxa {
  Title: string;
  Id: string;
  Count?: number;
 }

 export class TaxaOptions {
   taxonomyId: string;
   taxonomyOptions: {
     urlName: string;
   };
 }
