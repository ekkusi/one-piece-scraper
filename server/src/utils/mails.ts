import nodemailer from "nodemailer";
import prismaClient from "../prismaClient";
import scrape from "./scrape";
import config from "../config.json";
import checkIfIsValidResult from "./checkIfIsValidResult";
import formatMail, { formatBeginSubscriptionMail } from "./formatMail";
import { User } from "@prisma/client";

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: false,
  auth: {
    user: process.env.SEND_EMAIL_USER,
    pass: process.env.SEND_EMAIL_PASSWORD,
  },
  tls: {
    minVersion: "TLSv1",
  },
});

export const checkAndSendMails = async () => {
  const users = await prismaClient.user.findMany();
  const promises = users.map((user) => {
    console.log("User: " + user.email + " subscriptions:");
    if (user.search_words.length === 0) console.log("No subscriptions");
    return checkAndSendMail(user);
  });
  await Promise.all(promises);
};

export const checkAndSendMail = async (user: User) => {
  const scrapePromises = user.search_words.map(async (searchString) => {
    const scrapeResult = await scrape(searchString);
    if (checkIfIsValidResult(searchString, scrapeResult)) {
      const result = await transporter.sendMail(
        formatMail(user.email, searchString)
      );
      console.log("Match with search: " + searchString + ", sending mail");
      return scrapeResult;
    }
    console.log("No match with search: " + searchString + ", not sending mail");
    return scrapeResult;
  });
  return Promise.all(scrapePromises);
};

export const sendStartSubscriptionMail = async (user: User) => {
  const result = await transporter.sendMail(formatBeginSubscriptionMail(user));
};
