"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayAPI = void 0;
var dgram_as_promised_1 = __importDefault(require("dgram-as-promised"));
var DisplayAPI = /** @class */ (function () {
    function DisplayAPI(size, rootHost, rootPort) {
        this.size = size;
        this.rootHost = rootHost;
        this.rootPort = rootPort;
        this.lastFrameRendered = true;
        this.socket = dgram_as_promised_1.default.createSocket('udp4');
    }
    DisplayAPI.prototype.set = function (colors) {
        var _this = this;
        if (this.lastFrameRendered) {
            this.lastFrameRendered = false;
            this.sendColors(colors)
                .then(function (response) {
                _this.lastFrameRendered = true;
            })
                .catch(function (error) {
                console.error(error);
            });
        }
    };
    DisplayAPI.prototype.sendColors = function (colors) {
        var sendData = { colors: colors };
        var header = 0x04; // 0x03 for RGB, 0x04 for RGBW
        var message = [header];
        sendData.colors.forEach(function (color) {
            message.push(color.w);
            message.push(color.r);
            message.push(color.g);
            message.push(color.b);
        });
        var messageBuffer = Buffer.from(message);
        return this.socket.send(messageBuffer, 0, messageBuffer.length, this.rootPort, this.rootHost);
    };
    return DisplayAPI;
}());
exports.DisplayAPI = DisplayAPI;
