"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const formatUrl_1 = __importDefault(require("./formatUrl"));
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.default = async (searchParams) => {
    const url = formatUrl_1.default(searchParams);
    const response = await node_fetch_1.default(url.href);
    const html = await response.text();
    const $ = cheerio_1.default.load(html);
    const searchTable = $("table td.name a:last-child");
    const rows = [];
    searchTable.each((index, element) => {
        rows.push($(element).text());
    });
    return rows;
};
