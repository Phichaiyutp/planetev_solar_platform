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
exports.TotalCo2 = exports.ConsumpionToday = exports.YieldToday = exports.RealtimePV = exports.TotalOnPeak = exports.TotalOffPeak = exports.Monthly = exports.RevenueOverall = exports.EnergyOverall = void 0;
var react_1 = require("react");
var card_1 = require("./ui/card");
var card_double_1 = require("./ui/card_double");
var get_api_data_1 = require("./api/get_api_data");
var FetchData = function (_a) {
    var children = _a.children;
    var _b = react_1.useState(), overall = _b[0], setOverall = _b[1];
    var _c = react_1.useState(true), loading = _c[0], setLoading = _c[1];
    var callAPI = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, get_api_data_1.GetOverallData()];
                case 1:
                    data = _a.sent();
                    setOverall(data);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching station data:", error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
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
    return (loading ?
        react_1["default"].createElement("div", null,
            react_1["default"].createElement(card_1["default"], { title: "Loading...", value: '0.0', unit: "", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-success" })) : children(overall));
};
exports.EnergyOverall = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_1["default"], { title: "Energy Overall", value: Number(overall === null || overall === void 0 ? void 0 : overall.energy_overall.toFixed(2)).toLocaleString() || '0', unit: "kWh", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-success" })); }));
};
exports.RevenueOverall = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_1["default"], { title: 'Revenue Overall', value: Number(overall === null || overall === void 0 ? void 0 : overall.revenue_total.toFixed(2)).toLocaleString() || '0', unit: "THB", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary" })); }));
};
exports.Monthly = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_1["default"], { title: 'Monthly: Energy / Revenue', value: Number(overall === null || overall === void 0 ? void 0 : overall.energy_overall.toFixed(2)).toLocaleString() || '0', unit: "kWh", text: "font-bold text-2xl xl:text-3xl 2xl:text-4xl text-success", second_value: Number(overall === null || overall === void 0 ? void 0 : overall.revenue_total.toFixed(2)).toLocaleString() || '0', second_unit: "THB", second_text: "font-bold text-2xl xl:text-3xl 2xl:text-4xl text-primary" })); }));
};
exports.TotalOffPeak = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_double_1["default"], { title: 'Total Off Peak', value: Number(overall === null || overall === void 0 ? void 0 : overall.total_off_peak.toFixed(2)).toLocaleString() || '0', unit: "kWh", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl  text-success", second_value: Number(overall === null || overall === void 0 ? void 0 : overall.revenue_off.toFixed(2)).toLocaleString() || '0', second_unit: "THB", second_text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary" })); }));
};
exports.TotalOnPeak = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_double_1["default"], { title: 'Total On Peak', value: Number(overall === null || overall === void 0 ? void 0 : overall.total_on_peak.toFixed(2)).toLocaleString() || '0', unit: "kWh", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-success", second_value: Number(overall === null || overall === void 0 ? void 0 : overall.revenue_on.toFixed(2)).toLocaleString() || '0', second_unit: "THB", second_text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary" })); }));
};
exports.RealtimePV = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_1["default"], { title: 'Real-time PV', value: Number(overall === null || overall === void 0 ? void 0 : overall.realtime_pv.toFixed(2)).toLocaleString() || '0', unit: "kW", bg: "bg-primary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" })); }));
};
exports.YieldToday = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_1["default"], { title: 'Yield Today', value: Number(overall === null || overall === void 0 ? void 0 : overall.yield_today.toFixed(2)).toLocaleString() || '0', unit: "kWh", bg: "bg-primary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" })); }));
};
exports.ConsumpionToday = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_1["default"], { title: 'Consumpion Today', value: Number(overall === null || overall === void 0 ? void 0 : overall.total_yield.toFixed(2)).toLocaleString() || '0', unit: "kWh", bg: "bg-primary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" })); }));
};
exports.TotalCo2 = function () {
    return (react_1["default"].createElement(FetchData, null, function (overall) { return (react_1["default"].createElement(card_1["default"], { title: 'Total CO2 Avoided', value: Number(overall === null || overall === void 0 ? void 0 : overall.co2.toFixed(2)).toLocaleString() || '0', unit: "Tons", bg: "bg-secondary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" })); }));
};
