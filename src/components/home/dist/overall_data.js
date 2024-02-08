"use client";
"use strict";
exports.__esModule = true;
exports.TotalCo2 = exports.ConsumpionToday = exports.YieldToday = exports.RealtimePV = exports.TotalOnPeak = exports.TotalOffPeak = exports.Monthly = exports.RevenueOverall = exports.EnergyOverall = void 0;
var react_1 = require("react");
var card_1 = require("./ui/card");
var card_double_1 = require("./ui/card_double");
var GetOverallData = function () {
    var _a = react_1.useState(), overall = _a[0], setOverall = _a[1];
    var callAPI = function () {
        fetch('/api/overall').then(function (res) { return res.json(); })
            .then(function (data) {
            if (data) {
                setOverall(data);
            }
            else {
                console.log(data);
            }
        });
    };
    react_1.useEffect(function () {
        var MINUTE_MS = 60 * 5 * 1000;
        callAPI();
        var interval = setInterval(function () {
            callAPI();
        }, MINUTE_MS);
        return function () { return clearInterval(interval); };
    }, []);
    return overall;
};
exports.EnergyOverall = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Energy Overall', value: (overall === null || overall === void 0 ? void 0 : overall.energy_overall) || 0, unit: "kWh", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-success" }));
};
exports.RevenueOverall = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Revenue Overall', value: (overall === null || overall === void 0 ? void 0 : overall.revenue_total) || 0, unit: "THB", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary" }));
};
exports.Monthly = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Monthly: Energy / Revenue', value: (overall === null || overall === void 0 ? void 0 : overall.energy_overall) || 0, unit: "kWh", text: "font-bold text-4xl xl:text-3xl text-success", second_value: (overall === null || overall === void 0 ? void 0 : overall.revenue_total) || 0, second_unit: "THB", second_text: "font-bold text-4xl xl:text-3xl text-primary" }));
};
exports.TotalOffPeak = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_double_1["default"], { title: 'Total Off Peak', value: (overall === null || overall === void 0 ? void 0 : overall.total_off_peak) || 0, unit: "kWh", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl  text-success", second_value: (overall === null || overall === void 0 ? void 0 : overall.revenue_off) || 0, second_unit: "THB", second_text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary" }));
};
exports.TotalOnPeak = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_double_1["default"], { title: 'Total On Peak', value: (overall === null || overall === void 0 ? void 0 : overall.total_on_peak) || 0, unit: "kWh", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-success", second_value: (overall === null || overall === void 0 ? void 0 : overall.revenue_on) || 0, second_unit: "THB", second_text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary" }));
};
exports.RealtimePV = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Real-time PV', value: (overall === null || overall === void 0 ? void 0 : overall.realtime_pv) || 0, unit: "kW", bg: "bg-primary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" }));
};
exports.YieldToday = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Yield Today', value: (overall === null || overall === void 0 ? void 0 : overall.yield_today) || 0, unit: "kWh", bg: "bg-primary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" }));
};
exports.ConsumpionToday = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Consumpion Today', value: (overall === null || overall === void 0 ? void 0 : overall.total_yield) || 0, unit: "kWh", bg: "bg-primary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" }));
};
exports.TotalCo2 = function () {
    var overall = GetOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Total CO2 Avoided', value: (overall === null || overall === void 0 ? void 0 : overall.co2) || 0, unit: "Tons", bg: "bg-secondary", text: "font-bold text-2xl xl:text-3xl 2xl:text-5xl" }));
};
