"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Card = function (_a) {
    var title = _a.title, value = _a.value, unit = _a.unit, second_value = _a.second_value, second_unit = _a.second_unit, text = _a.text, second_text = _a.second_text;
    return (react_1["default"].createElement("div", { className: "card bg-base-100 shadow-xl h-full max-h-60" },
        react_1["default"].createElement("div", { className: "card-body flex flex-col justify-between h-full" },
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("h2", { className: "card-title" }, title),
                react_1["default"].createElement("p", { className: "mx-10 mb-2 " + text + " " + (second_value !== undefined ? 'mt-4' : 'my-12') + " " }, value),
                react_1["default"].createElement("div", { className: "card-actions justify-end" },
                    react_1["default"].createElement("h2", { className: "card-title" }, unit))),
            second_value !== undefined && (react_1["default"].createElement("div", null,
                react_1["default"].createElement("p", { className: "mx-10 " + second_text }, second_value),
                react_1["default"].createElement("div", { className: "card-actions justify-end" },
                    react_1["default"].createElement("h2", { className: "mb-2 card-title" }, second_unit)))))));
};
exports["default"] = Card;
