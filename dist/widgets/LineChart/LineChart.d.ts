/// <reference types="dist" />
import { Timeseries } from "metrics/Timeseries";
export interface LineChartSeriesConfig {
    label: string;
    color?: string;
}
export interface LineChartConfig {
    label: string;
    style: PolyStyle;
    series: Record<string, LineChartSeriesConfig>;
    scale?: {
        x?: {
            min?: number;
            max?: number;
        };
        y?: {
            min?: number;
            max?: number;
        };
    };
}
export declare type LineChartSeriesData = Record<string, Timeseries | [number, number][]>;
/**
 * A simple line chart that can plot multiple series.
 */
export declare const LineChart: (generator: import("../../Widget").WidgetPropsGenerator<LineChartSeriesData, LineChartConfig> | {
    data: LineChartSeriesData;
    config?: Partial<LineChartConfig> | undefined;
}) => import("../../Widget").Widget;
