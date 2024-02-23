"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ExportReport = exports.StationInfo = exports.TotalEnergyChart = exports.StationStatus = void 0;
var react_1 = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var auto_1 = require("chart.js/auto");
var chart_js_1 = require("chart.js");
var get_api_data_1 = require("./api/get_api_data");
var card_list_1 = require("./ui/card_list");
var react_datetime_1 = require("react-datetime");
require("react-datetime/css/react-datetime.css");
var moment_1 = require("moment");
// Register CategoryScale only once
auto_1["default"].register(chart_js_1.CategoryScale);
var FetchData = function () {
    var _a = react_1.useState([]), stations = _a[0], setStations = _a[1];
    var callAPI = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, get_api_data_1.GetStationData()];
                case 1:
                    data = _a.sent();
                    setStations(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching station data:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        var MINUTE_MS = 60 * 5 * 1000;
        callAPI();
        var interval = setInterval(function () {
            callAPI();
        }, MINUTE_MS);
        return function () { return clearInterval(interval); };
    }, []);
    return stations;
};
exports.StationStatus = function () {
    var stations = FetchData();
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("p", { className: "font-bold text-xl text-success" }, "Plant"),
        stations.length === 0 ? (react_1["default"].createElement("div", { role: "status", className: "max-w-sm animate-pulse" },
            Array.from({ length: 6 }).map(function (_, index) { return (react_1["default"].createElement("div", { key: index, className: "h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-4" })); }),
            react_1["default"].createElement("span", { className: "sr-only" }, "Loading..."))) : (react_1["default"].createElement("div", null, stations.map(function (item, index) { return (react_1["default"].createElement("div", { key: index },
            react_1["default"].createElement("div", { className: "flex justify-between mt-2" },
                react_1["default"].createElement("p", { className: "w-11/12" }, item.station_name_short),
                react_1["default"].createElement("p", { className: "w-1/12 text-end " + (item.station_status === "Online"
                        ? "text-green-500"
                        : "text-red-500") }, item.station_status)))); })))));
};
exports.TotalEnergyChart = function () {
    var stations = FetchData();
    var labels = stations.map(function (item) { return item.station_name_short; });
    var data = stations.map(function (item) { return item.yield_today; });
    var unitData = "kWh";
    // Chart data and options
    var dataOfChart = {
        labels: labels,
        datasets: [
            {
                label: "Energy",
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1
            },
        ]
    };
    // Chart options
    var options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right"
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        if (context.parsed.y !== null) {
                            var label = (context.dataset.label || "") + " : " + context.formattedValue + " " + unitData;
                            return label;
                        }
                    }
                }
            }
        }
    };
    // Update legend position based on screen width
    if (typeof window !== "undefined") {
        var screenWidth = window.innerWidth;
        if (screenWidth <= 640) {
            options.plugins.legend.position = "top";
            options.plugins.legend.labels = {
                boxWidth: 2,
                font: {
                    size: 6
                }
            };
        }
    }
    // Render the component
    return (react_1["default"].createElement("div", { className: "w-10/12 h-40 sm:h-60 md:h-80 sm:w-8/12" },
        react_1["default"].createElement(react_chartjs_2_1.Pie, { height: "auto", width: "auto", data: dataOfChart, options: options })));
};
exports.StationInfo = function () {
    var stations = FetchData();
    return (react_1["default"].createElement("div", { className: "flex flex-wrap" }, stations.map(function (station, index) { return (react_1["default"].createElement("div", { key: index, className: "flex-auto" },
        react_1["default"].createElement(card_list_1["default"], { title: station.station_name_short || "", data: [
                {
                    valueName: "Energy",
                    value: Number(station.energy.toFixed(2)).toLocaleString(),
                    unit: "kWh"
                },
                {
                    valueName: "Revenue",
                    value: Number(station.revenue.toFixed(2)).toLocaleString(),
                    unit: "THB"
                },
                {
                    valueName: "Real-time PV",
                    value: Number(station.realtime_pv.toFixed(2)).toLocaleString(),
                    unit: "kW"
                },
                {
                    valueName: "Real-time Load",
                    value: Number(station.realtime_load.toFixed(2)).toLocaleString(),
                    unit: "kW"
                },
                {
                    valueName: "Yield Today",
                    value: Number(station.yield_today.toFixed(2)).toLocaleString(),
                    unit: "kWh"
                },
                {
                    valueName: "Total Yield",
                    value: Number((station.total_yield / 1000).toFixed(2)).toLocaleString(),
                    unit: "MWh"
                },
                {
                    valueName: "CO2 Avoided",
                    value: Number(station.co2.toFixed(2)).toLocaleString(),
                    unit: "tons"
                },
                {
                    valueName: "Weather",
                    unit: station.cond || "Clear",
                    icon_id: station.cond_id || 1
                },
            ] }))); })));
};
exports.ExportReport = function () {
    var stations = FetchData();
    var _a = react_1.useState(null), selectedYear = _a[0], setSelectedYear = _a[1];
    var _b = react_1.useState(null), selectedMonth = _b[0], setSelectedMonth = _b[1];
    var _c = react_1.useState(""), selectedStation = _c[0], setSelectedStation = _c[1];
    var handleDateChange = function (date) {
        if (moment_1["default"].isMoment(date) && date.isValid()) {
            setSelectedYear(date.year());
            setSelectedMonth(date.month() + 1); // Adding 1 because months are zero-indexed
        }
        else if (typeof date === "string") {
            var parsedDate = moment_1["default"](date, "YYYY-MM");
            if (parsedDate.isValid()) {
                setSelectedYear(parsedDate.year());
                setSelectedMonth(parsedDate.month() + 1);
            }
            else {
                setSelectedYear(null);
                setSelectedMonth(null);
            }
        }
        else {
            setSelectedYear(null);
            setSelectedMonth(null);
        }
    };
    var handleStationChange = function (event) {
        setSelectedStation(event.target.value);
    };
    var handleSubmit = function () {
        // Construct URL for download
        var hostReport = process.env.NEXT_PUBLIC_HOST_REPORT || "localhost";
        var url = hostReport + "/" + selectedStation + "?year=" + selectedYear + "&month=" + selectedMonth;
        console.log(url);
        // Trigger download
        window.open(url, "_blank");
    };
    return (react_1["default"].createElement("div", { className: "flex flex-col text-base" },
        react_1["default"].createElement("p", { className: "font-bold text-xl text-success" }, "Report/Billing"),
        react_1["default"].createElement("p", { className: "pt-4" }, "Year / Month"),
        react_1["default"].createElement(react_datetime_1["default"], { className: "border rounded-lg border-slate-300 leading-9 ml-4 my-4 pl-2 w-fit max-w-60", value: selectedYear && selectedMonth
                ? moment_1["default"]({ year: selectedYear, month: selectedMonth - 1 })
                : "", dateFormat: "YYYY-MM", timeFormat: false, onChange: function (value) {
                handleDateChange(value);
            }, closeOnSelect: true, inputProps: { placeholder: "Select Year and Month", readOnly: true } }),
        react_1["default"].createElement("p", null, "Plant"),
        react_1["default"].createElement("select", { className: "select select-bordered ml-4 mt-4 w-full max-w-60", value: selectedStation, onChange: handleStationChange },
            react_1["default"].createElement("option", { value: "", disabled: true }, "Please select a plant"),
            stations.map(function (station) { return (react_1["default"].createElement("option", { key: station.station_code, value: station.station_code }, station.station_name)); })),
        react_1["default"].createElement("button", { className: "btn btn-success btn-md ml-4 mt-4 w-full max-w-60 text-white text-lg font-bold", onClick: handleSubmit }, "Submit")));
};
