import nodemailer from "nodemailer";
import dotenv from "dotenv";
import checkIfIsValidResult from "./utils/checkIfIsValidResult";
import scrape from "./utils/scrape";
import config from "./config.json";
import path from "path";
import formatMail from "./utils/formatMail";

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

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

const sendMail = async () => {
  try {
    const result = await transporter.sendMail(
      formatMail("ekku.eki@gmail.com", "one piece 980")
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

sendMail();

const run = async () => {
  const promises = [];
  for (let i = 970; i < 1000; i++) {
    const searchString = `one piece ${i}`;
    const promise = new Promise(async () => {
      const searchRows = await scrape(searchString);

      console.log("Search string", searchString);
      console.log("Result", searchRows.join(", "));
      const isValidResult = checkIfIsValidResult(searchString, searchRows);
      if (isValidResult) {
        console.log("Is valid result");
      } else {
        console.log("Not a valid result");
      }
    });
    promises.push(promise);
  }

  await Promise.all(promises);
};

// run();
