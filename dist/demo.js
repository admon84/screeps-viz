'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var newTimeseries = function () { return ({ values: [] }); };
var timestampValue = function (value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [Game.time, value];
};
var update = function (series, value, limit) {
    series.values.push(timestampValue(value));
    while (limit !== undefined && series.values.length > limit) {
        series.values.shift();
    }
    return series;
};

// Borrowed from https://github.com/voodoocreation/ts-deepmerge
// istanbul ignore next
var isObject = function (obj) {
    if (typeof obj === "object" && obj !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            var prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    return false;
};
var deepMerge = function () {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    return objects.reduce(function (result, current) {
        Object.keys(current).forEach(function (key) {
            if (Array.isArray(result[key]) && Array.isArray(current[key])) {
                result[key] = Array.from(new Set(result[key].concat(current[key])));
            }
            else if (isObject(result[key]) && isObject(current[key])) {
                result[key] = deepMerge(result[key], current[key]);
            }
            else {
                result[key] = current[key];
            }
        });
        return result;
    }, {});
};

function ConfiguredWidget(defaultConfig, handler) {
    return function (generator) {
        return function (props) {
            var _a = (typeof generator === 'object') ? generator : generator(), data = _a.data, config = _a.config;
            var mergedConfig = config ? deepMerge(defaultConfig, config) : defaultConfig;
            handler({
                data: data,
                config: mergedConfig,
                renderConfig: props
            });
        };
    };
}

var roomVisual = new RoomVisual();
var setRoom = function (room) {
    roomVisual = new RoomVisual(room);
};
var viz = function () { return roomVisual; };

var Bar = ConfiguredWidget({
    label: '',
    style: {
        fill: 'white',
        stroke: 'white',
        lineStyle: 'solid'
    }
}, function (_a) {
    var _b;
    var data = _a.data, config = _a.config, renderConfig = _a.renderConfig;
    var height = renderConfig.height, width = renderConfig.width, pos = renderConfig.pos;
    var value = data.value, maxValue = data.maxValue;
    var effectiveMax = Math.max(value, maxValue !== null && maxValue !== void 0 ? maxValue : 0);
    var valueHeight = Math.max(effectiveMax !== 0 ? (value / effectiveMax) * (height - 1) : 0, 0.1);
    var maxValueHeight = Math.max(effectiveMax !== 0 ? ((maxValue !== null && maxValue !== void 0 ? maxValue : value) / effectiveMax) * (height - 1) : 0, 0.1);
    // Draw labels
    var center = pos.x + width / 2;
    viz().text(config.label, center, pos.y + height);
    viz().text((_b = maxValue === null || maxValue === void 0 ? void 0 : maxValue.toFixed(0)) !== null && _b !== void 0 ? _b : '', center, pos.y + 1);
    viz().text(value.toFixed(0), center, pos.y + height - 1.5);
    // Draw bar, scaled
    viz().rect(pos.x, pos.y + (height - maxValueHeight - 1), width, maxValueHeight, __assign(__assign({}, config.style), { fill: 'transparent' }));
    viz().rect(pos.x, pos.y + (height - valueHeight - 1), width, valueHeight, __assign(__assign({}, config.style), { stroke: 'transparent' }));
});

var defaultConfig = {};
function Dashboard(params) {
    var widgets = params.widgets, config = params.config;
    var mergedConfig = config ? deepMerge(defaultConfig, config) : defaultConfig;
    setRoom(mergedConfig.room);
    widgets.forEach(function (widget) {
        widget.widget({
            pos: widget.pos,
            width: widget.width,
            height: widget.height
        });
    });
}

/**
 * A simple grid that splits space evenly between widgets. If more widgets are provided than
 * will fit, the remaining widgets are silently ignored.
 */
var Grid = ConfiguredWidget({
    padding: 1,
    rows: 2,
    columns: 2,
}, function (_a) {
    var widgets = _a.data, config = _a.config, renderConfig = _a.renderConfig;
    var padding = config.padding, rows = config.rows, columns = config.columns;
    var height = renderConfig.height, width = renderConfig.width, pos = renderConfig.pos;
    var widgetHeight = (height - (padding * (rows - 1))) / rows;
    var widgetWidth = (width - (padding * (columns - 1))) / columns;
    for (var q = 0; q < columns; q++) {
        for (var r = 0; r < rows; r++) {
            if (!widgets[q + (r * columns)])
                break;
            widgets[q + (r * columns)]({
                pos: {
                    x: pos.x + (widgetWidth + padding) * q,
                    y: pos.y + (widgetHeight + padding) * r,
                },
                width: widgetWidth,
                height: widgetHeight,
            });
        }
    }
});

var Label = ConfiguredWidget({
    style: {
        color: 'white',
        align: 'center'
    }
}, function (_a) {
    var _b;
    var data = _a.data, config = _a.config, renderConfig = _a.renderConfig;
    // Draw labels
    var pos = renderConfig.pos, height = renderConfig.height, width = renderConfig.width;
    var fontSize = ((_b = config.style.font) !== null && _b !== void 0 ? _b : 0.7);
    var baseline = typeof fontSize === 'number' ? fontSize / 3 : 0.25;
    var x;
    var y;
    if (config.style.align === 'left') {
        x = pos.x;
        y = pos.y + height / 2 + baseline;
    }
    else if (config.style.align === 'right') {
        x = pos.x + width;
        y = pos.y + height / 2 + baseline;
    }
    else {
        x = pos.x + width / 2;
        y = pos.y + height / 2 + baseline;
    }
    viz().text(data, x, y, config.style);
});

/**
 * Given a Record of series data, calculates the appropriate scale to contain all data
 */
var calculateScaleFromSeries = function (chartSeriesData) {
    var initialScale = {
        x: { min: Infinity, max: -Infinity },
        y: { min: Infinity, max: -Infinity },
    };
    return Object.values(chartSeriesData).reduce(function (results, series) {
        var data = Array.isArray(series) ? series : series.values;
        var seriesBounds = data.reduce(function (seriesResults, row) {
            return {
                x: {
                    min: Math.min(seriesResults.x.min, row[0]),
                    max: Math.max(seriesResults.x.max, row[0])
                },
                y: {
                    min: Math.min(seriesResults.y.min, row[1]),
                    max: Math.max(seriesResults.y.max, row[1])
                }
            };
        }, initialScale);
        return {
            x: {
                min: Math.min(seriesBounds.x.min, results.x.min),
                max: Math.max(seriesBounds.x.max, results.x.max),
            },
            y: {
                min: Math.min(seriesBounds.y.min, results.y.min),
                max: Math.max(seriesBounds.y.max, results.y.max),
            }
        };
    }, initialScale);
};
var scaleToChartSpace = function (scale, coords) {
    return {
        x: Math.min(1, Math.max(0, (coords[0] - scale.x.min) / (scale.x.max - scale.x.min))),
        y: Math.min(1, Math.max(0, (coords[1] - scale.y.min) / (scale.y.max - scale.y.min))),
    };
};
/**
 * (0,0) corresponds to the bottom left of chart space, but top left of room space
 */
var chartSpaceToRoomPosition = function (x, y, width, height, chartSpaceCoords) {
    return [
        x + width * chartSpaceCoords.x,
        y + height - (height * chartSpaceCoords.y)
    ];
};

var randomWebColor = function () { return (['red', 'yellow', 'lime', 'green', 'aqua', 'teal', 'blue', 'fuchsia', 'purple'][Math.round(Math.random() * 9)]); };
/**
 * A simple line chart that can plot multiple series.
 */
var LineChart = ConfiguredWidget({
    label: '',
    style: {
        fill: 'black',
        stroke: 'white',
        lineStyle: 'solid',
        opacity: 0.7
    },
    series: {}
}, function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var chartSeriesData = _a.data, config = _a.config, renderConfig = _a.renderConfig;
    var width = renderConfig.width, height = renderConfig.height, pos = renderConfig.pos;
    var series = Object.keys(chartSeriesData).sort();
    // Draw labels
    var center = pos.x + width / 2;
    viz().text(config.label, center, pos.y + height);
    // Draw Chart, scaled
    viz().rect(pos.x + 1, pos.y, width - 1, height - 1, config.style);
    // Calculate bounds of chart
    var calculatedScale = calculateScaleFromSeries(chartSeriesData);
    var mergedScale = {
        x: {
            min: (_d = (_c = (_b = config === null || config === void 0 ? void 0 : config.scale) === null || _b === void 0 ? void 0 : _b.x) === null || _c === void 0 ? void 0 : _c.min) !== null && _d !== void 0 ? _d : calculatedScale.x.min,
            max: (_g = (_f = (_e = config === null || config === void 0 ? void 0 : config.scale) === null || _e === void 0 ? void 0 : _e.x) === null || _f === void 0 ? void 0 : _f.max) !== null && _g !== void 0 ? _g : calculatedScale.x.max,
        },
        y: {
            min: (_k = (_j = (_h = config === null || config === void 0 ? void 0 : config.scale) === null || _h === void 0 ? void 0 : _h.y) === null || _j === void 0 ? void 0 : _j.min) !== null && _k !== void 0 ? _k : calculatedScale.y.min,
            max: (_o = (_m = (_l = config === null || config === void 0 ? void 0 : config.scale) === null || _l === void 0 ? void 0 : _l.y) === null || _m === void 0 ? void 0 : _m.max) !== null && _o !== void 0 ? _o : calculatedScale.y.max,
        }
    };
    // Display axes and labels, if configured
    var labelCount = series.length;
    series.forEach(function (s, index) {
        var _a, _b;
        var _c, _d;
        // Generate series config, if needed
        (_a = (_c = config.series)[s]) !== null && _a !== void 0 ? _a : (_c[s] = {
            label: s,
        });
        (_b = (_d = config.series[s]).color) !== null && _b !== void 0 ? _b : (_d.color = randomWebColor());
        // Draw label
        var labelWidth = ((width - 6) / labelCount);
        var offset = 3 + labelWidth * (index + 0.5);
        viz().text(config.series[s].label, pos.x + offset, pos.y + height, {
            color: config.series[s].color,
        });
    });
    viz().text(mergedScale.x.min.toFixed(0), pos.x + 1.5, pos.y + height);
    viz().text(mergedScale.x.max.toFixed(0), pos.x + width - 0.5, pos.y + height);
    viz().text(mergedScale.y.min.toFixed(0), pos.x, pos.y + height - 1);
    viz().text(mergedScale.y.max.toFixed(0), pos.x, pos.y + 0.5);
    // Display lines
    series.forEach(function (seriesName) {
        var s = chartSeriesData[seriesName];
        var data = Array.isArray(s) ? s : s.values;
        viz().poly(data.map(function (coords) {
            return chartSpaceToRoomPosition(pos.x + 1, pos.y, width - 1, height - 1, scaleToChartSpace(mergedScale, coords));
        }), {
            strokeWidth: 0.1,
            stroke: config.series[seriesName].color,
            opacity: 1
        });
    });
});

