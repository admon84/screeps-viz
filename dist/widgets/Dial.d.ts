/// <reference types="dist" />
export interface DialConfig {
    label: string;
    textStyle: TextStyle;
    foregroundStyle: PolyStyle;
    backgroundStyle: PolyStyle;
}
export interface DialData {
    value: number;
}
export declare const Dial: (generator: import("../Widget").WidgetPropsGenerator<DialData, DialConfig> | {
    data: DialData;
    config?: Partial<DialConfig> | undefined;
}) => import("../Widget").Widget;
