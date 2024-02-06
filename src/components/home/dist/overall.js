"use client";
"use strict";
exports.__esModule = true;
exports.TotalOffPeak = exports.Monthly = exports.RevenueOverall = exports.EnergyOverall = void 0;
var react_1 = require("react");
var axios_1 = require("axios");
var card_1 = require("./ui/card");
var card_double_1 = require("./ui/card_double");
var useOverallData = function () {
    var _a = react_1.useState(), overall = _a[0], setOverall = _a[1];
    react_1.useEffect(function () {
        axios_1["default"].get("http://localhost:3000/api/overall").then(function (res) {
            var data = res.data;
            if (data) {
                console.log(data);
                setOverall(data);
            }
            else {
                console.log(data);
            }
        });
    }, []);
    return overall;
};
exports.EnergyOverall = function () {
    var overall = useOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Energy Overall', value: (overall === null || overall === void 0 ? void 0 : overall.energy_overall) || 0, unit: "kWh", text: "font-bold text-5xl text-success" }));
};
exports.RevenueOverall = function () {
    var overall = useOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Revenue Overall', value: (overall === null || overall === void 0 ? void 0 : overall.revenue_total) || 0, unit: "THB", text: "font-bold text-5xl text-primary" }));
};
exports.Monthly = function () {
    var overall = useOverallData();
    return (react_1["default"].createElement(card_1["default"], { title: 'Monthly: Energy / Revenue', value: (overall === null || overall === void 0 ? void 0 : overall.energy_overall) || 0, unit: "kWh", text: "font-bold text-4xl text-success", second_value: (overall === null || overall === void 0 ? void 0 : overall.revenue_total) || 0, second_unit: "THB", second_text: "font-bold text-4xl text-primary" }));
};
exports.TotalOffPeak = function () {
    var overall = useOverallData();
    return (react_1["default"].createElement(card_double_1["default"], { title: 'Revenue Overall', value: (overall === null || overall === void 0 ? void 0 : overall.revenue_total) || 0, unit: "THB", text: "font-bold text-5xl text-primary" }));
};
