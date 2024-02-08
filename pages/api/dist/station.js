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
var pg_1 = require("./pg");
function EncodeStationStatus(code) {
    var status;
    switch (code) {
        case 1:
            status = 'Offline';
            break;
        case 2:
            status = 'Faulty';
            break;
        case 3:
            status = 'Online';
            break;
        default:
            status = 'Unknown';
            break;
    }
    return status;
}
var get_inverter = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query(" \n        WITH RankedData AS (\n          SELECT\n              active_power AS realtime_pv,\n              station_code,\n              \"timestamp\",\n              ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY \"timestamp\" DESC) AS RowNum\n          FROM\n              inverter\n      )\n      SELECT\n          realtime_pv,\n          station_code,\n          \"timestamp\"\n      FROM\n          RankedData\n      WHERE\n          RowNum = 1;\n        ")];
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
var get_energy = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query(" \n        WITH RankedData AS (\n          SELECT\n              ABS(active_power/1000) AS realtime_grid,\n              station_code,\n              ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY \"timestamp\" DESC) AS RowNum\n          FROM\n              energy\n      )\n      SELECT\n          realtime_grid,\n          station_code\n      FROM\n          RankedData\n      WHERE\n          RowNum = 1;\n        ")];
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
var get_inv_energy = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query(" \n        WITH RankedData AS (\n          SELECT\n              ABS(active_power/1000) AS realtime_grid,\n              station_code,\n              ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY \"timestamp\" DESC) AS RowNum\n              FROM\n                  sensor_energy\n          )\n          SELECT\n              realtime_grid,\n              station_code\n          FROM\n              RankedData\n          WHERE\n              RowNum = 1;\n        ")];
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
var get_stations = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query("  \n          SELECT day_power as yield_today,total_power as total_yield ,real_health_state as station_status ,station_code,station_name,station_address  \n          FROM public.stations;\n        ")];
            case 3:
                result = _a.sent();
                result.rows.map(function (item, index) {
                    item.station_status = EncodeStationStatus(item.station_status);
                    item.station_name_short = item.station_name.includes('รหัส') ? item.station_name.replace(/ รหัส \d+/g, '') : item.station_name;
                });
                return [2 /*return*/, result.rows];
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
            case 0: return [4 /*yield*/, pg_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query("  \n        SELECT reduction_total_co2 as co2,station_code  \n        FROM public.stations_year sy;\n        ")];
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
var get_tou = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query("  \n        SELECT\n          station_code,\n          SUM(yield_total) AS energy,\n          SUM(revenue) AS revenue\n        FROM\n          tou t \n        GROUP BY\n          station_code;\n        ")];
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
var get_data = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var inverter, stations, _stations_y, energy, inv_energy, tou, stations_y, mapArr2, mapArr3, mapArr4, mapArr5, mapArr6, combinedData;
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
                _stations_y = _a.sent();
                return [4 /*yield*/, get_energy()];
            case 4:
                energy = _a.sent();
                return [4 /*yield*/, get_inv_energy()];
            case 5:
                inv_energy = _a.sent();
                return [4 /*yield*/, get_tou()];
            case 6:
                tou = _a.sent();
                stations_y = _stations_y.reduce(function (acc, entry) {
                    var existingEntry = acc.find(function (item) { return item.station_code === entry.station_code; });
                    if (existingEntry) {
                        existingEntry.co2 += entry.co2;
                    }
                    else {
                        acc.push({ "co2": entry.co2, "station_code": entry.station_code });
                    }
                    return acc;
                }, []);
                mapArr2 = stations.reduce(function (acc, entry) {
                    acc[entry.station_code] = entry;
                    return acc;
                }, {});
                mapArr3 = stations_y.reduce(function (acc, entry) {
                    acc[entry.station_code] = entry;
                    return acc;
                }, {});
                mapArr4 = energy.reduce(function (acc, entry) {
                    acc[entry.station_code] = entry;
                    return acc;
                }, {});
                mapArr5 = inv_energy.reduce(function (acc, entry) {
                    acc[entry.station_code] = entry;
                    return acc;
                }, {});
                mapArr6 = tou.reduce(function (acc, entry) {
                    acc[entry.station_code] = entry;
                    return acc;
                }, {});
                combinedData = inverter.map(function (entry) { return (__assign(__assign(__assign(__assign(__assign(__assign({}, entry), mapArr2[entry.station_code]), mapArr3[entry.station_code]), mapArr4[entry.station_code]), mapArr5[entry.station_code]), mapArr6[entry.station_code])); });
                combinedData.map(function (item, index) {
                    item.realtime_load = parseFloat((item.realtime_grid + item.realtime_pv).toFixed(3));
                });
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
