"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var axios_1 = require("axios");
var PlantStatus = function () {
    var _a = react_1.useState([]), plant = _a[0], setPlant = _a[1];
    react_1.useEffect(function () {
        axios_1["default"].get("http://localhost:3000/api/plant").then(function (res) {
            var data = res.data;
            if (data) {
                console.log(data);
                setPlant(data);
            }
            else {
                console.log(data);
            }
        });
    }, []);
    return (react_1["default"].createElement("div", null, plant.map(function (item, index) { return (react_1["default"].createElement("div", { key: index },
        react_1["default"].createElement("div", { className: "flex justify-between" },
            react_1["default"].createElement("p", { className: "" }, item.station_code),
            react_1["default"].createElement("p", { className: item.plant_status == 'Online' ? "text-green-500" : "text-red-500" }, item.plant_status)))); })));
};
exports["default"] = PlantStatus;
