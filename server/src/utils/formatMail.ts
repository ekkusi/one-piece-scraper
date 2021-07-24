import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import formatUrl from "./formatUrl";
import { scrapeBaseUrl } from "../config.json";

export default (to: string, searchString: string) => {
  const searchUrl = formatUrl(searchString);
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
        Hakusi <i>"${searchString}"</i> sivustolla ${scrapeBaseUrl} alkaa tuottamaan tulosta!
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
