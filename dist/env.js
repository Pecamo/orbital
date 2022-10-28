"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LAMP_MODE_ENABLED = exports.SPECTATE_MODE_ENABLED = exports.TOP_LED_NB = exports.SSL_CERT_PATH = exports.SSL_ORBITAL_PORT = exports.ORBITAL_PORT = exports.GAME_FPS = exports.WAITING_TIME_SEC = exports.DISPLAY_API_PORT = exports.DISPLAY_API_HOSTNAME = exports.LAMP_FPS = void 0;
var dotenv = __importStar(require("dotenv"));
dotenv.config({ path: "../.env" });
exports.LAMP_FPS = parseInt(process.env.LAMP_FPS);
exports.DISPLAY_API_HOSTNAME = process.env.DISPLAY_API_HOSTNAME;
exports.DISPLAY_API_PORT = parseInt(process.env.DISPLAY_API_PORT);
exports.WAITING_TIME_SEC = parseInt(process.env.WAITING_TIME_SEC);
exports.GAME_FPS = parseInt(process.env.GAME_FPS);
exports.ORBITAL_PORT = parseInt(process.env.ORBITAL_PORT);
exports.SSL_ORBITAL_PORT = parseInt(process.env.SSL_ORBITAL_PORT);
exports.SSL_CERT_PATH = process.env.SSL_CERT_PATH;
exports.TOP_LED_NB = parseInt(process.env.TOP_LED_NB);
exports.SPECTATE_MODE_ENABLED = process.env.SPECTATE_MODE_ENABLED.toLowerCase() === 'true';
exports.LAMP_MODE_ENABLED = process.env.LAMP_MODE_ENABLED.toLowerCase() === 'true';
