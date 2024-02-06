"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var image_1 = require("next/image");
var plant_data_1 = require("@/components/home/plant_data");
var inter = google_1.Inter({ subsets: ["latin"] });
exports.metadata = {
    title: "PlanetEV Solar Platform",
    description: "PlanetEV Solar Platform"
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { "data-theme": "mytheme", lang: "en" },
        React.createElement("body", { className: inter.className },
            React.createElement("main", null,
                React.createElement("div", { className: "drawer lg:drawer-open h-screen" },
                    React.createElement("input", { id: "my-drawer-2", type: "checkbox", className: "drawer-toggle" }),
                    children,
                    React.createElement("div", { className: "drawer-side h-full" },
                        React.createElement("label", { htmlFor: "my-drawer-2", "aria-label": "close sidebar", className: "drawer-overlay" }),
                        React.createElement("div", { className: "flex flex-col p-4 w-80 min-h-full bg-base-100 text-base-content border-r" },
                            React.createElement("div", { className: "flex items-start justify-center my-4" },
                                React.createElement(image_1["default"], { src: "/next.svg", width: 200, height: 200, alt: "Picture of the author" })),
                            React.createElement(plant_data_1["default"], null),
                            React.createElement("div", { className: "flex items-start justify-start my-4" },
                                React.createElement("p", null, "Report/Billing")))))))));
}
exports["default"] = RootLayout;
