import { Timeseries } from "metrics/Timeseries";
declare global {
    interface Memory {
        timeseries1: Timeseries;
        timeseries2: Timeseries;
    }
}
export declare function loop(): void;
