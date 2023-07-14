/// <reference types="dist" />
export interface BarConfig {
    label: string;
    style: PolyStyle;
}
export interface BarData {
    value: number;
    targetValue?: number;
    maxValue?: number;
}
export declare const Bar: (generator: import("../Widget").WidgetPropsGenerator<BarData, BarConfig> | {
    data: BarData;
    config?: Partial<BarConfig> | undefined;
}) => import("../Widget").Widget;
