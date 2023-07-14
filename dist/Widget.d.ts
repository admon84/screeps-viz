export interface RenderConfig {
    pos: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
}
export declare type Widget = (props: RenderConfig) => void;
export declare type WidgetPropsGenerator<D, C> = () => {
    data: D;
    config?: Partial<C>;
};
export declare function ConfiguredWidget<DataType, ConfigType>(defaultConfig: ConfigType, handler: (props: {
    data: DataType;
    config: ConfigType;
    renderConfig: RenderConfig;
}) => void): (generator: WidgetPropsGenerator<DataType, ConfigType> | {
    data: DataType;
    config?: Partial<ConfigType>;
}) => Widget;
