"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatUrl_1 = __importDefault(require("./formatUrl"));
const config_json_1 = require("../config.json");
exports.default = (to, searchString) => {
    const searchUrl = formatUrl_1.default(searchString);
    return {
        from: process.env.SEND_EMAIL_USER,
        to,
        subject: `Torrentti haulle "${searchString}" on saatavilla:)`,
        html: `
      <p>Terve terve terve!</p>
      <p>
        Päivän ilonen uutinen on, että pääset harrastamaan taas laittomuuksia ja lattailemaan
        kovasti halajamiasi torrentteja!
        <br />
        Hakusi <i>"${searchString}"</i> sivustolla ${config_json_1.scrapeBaseUrl} alkaa tuottamaan tulosta!
      </p>
      <p>Suora linkki hakuseen: <a href="${searchUrl}">${searchUrl}</a></p>
      <p>
        Mukavaisesti toivoen,
        <br />
        Digitaalisen maailmanvalloituksen tiimi,
        <br />
        Ekku's Tech
      </p>
    `,
    };
};
