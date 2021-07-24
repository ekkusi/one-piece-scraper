"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config.json"));
exports.default = (searchParams) => {
    return new URL(`${config_json_1.default.scrapeBaseUrl}/search/${searchParams}/1/`);
};