var Rectangle = ConfiguredWidget({
    padding: 1,
    style: {
        fill: 'black',
        stroke: 'white',
        opacity: 0.3,
        lineStyle: 'solid'
    }
}, function (_a) {
    var data = _a.data, config = _a.config, renderConfig = _a.renderConfig;
    var padding = config.padding, style = config.style;
    var pos = renderConfig.pos, width = renderConfig.width, height = renderConfig.height;
    viz().rect(pos.x, pos.y, width, height, style);
    data({
        pos: {
            x: pos.x + padding,
            y: pos.y + padding,
        },
        width: width - (2 * padding),
        height: height - (2 * padding)
    });
});

var Table = ConfiguredWidget({
    headers: [],
}, function (_a) {
    var data = _a.data, config = _a.config, renderConfig = _a.renderConfig;
    var label = config.label, headers = config.headers;
    var pos = renderConfig.pos, height = renderConfig.height, width = renderConfig.width;
    var labelHeight = (label ? 1 : 0);
    var rows = data.slice(0, height - labelHeight);
    var columnWidths = headers.map(function (header, index) {
        var width = Math.max(header.length, rows.reduce(function (maxWidth, row) { var _a, _b; return Math.max(maxWidth, (_b = (_a = row[index]) === null || _a === void 0 ? void 0 : _a.toString().length) !== null && _b !== void 0 ? _b : 0); }, 0), 1);
        return width;
    });
    var columnWidthSum = columnWidths.reduce(function (a, b) { return (a + b); }, 0);
    var columnOffsets = [0];
    columnWidths.forEach(function (colWidth, index) {
        columnOffsets.push((width * (colWidth / columnWidthSum)) + columnOffsets[index]);
    });
    // Draw label
    if (label) {
        viz().text(label, (pos.x + width / 2), pos.y);
    }
    // Draw headers
    headers.forEach(function (header, index) {
        viz().text(header, pos.x + columnOffsets[index], pos.y + labelHeight, { align: 'left' });
    });
    // Draw body
    rows.forEach(function (row, rowIndex) {
        row.forEach(function (cell, columnIndex) {
            viz().text(cell, pos.x + columnOffsets[columnIndex], pos.y + 1 + labelHeight + rowIndex, { align: 'left' });
        });
    });
});

