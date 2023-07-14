import { Widget, WidgetPropsGenerator } from "../Widget";
export interface TableConfig {
    label?: string;
    headers: string[];
}
export declare type TableData = any[][];
export declare const Table: (generator: WidgetPropsGenerator<TableData, TableConfig> | {
    data: TableData;
    config?: Partial<TableConfig> | undefined;
}) => Widget;
