"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var overall_1 = require("@/components/home/overall");
function Home() {
    return (React.createElement("div", { className: "m-6  drawer-content grid grid-cols-1 lg:grid-cols-8 gap-4 max-h-1/2" },
        React.createElement("label", { htmlFor: "my-drawer-2", className: "btn btn-primary btn-xs drawer-button lg:hidden" }, "="),
        React.createElement("p", { className: "h-10 w-fit text-base-300 border border-dashed border-red-500 lg:col-span-6 lg:text-4xl" }, "SOLAR SUMMARY DASHBOARD"),
        React.createElement("div", { className: "h-10 w-52 flex border border-dashed border-red-500 text-lg lg:col-span-2 lg:text-xl " },
            React.createElement("p", { className: "my-2 text-base-300" }, "\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48 001"),
            React.createElement(image_1["default"], { src: "/next.svg", width: 70, height: 50, alt: "Picture of the author", className: "mx-2" })),
        React.createElement("div", { className: "w-auto lg:flex lg:col-span-8" },
            React.createElement("div", { className: "w-full mt-2 lg:w-1/3 lg:mr-2" },
                React.createElement(overall_1.EnergyOverall, null)),
            React.createElement("div", { className: "w-full mt-2 lg:w-1/3 lg:ml-2 lg:mr-2" },
                React.createElement(overall_1.RevenueOverall, null)),
            React.createElement("div", { className: "w-full mt-2 lg:w-1/3 lg:ml-2" },
                React.createElement(overall_1.Monthly, null))),
        React.createElement("div", { className: "w-auto lg:col-span-4" },
            React.createElement(overall_1.TotalOffPeak, null)),
        React.createElement("div", { className: "w-auto lg:col-span-4" },
            React.createElement(overall_1.TotalOffPeak, null)),
        React.createElement("div", { className: "w-auto lg:col-span-2" },
            React.createElement(overall_1.TotalOffPeak, null)),
        React.createElement("div", { className: "w-auto lg:col-span-2" },
            React.createElement(overall_1.TotalOffPeak, null)),
        React.createElement("div", { className: "w-auto lg:col-span-2" },
            React.createElement(overall_1.TotalOffPeak, null)),
        React.createElement("div", { className: "w-auto lg:col-span-2" },
            React.createElement(overall_1.TotalOffPeak, null))));
}
exports["default"] = Home;
