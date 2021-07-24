"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const checkIfIsValidResult_1 = __importDefault(require("./utils/checkIfIsValidResult"));
const scrape_1 = __importDefault(require("./utils/scrape"));
const config_json_1 = __importDefault(require("./config.json"));
const path_1 = __importDefault(require("path"));
const formatMail_1 = __importDefault(require("./utils/formatMail"));
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
const sendMail = async () => {
    try {
        const result = await transporter.sendMail(formatMail_1.default("ekku.eki@gmail.com", "one piece 980"));
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
};
sendMail();
const run = async () => {
    const promises = [];
    for (let i = 970; i < 1000; i++) {
        const searchString = `one piece ${i}`;
        const promise = new Promise(async () => {
            const searchRows = await scrape_1.default(searchString);
            console.log("Search string", searchString);
            console.log("Result", searchRows.join(", "));
            const isValidResult = checkIfIsValidResult_1.default(searchString, searchRows);
            if (isValidResult) {
                console.log("Is valid result");
            }
            else {
                console.log("Not a valid result");
            }
        });
        promises.push(promise);
    }
    await Promise.all(promises);
};
// run();
