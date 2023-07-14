import { Widget } from "./Widget";
export interface DashboardWidget {
    pos: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
    widget: Widget;
}
export interface DashboardConfig {
    room?: string;
}
export declare function Dashboard(params: {
    widgets: DashboardWidget[];
    config?: DashboardConfig;
}): void;
