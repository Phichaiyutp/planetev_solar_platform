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
var pg_1 = require("@/db/pg");
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
function EncodeWeatherCondition(code) {
    var status;
    switch (code) {
        case 1:
            status = 'Clear';
            break;
        case 2:
            status = 'Partly cloudy';
            break;
        case 3:
            status = 'Cloudy';
            break;
        case 4:
            status = 'Overcast';
            break;
        case 5:
            status = 'Light rain';
            break;
        case 6:
            status = 'Moderate rain';
            break;
        case 7:
            status = 'Heavy rain';
            break;
        case 8:
            status = 'Thunderstorm';
            break;
        case 9:
            status = 'Very cold';
            break;
        case 10:
            status = 'Cold';
            break;
        case 11:
            status = 'Cool';
            break;
        case 12:
            status = 'Very hot';
            break;
        default:
            status = 'Unknown';
            break;
    }
    return status;
}
var weather = function (param) { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, url, response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                endpoint = param.url ? param.url : 'https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at';
                url = endpoint + "?lat=" + param.lat + "&lon=" + param.lon + "&duration=" + param.duration;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': "Bearer " + process.env.TMD_API_TOKEN,
                            'Content-Type': 'application/json'
                        },
                        next: { revalidate: 60 }
                    })];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                return [2 /*return*/, data];
            case 4:
                error_1 = _a.sent();
                console.error('Error:', error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var get_lat_long = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg_1["default"].connect()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 4, 5]);
                return [4 /*yield*/, client.query(" \n        SELECT latitude, longitude, station_code\n        FROM ms_stations;\n        ")];
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
var get_weather = function () { return __awaiter(void 0, void 0, void 0, function () {
    var lat_long, _i, lat_long_1, item, param, weather_data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, get_lat_long()];
            case 1:
                lat_long = _a.sent();
                if (!lat_long) return [3 /*break*/, 5];
                _i = 0, lat_long_1 = lat_long;
                _a.label = 2;
            case 2:
                if (!(_i < lat_long_1.length)) return [3 /*break*/, 5];
                item = lat_long_1[_i];
                param = {
                    lat: item.latitude,
                    lon: item.longitude,
                    duration: 1
                };
                return [4 /*yield*/, weather(param)];
            case 3:
                weather_data = _a.sent();
                if (weather_data.WeatherForecasts[0].forecasts[0].data) {
                    item.cond = EncodeWeatherCondition(Number(weather_data.WeatherForecasts[0].forecasts[0].data.cond));
                    item.cond_id = Number(weather_data.WeatherForecasts[0].forecasts[0].data.cond);
                    item.rh = weather_data.WeatherForecasts[0].forecasts[0].data.rh;
                    item.tc = weather_data.WeatherForecasts[0].forecasts[0].data.tc;
                }
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, lat_long || []];
            case 6:
                error_2 = _a.sent();
                console.error(error_2);
                return [2 /*return*/, []];
            case 7: return [2 /*return*/];
        }
    });
}); };
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
                return [4 /*yield*/, client.query("  \n        SELECT SUM(reduction_total_co2) AS co2, station_code\n        FROM public.stations_year\n        GROUP BY station_code;        \n        ")];
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
    var inverter, stations, stations_y, energy, inv_energy, tou, weather, mapArr2, mapArr3, mapArr4, mapArr5, mapArr6, mapArr7, combinedData;
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
                return [4 /*yield*/, get_energy()];
            case 4:
                energy = _a.sent();
                return [4 /*yield*/, get_inv_energy()];
            case 5:
                inv_energy = _a.sent();
                return [4 /*yield*/, get_tou()];
            case 6:
                tou = _a.sent();
                return [4 /*yield*/, get_weather()];
            case 7:
                weather = _a.sent();
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
                mapArr7 = weather.reduce(function (acc, entry) {
                    acc[entry.station_code] = entry;
                    return acc;
                }, {});
                combinedData = inverter.map(function (entry) { return (__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, entry), mapArr2[entry.station_code]), mapArr3[entry.station_code]), mapArr4[entry.station_code]), mapArr5[entry.station_code]), mapArr6[entry.station_code]), mapArr7[entry.station_code])); });
                combinedData.map(function (item, index) {
                    item.realtime_load = parseFloat((item.realtime_grid + item.realtime_pv).toFixed(3));
                });
                return [2 /*return*/, combinedData];
        }
    });
}); });
var SendMessage = function (lineToken, message) { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, fetch('https://notify-api.line.me/api/notify', {
                        method: 'POST',
                        headers: {
                            'Authorization': "Bearer " + lineToken,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({
                            message: message
                        }).toString()
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
            case 3: throw new Error('Failed to send message');
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('Error:', error_3);
                throw error_3;
            case 6: return [2 /*return*/];
        }
    });
}); };
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var station_data, result, users, responses, _i, users_1, user, username, lineToken, _a, station_data_1, station, message, response, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(req.method === 'POST')) return [3 /*break*/, 12];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, get_data()];
                case 2:
                    station_data = _b.sent();
                    return [4 /*yield*/, pg_1["default"].query('SELECT username, line_token FROM users')];
                case 3:
                    result = _b.sent();
                    users = result.rows;
                    if (!users.length)
                        throw new Error('No users found');
                    responses = [];
                    _i = 0, users_1 = users;
                    _b.label = 4;
                case 4:
                    if (!(_i < users_1.length)) return [3 /*break*/, 9];
                    user = users_1[_i];
                    username = user.username, lineToken = user.line_token;
                    _a = 0, station_data_1 = station_data;
                    _b.label = 5;
                case 5:
                    if (!(_a < station_data_1.length)) return [3 /*break*/, 8];
                    station = station_data_1[_a];
                    message = JSON.stringify({
                        station_status: station.station_status,
                        station_name: station.station_name,
                        realtime_pv: station.realtime_pv,
                        yield_today: station.yield_today
                    });
                    return [4 /*yield*/, SendMessage(lineToken, message)];
                case 6:
                    response = _b.sent();
                    responses.push({ username: username, response: response });
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    _i++;
                    return [3 /*break*/, 4];
                case 9:
                    res.status(200).json(responses);
                    return [3 /*break*/, 11];
                case 10:
                    error_4 = _b.sent();
                    console.error('Error:', error_4);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 13];
                case 12:
                    res.status(405).json({ error: 'Method Not Allowed' });
                    _b.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = handler;
