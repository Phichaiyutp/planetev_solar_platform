"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var google_1 = require("next/font/google");
require("../globals.css");
var station_1 = require("@/components/dashboard/station");
var logout_1 = require("@/components/logout/logout");
var inter = google_1.Inter({ subsets: ["latin"] });
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { "data-theme": "mytheme", lang: "en" },
        React.createElement("body", { className: inter.className },
            React.createElement("div", { className: "fixed top-0 left-0 w-full bg-success h-4 z-50" }),
            React.createElement("div", { className: "drawer lg:drawer-open" },
                React.createElement("input", { id: "my-drawer-2", type: "checkbox", className: "drawer-toggle" }),
                React.createElement("div", { className: "drawer-content mt-4 mx-auto w-11/12" }, children),
                React.createElement("div", { className: "drawer-side" },
                    React.createElement("label", { htmlFor: "my-drawer-2", "aria-label": "close sidebar", className: "drawer-overlay" }),
                    React.createElement("div", { className: "menu px-4 h-[100vh] w-11/12 sm:w-8/12 lg:w-5/6 xl:w-11/12  bg-base-100 text-base-content border-r-[2px] border-success overflow-auto" },
                        React.createElement("div", { className: "flex flex-col w-11/12 sm:w-full" },
                            React.createElement("div", { className: "flex items-start justify-center my-4" },
                                React.createElement(image_1["default"], { src: process.env.NEXT_PUBLIC_BASE_PATH + "/logo.png", width: 227, height: 128, alt: "Picture of the author" })),
                            React.createElement("div", { className: "bg-success h-[2px] w-[90%] mx-auto" }),
                            React.createElement("div", { className: "mx-4 p-4" },
                                React.createElement(station_1.StationStatus, null)),
                            React.createElement("div", { className: "bg-success h-[2px] w-[90%] mx-auto" }),
                            React.createElement("div", { className: "mx-4 p-4" },
                                React.createElement(station_1.ExportReport, null)),
                            React.createElement("div", { className: "bg-success h-[2px] w-[90%] mx-auto" }),
                            React.createElement("div", { className: "mx-4 pl-8" },
                                React.createElement(logout_1["default"], null)))))))));
}
exports["default"] = RootLayout;
