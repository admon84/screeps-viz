/// <reference types="dist" />
import { Widget, WidgetPropsGenerator } from "../Widget";
export interface LabelConfig {
    style: TextStyle;
}
export declare const Label: (generator: WidgetPropsGenerator<string, LabelConfig> | {
    data: string;
    config?: Partial<LabelConfig> | undefined;
}) => Widget;
