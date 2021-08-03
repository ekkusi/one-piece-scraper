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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendStartSubscriptionMail = exports.checkAndSendMail = exports.checkAndSendMails = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const scrape_1 = __importDefault(require("./scrape"));
const config_json_1 = __importDefault(require("../config.json"));
const checkIfIsValidResult_1 = __importDefault(require("./checkIfIsValidResult"));
const formatMail_1 = __importStar(require("./formatMail"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", "..", ".env") });
const transporter = nodemailer_1.default.createTransport({
    host: config_json_1.default.emailHost,
    port: config_json_1.default.emailPort,
    secure: false,
    auth: {
        user: process.env.SEND_EMAIL_USER,
        pass: process.env.SEND_EMAIL_PASSWORD,
    },
    tls: {
        minVersion: "TLSv1",
    },
});
const checkAndSendMails = async () => {
    const users = await prismaClient_1.default.user.findMany();
    const promises = users.map((user) => {
        console.log("User: " + user.email + " subscriptions:");
        if (user.search_words.length === 0)
            console.log("No subscriptions");
        return exports.checkAndSendMail(user);
    });
    await Promise.all(promises);
};
exports.checkAndSendMails = checkAndSendMails;
const checkAndSendMail = async (user) => {
    const scrapePromises = user.search_words.map(async (searchString) => {
        const scrapeResult = await scrape_1.default(searchString);
        if (checkIfIsValidResult_1.default(searchString, scrapeResult)) {
            const result = await transporter.sendMail(formatMail_1.default(user.email, searchString));
            console.log("Match with search: " + searchString + ", sending mail");
            return scrapeResult;
        }
        console.log("No match with search: " + searchString + ", not sending mail");
        return scrapeResult;
    });
    return Promise.all(scrapePromises);
};
exports.checkAndSendMail = checkAndSendMail;
const sendStartSubscriptionMail = async (user) => {
    const result = await transporter.sendMail(formatMail_1.formatBeginSubscriptionMail(user));
};
exports.sendStartSubscriptionMail = sendStartSubscriptionMail;