var Dial = ConfiguredWidget({
    label: '',
    textStyle: { font: '0.85', },
    foregroundStyle: {
        stroke: 'white',
        strokeWidth: 1,
    },
    backgroundStyle: {
        stroke: '#333333',
        strokeWidth: 1,
    },
}, function (_a) {
    var data = _a.data, config = _a.config, renderConfig = _a.renderConfig;
    var height = renderConfig.height, width = renderConfig.width, pos = renderConfig.pos;
    var value = data.value;
    value = Math.max(0, Math.min(1, value)); // Constrain between 0 and 1
    // Display constants labels
    var RESOLUTION = 16;
    var RANGE = 1.2 * Math.PI;
    var START_ANGLE = (3 * Math.PI - RANGE) / 2;
    var background_increment = RANGE / (RESOLUTION - 1);
    var increment = (RANGE * value) / (RESOLUTION - 1);
    var radius = Math.min(width * (1 / 3), height * (1 / 2));
    var offsetX = pos.x + (width * (1 / 2));
    var offsetY = pos.y + (height + radius / 2) * (1 / 2);
    var background = [];
    for (var i = 0; i < RESOLUTION; i++) {
        background.push([
            (Math.cos(i * background_increment + START_ANGLE) * radius) + offsetX,
            (Math.sin(i * background_increment + START_ANGLE) * radius) + offsetY,
        ]);
    }
    var points = [];
    for (var i = 0; i < RESOLUTION; i++) {
        points.push([
            (Math.cos(i * increment + START_ANGLE) * radius) + offsetX,
            (Math.sin(i * increment + START_ANGLE) * radius) + offsetY,
        ]);
    }
    viz().poly(background, __assign(__assign({}, config.backgroundStyle), { strokeWidth: radius / 2 }));
    viz().poly(points, __assign(__assign({}, config.foregroundStyle), { strokeWidth: radius / 2 }));
    viz().text(config.label, offsetX, offsetY, __assign(__assign({}, config.textStyle), { align: 'center' }));
});

