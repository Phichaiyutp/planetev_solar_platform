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
var action_1 = require("@/app/dashboard/action");
var navigation_1 = require("next/navigation");
var line_callback_1 = require("@/components/notify/callback/line_callback");
var GetToken = function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var data, redirect_uri, params, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                redirect_uri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URL + "/solar/notify/callback";
                params = new URLSearchParams();
                params.append('grant_type', 'authorization_code');
                params.append('code', code);
                params.append('redirect_uri', redirect_uri);
                params.append('client_id', process.env.NEXT_PUBLIC_LINE_CLIENT_ID || '');
                params.append('client_secret', process.env.NEXT_PUBLIC_LINE_SECRET_ID || '');
                return [4 /*yield*/, fetch("https://notify-bot.line.me/oauth/token", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: params
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [3 /*break*/, 4];
            case 3: throw new Error('requset token not found');
            case 4: return [2 /*return*/, data === null || data === void 0 ? void 0 : data.access_token];
        }
    });
}); };
var Home = function (props) { return __awaiter(void 0, void 0, void 0, function () {
    var user, searchParams, code, token, body, url, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, action_1.GetUuserInfo()];
            case 1:
                user = _a.sent();
                if (!user.username) {
                    navigation_1.redirect('/login');
                }
                searchParams = props.searchParams;
                if (searchParams.hasOwnProperty('error')) {
                    console.error(searchParams.error);
                    navigation_1.redirect('/notify/login');
                }
                code = searchParams.code;
                if (!code) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                return [4 /*yield*/, GetToken(code)];
            case 3:
                token = _a.sent();
                body = JSON.stringify({
                    line_code: code,
                    line_token: token,
                    username: user.username
                });
                url = "http://" + process.env.NEXT_PUBLIC_HOST_NAME + ":" + process.env.NEXT_PUBLIC_HOST_PORT + process.env.NEXT_PUBLIC_BASE_PATH + "/api/line/linetoken";
                return [4 /*yield*/, fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: body
                    })];
            case 4:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error('requset token not found');
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, (React.createElement("div", { className: "flex items-center justify-center h-screen" },
                    React.createElement(line_callback_1["default"], { props: { "username": user.username } })))];
        }
    });
}); };
exports["default"] = Home;
