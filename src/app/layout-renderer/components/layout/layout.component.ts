import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { LayoutColumns, ColumnModel } from "../../models/container-model";
import { BaseComponent } from "../base.component";
import { PageContentService } from "../../services/page-content.service";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html"
})
export class LayoutComponent extends BaseComponent<{ [key: string]: string }> implements OnInit {
    public columns: ColumnModel[] = [];
    public rowCss: string;
    public placeholderName: string;
    public isContainer: boolean;

    public itemTemplateName: TemplateRef<any>;

    @ViewChild("container", { static: true }) private containerTemplate: TemplateRef<any>;
    @ViewChild("columnsTemplate", { static: true }) private columnsTemplate: TemplateRef<any>;

    constructor(protected pageContentService: PageContentService) {
        super(pageContentService);
    }

    public ngOnInit() {
        this.rowCss = this.Model.Properties[`Row_Css`];
        this.setPlaceholderName(this.rowCss);
        this.generateColumns();
        this.setTemplate();
    }

    private generateColumns() {
        const columns = LayoutColumns[this.Model.ViewName];
        this.generateColumnsModels(columns);
    }

    private generateColumnsModels(colCount: number) {
        const columns: ColumnModel[] = [];
        if (!this.rowCss) {
          columns.push(this.getColumn(this.placeholderName));
        } else {
          for (let i = 0; i < colCount; i++) {
            const placeholder = `Column${i + 1}`;
            columns.push(this.getColumn(placeholder));
          }
        }

        this.columns = columns;
    }

    private getColumn(placeholder: string): ColumnModel {
      const children = this.Model.Children.filter(c => c.PlaceHolder === placeholder);
      return {
        children,
        placeholder,
        css: this.Model.Properties[`${placeholder}_Css`],
        label: this.Model.Properties[`${placeholder}_Label`],
      };
    }
    private setPlaceholderName(rowCss: string) {
      if (!rowCss) {
        const viewType = this.Model.Properties.ViewType;
        this.isContainer = true;

        if (viewType && (viewType  === "ContainerFluid")) {
          this.placeholderName = "ContainerFluid";
        } else {
          this.placeholderName = "Container";
        }
      }
    }

    private setTemplate() {
      this.itemTemplateName = this.columnsTemplate;
    }
}
