"use client";
"use strict";
exports.__esModule = true;
exports.TotalEnergyChart = exports.StationStatus = void 0;
var react_1 = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var auto_1 = require("chart.js/auto");
var chart_js_1 = require("chart.js");
var GetStationData = function () {
    var _a = react_1.useState([]), station = _a[0], setStation = _a[1];
    var callAPI = function () {
        fetch('/api/station')
            .then(function (res) { return res.json(); })
            .then(function (data) {
            if (data) {
                setStation(data);
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
    return station;
};
exports.StationStatus = function () {
    var station = GetStationData();
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("p", { className: "font-bold text-xl text-success " }, "Plant"),
        station.map(function (item, index) { return (react_1["default"].createElement("div", { key: index },
            react_1["default"].createElement("div", { className: "flex justify-between mt-2" },
                react_1["default"].createElement("p", { className: "w-11/12" }, item.station_name_short),
                react_1["default"].createElement("p", { className: "w-1/12 text-end " + (item.station_status == 'Online' ? "text-green-500" : "text-red-500") }, item.station_status)))); })));
};
exports.TotalEnergyChart = function () {
    var station = GetStationData();
    auto_1["default"].register(chart_js_1.CategoryScale);
    var labels = station.map(function (item) { return item.station_name_short; });
    var data = station.map(function (item) { return item.yield_today; });
    var unitData = 'kWh';
    var dataofchart = {
        labels: labels,
        datasets: [
            {
                label: 'Energy',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            },
        ]
    };
    var options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        if (context.parsed.y !== null) {
                            var label = (context.dataset.label || '') + " : " + context.formattedValue + " " + unitData;
                            return label;
                        }
                    }
                }
            }
        }
    };
    return (react_1["default"].createElement("div", { className: "w-full" },
        react_1["default"].createElement(react_chartjs_2_1.Pie, { height: "400px", width: "1000px", data: dataofchart, options: options })));
};
