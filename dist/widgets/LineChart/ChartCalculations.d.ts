import { LineChartSeriesData } from "./LineChart";
export interface LineChartScale {
    x: {
        min: number;
        max: number;
    };
    y: {
        min: number;
        max: number;
    };
}
/**
 * Given a Record of series data, calculates the appropriate scale to contain all data
 */
export declare const calculateScaleFromSeries: (chartSeriesData: LineChartSeriesData) => LineChartScale;
export declare const scaleToChartSpace: (scale: LineChartScale, coords: [number, number]) => {
    x: number;
    y: number;
};
/**
 * (0,0) corresponds to the bottom left of chart space, but top left of room space
 */
export declare const chartSpaceToRoomPosition: (x: number, y: number, width: number, height: number, chartSpaceCoords: {
    x: number;
    y: number;
}) => [number, number];
