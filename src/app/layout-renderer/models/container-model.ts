import { ModelBase } from "./model-base";

export interface ColumnModel {
    css: string;
    label: string;
    children: ModelBase<any>[];
    placeholder: string;
}

export const LayoutColumns = {
    "1-column": 1,
    "2-columns": 2,
    "3-columns": 3,
    "4-columns": 4,
    "5-columns": 5,
    "6-columns": 6,
};
