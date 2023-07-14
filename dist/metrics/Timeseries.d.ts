export interface Timeseries {
    values: [number, number][];
}
export interface DeltaTimeseries {
    last?: number;
    values: [number, number][];
}
export interface NonNegativeDeltaTimeseries extends DeltaTimeseries {
}
export declare const newTimeseries: () => Timeseries;
export declare const min: (series: Timeseries, dimension?: number) => [number, number];
export declare const max: (series: Timeseries, dimension?: number) => [number, number];
export declare const sum: (series: Timeseries) => number;
export declare const head: (series: Timeseries, count: number) => Timeseries;
export declare const tail: (series: Timeseries, count: number) => Timeseries;
export declare const granularity: (series: Timeseries, ticks: number) => Timeseries;
export declare const avg: (series: Timeseries) => number;
export declare const last: (series: Timeseries) => [number, number];
export declare const update: (series: Timeseries, value: number | [number, number], limit?: number | undefined) => Timeseries;
export declare const updateDelta: (series: DeltaTimeseries, value: number | [number, number], limit?: number | undefined) => DeltaTimeseries;
export declare const updateNonNegativeDelta: (series: DeltaTimeseries, value: number | [number, number], limit?: number | undefined) => DeltaTimeseries;
