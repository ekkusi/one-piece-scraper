import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import formatUrl from "./formatUrl";
import { scrapeBaseUrl } from "../config.json";
import { User } from "@prisma/client";

export const formatBeginSubscriptionMail = (user: User) => {
  return {
    from: process.env.SEND_EMAIL_USER,
    to: user.email,
    subject: `1337xto botin haku muutettu onnistuneesti!`,
    html: `
      <p>terve!</p>
      <p>
        Olet aloittanut tilauksen hakusanoille <i>"${user.search_words.join(
          ", "
        )}"</i>.
      </p>
      <p>
        Botti tarkistellee nämä hakusanat kerran päivässä ja lähettellee sulle sähköpostia, kun 
        tuloksia alkaa löytyä:)
      </p>
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
