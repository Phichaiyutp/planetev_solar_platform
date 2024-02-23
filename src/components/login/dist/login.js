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
var navigation_1 = require("next/navigation");
var image_1 = require("next/image");
var react_1 = require("react");
var action_1 = require("@/app/login/action");
var LoginForm = function () {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(''), user = _a[0], setUser = _a[1];
    var _b = react_1.useState(''), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(''), error = _c[0], setError = _c[1];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var loginResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!user || !password) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, action_1["default"](user, password)];
                case 2:
                    loginResult = _a.sent();
                    if (loginResult === null || loginResult === void 0 ? void 0 : loginResult.error) {
                        setError(loginResult.error);
                        setPassword('');
                    }
                    else if (loginResult === null || loginResult === void 0 ? void 0 : loginResult.success) {
                        router.push('/dashboard');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    setError('Login failed. Please check your credentials.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 p-6 sm:p-10 bg-white rounded-lg shadow-md lg:shadow-lg" },
        react_1["default"].createElement("div", { className: "flex items-start justify-center my-4" },
            react_1["default"].createElement(image_1["default"], { src: process.env.NEXT_PUBLIC_BASE_PATH + "/logo.png", width: 384 / 2, height: 216 / 2, alt: "Picture of the author" })),
        error && react_1["default"].createElement("p", { className: "text-red-500 mt-2" }, error),
        react_1["default"].createElement("form", { className: "mt-6", onSubmit: handleSubmit },
            react_1["default"].createElement("label", { htmlFor: "text", className: "block text-xs font-semibold text-gray-600 uppercase" }, "User"),
            react_1["default"].createElement("input", { id: "text", type: "text", name: "text", value: user, onChange: function (e) { return setUser(e.target.value); }, placeholder: "user name", autoComplete: "text", className: "block w-full py-3 px-1 mt-2 text-gray-800 border-b-2 border-gray-100 focus:border-gray-500 focus:outline-none", required: true }),
            react_1["default"].createElement("label", { htmlFor: "password", className: "block mt-4 text-xs font-semibold text-gray-600 uppercase" }, "Password"),
            react_1["default"].createElement("input", { id: "password", type: "password", name: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, placeholder: "password", autoComplete: "current-password", className: "block w-full py-3 px-1 mt-2 mb-4 text-gray-800 border-b-2 border-gray-100 focus:border-gray-500 focus:outline-none", required: true }),
            react_1["default"].createElement("button", { type: "submit", className: "w-full py-3 mt-6 bg-gray-800 rounded-sm font-medium text-white uppercase focus:outline-none hover:bg-gray-700" }, "Login"))));
};
exports["default"] = LoginForm;
