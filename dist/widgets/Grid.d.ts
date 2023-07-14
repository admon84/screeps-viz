import { Widget } from "../Widget";
export interface GridConfig {
    padding: number;
    rows: number;
    columns: number;
}
/**
 * A simple grid that splits space evenly between widgets. If more widgets are provided than
 * will fit, the remaining widgets are silently ignored.
 */
export declare const Grid: (generator: import("../Widget").WidgetPropsGenerator<Widget[], GridConfig> | {
    data: Widget[];
    config?: Partial<GridConfig> | undefined;
}) => Widget;
