/// <reference types="dist" />
import { Widget } from "../Widget";
export interface RectangleConfig {
    padding: number;
    style: PolyStyle;
}
export declare const Rectangle: (generator: import("../Widget").WidgetPropsGenerator<Widget, RectangleConfig> | {
    data: Widget;
    config?: Partial<RectangleConfig> | undefined;
}) => Widget;