var _a, _b;
(_a = Memory.timeseries1) !== null && _a !== void 0 ? _a : (Memory.timeseries1 = newTimeseries());
(_b = Memory.timeseries2) !== null && _b !== void 0 ? _b : (Memory.timeseries2 = newTimeseries());
function loop() {
    update(Memory.timeseries1, Math.random() * 10, 20);
    update(Memory.timeseries2, Math.random() * 10, 20);
    Dashboard({
        widgets: [
            {
                pos: {
                    x: 1,
                    y: 1
                },
                width: 10,
                height: 20,
                widget: Rectangle({
                    data: Grid({
                        data: [
                            Bar(function () { return ({
                                data: { value: 10, maxValue: 20 },
                                config: {
                                    label: 'Bar 1',
                                    style: {
                                        fill: 'rgba(255,0,0,0.3)',
                                        stroke: 'rgba(255,0,0,0.7'
                                    }
                                },
                            }); }),
                            Bar(function () { return ({
                                data: { value: 5, maxValue: 20, targetValue: 15 },
                                config: {
                                    label: 'Bar 2',
                                    style: {
                                        fill: 'rgba(0,255,0,0.3)',
                                        stroke: 'rgba(0,255,0,0.7'
                                    }
                                },
                            }); }),
                            Bar(function () { return ({
                                data: { value: 10 },
                                config: {
                                    label: 'Bar 3',
                                    style: {
                                        fill: 'rgba(255,255,0,0.3)',
                                        stroke: 'rgba(255,255,0,0.7'
                                    }
                                },
                            }); }),
                            Bar(function () { return ({
                                data: { value: 9, maxValue: 10 },
                                config: {
                                    label: 'Bar 4',
                                },
                            }); }),
                        ],
                        config: { columns: 2, rows: 2 },
                    })
                })
            },
            {
                pos: {
                    x: 11,
                    y: 1
                },
                width: 10,
                height: 10,
                widget: Rectangle({
                    data: Table(function () { return ({
                        data: [
                            ['value1', 'value2'],
                            ['value3', 'value4'],
                            ['value5', 'value6'],
                        ],
                        config: {
                            label: 'Table',
                            headers: ['header1', 'header2']
                        }
                    }); })
                })
            },
            {
                pos: {
                    x: 11,
                    y: 11
                },
                width: 20,
                height: 10,
                widget: Rectangle({
                    data: LineChart(function () { return ({
                        data: {
                            series1: Memory.timeseries1,
                            series2: Memory.timeseries2,
                        },
                        config: {
                            scale: {
                                y: {
                                    min: 0,
                                    max: 10
                                }
                            },
                            series: {
                                series1: {
                                    label: 'Series 1',
                                    color: 'lime',
                                },
                                series2: {
                                    label: 'Series 2',
                                    color: 'aqua'
                                },
                            }
                        }
                    }); })
                })
            },
            {
                pos: {
                    x: 25,
                    y: 3
                },
                width: 20,
                height: 5,
                widget: Rectangle({
                    data: Label({
                        data: 'screeps-viz',
                        config: { style: { font: 1.4 } }
                    })
                })
            },
            {
                pos: {
                    x: 1,
                    y: 21
                },
                width: 31,
                height: 8,
                widget: Rectangle({
                    data: Grid({
                        data: [
                            Dial({
                                data: { value: 0.25 },
                                config: {
                                    label: '25%',
                                    foregroundStyle: { stroke: 'cyan' }
                                }
                            }),
                            Dial({
                                data: { value: 0.50 },
                                config: {
                                    label: '50%',
                                    foregroundStyle: { stroke: 'green' }
                                }
                            }),
                            Dial({
                                data: { value: 0.75 },
                                config: {
                                    label: '75%',
                                    foregroundStyle: { stroke: 'red' }
                                }
                            }),
                        ],
                        config: { columns: 3, rows: 1 },
                    })
                })
            }
        ]
    });
}

exports.loop = loop;
//# sourceMappingURL=demo.js.map
