"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var db_1 = require("../../db");
var mock_dashboardData = {
    energyOverall: 0,
    revenueOverall: 0,
    energyMonthly: 0,
    revenueMonthly: 0,
    energyTotalOffPeak: 0,
    revenueTotalOffPeak: 0,
    energyTotalOnPeak: 0,
    revenueTotalOnPeak: 0,
    realtimePV: 0,
    yieldToday: 0,
    consumtionToday: 0,
    totalCO2: 0
};
var get_inverter = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query(" \n        WITH RankedData AS (\n          SELECT\n            active_power,\n            station_code,\n            \"timestamp\",\n            ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY \"timestamp\" DESC) AS RowNum\n          FROM\n            inverter\n        )\n        SELECT\n          SUM(active_power) AS realtime_pv\n        FROM\n          RankedData\n        WHERE\n          RowNum = 1\n        GROUP BY\n          \"timestamp\";\n        ")];
            case 3:
                result = _a.sent();
                result.rows.forEach(function (row) {
                    row['realtime_pv'] = parseFloat(row['realtime_pv'].toFixed(3));
                });
                return [2 /*return*/, result.rows[0]];
            case 4:
                client.release();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
var get_stations = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query("  \n          SELECT SUM(day_power) as yield_today,SUM(total_power)/1000 as total_yield  \n          FROM public.stations;\n        ")];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result.rows[0]];
            case 4:
                client.release();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
var get_stations_year = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query("  \n        SELECT SUM(reduction_total_co2) as co2  \n        FROM public.stations_year sy;\n        ")];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result.rows[0]];
            case 4:
                client.release();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
var get_tou = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query("  \n        SELECT\n          SUM(yield_on_peak)AS total_on_peak,\n          SUM(yield_off_peak) AS total_off_peak,\n          SUM(yield_total) AS energy_overall\n        FROM\n          tou t \n        ")];
            case 3:
                result = _a.sent();
                result.rows[0].total_on_peak = parseFloat(result.rows[0].total_on_peak.toFixed(2));
                result.rows[0].total_off_peak = parseFloat(result.rows[0].total_off_peak.toFixed(2));
                result.rows[0].energy_overall = parseFloat(result.rows[0].energy_overall.toFixed(2));
                return [2 /*return*/, result.rows[0]];
            case 4:
                client.release();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
var get_config = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query("  \n        SELECT value_name, value, data_type, \"expression\", group_name\n        FROM config;\n        ")];
            case 3:
                result = _a.sent();
                return [2 /*return*/, result.rows];
            case 4:
                client.release();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
var get_billing = function (yield_on_peak, yield_off_peak, config) {
    function execution(config, valueName) {
        var findConfig = config.find(function (item) { return item.value_name === valueName; });
        if (findConfig && findConfig.expression !== null) {
            var result = parseFloat((eval(findConfig.expression)).toFixed(2));
            return result;
        }
        else {
            var result = parseFloat(findConfig.value);
            return result;
        }
    }
    var e_rate_on = execution(config, 'e_rate_on');
    var e_rate_off = execution(config, 'e_rate_off');
    var dsc = execution(config, 'dsc');
    var ead_on = execution(config, 'ead_on');
    var ead_off = execution(config, 'ead_off');
    var revenue_on = execution(config, 'revenue_on');
    var revenue_off = execution(config, 'revenue_off');
    var revenue_total = execution(config, 'revenue_total');
    return { revenue_total: revenue_total, revenue_on: revenue_on, revenue_off: revenue_off };
};
var get_data = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var inverter, stations, stations_y, tou, config, billing, combinedData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, get_inverter()];
            case 1:
                inverter = _a.sent();
                return [4 /*yield*/, get_stations()];
            case 2:
                stations = _a.sent();
                return [4 /*yield*/, get_stations_year()];
            case 3:
                stations_y = _a.sent();
                return [4 /*yield*/, get_tou()];
            case 4:
                tou = _a.sent();
                return [4 /*yield*/, get_config()];
            case 5:
                config = _a.sent();
                billing = get_billing(tou.total_on_peak, tou.total_off_peak, config);
                combinedData = __assign(__assign(__assign(__assign(__assign({}, inverter), stations), stations_y), tou), billing);
                return [2 /*return*/, combinedData];
        }
    });
}); });
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.method === 'GET')) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, get_data()];
                case 2:
                    payload = _a.sent();
                    ;
                    //console.log(payload);
                    res.status(200).json(payload);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error processing data:', error_1);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    res.status(405).json({ error: 'Method Not Allowed' });
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = handler;
