import bodyParser from "body-parser";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import session from "express-session";
import cookieParser from "cookie-parser";
import authMiddleWare from "./utils/authMiddleWare";
import prismaClient from "./prismaClient";
import { checkAndSendMail, sendStartSubscriptionMail } from "./utils/sendMails";

const client = new OAuth2Client(process.env.CLIENT_ID);

const port = 4000;
const app = express();

const sess = {
  secret: "keyboard cat",
  cookie: {
    secure: false,
  },
  resave: true,
  saveUninitialized: true,
};

if (app.get("env") === "production") {
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

app.use(cookieParser());

app.use(express.json());

app.get("/api/terve", authMiddleWare, (req, res) => {
  res.status(200);
  res.json({
    message: "TERVEEE",
  });
});

app.get("/api/me", authMiddleWare, async (req, res) => {
  res.status(200);
  res.json(req.user);
});

app.post("/api/update-subscription", authMiddleWare, async (req, res) => {
  const userEmail = req.session.userEmail;
  const { searchString } = req.body;
  if (searchString === undefined) {
    res.status(400);
    res.json({ message: "You need to pass searchString parameter in body " });
  }
  const searchWordsArray = searchString.split(", ");
  const checkedArray = searchWordsArray[0] === "" ? [] : searchWordsArray;
  const updatedUser = await prismaClient.user.update({
    where: { email: userEmail },
    data: {
      search_words: checkedArray,
    },
  });
  if (updatedUser.search_words.length > 0) {
    await sendStartSubscriptionMail(updatedUser);
    await checkAndSendMail(updatedUser);
  }
  res.status(200);
  res.json({
    user: updatedUser,
  });
});

app.post("/api/login", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (payload && payload.email) {
    const { email } = payload;
    const user = await prismaClient.user.upsert({
      where: { email },
      update: { email },
      create: { email },
    });
    req.session.userEmail = user.email;
    res.status(200);
    res.json(user);
  } else {
    res.status(500);
    res.send();
  }
});

app.post("/api/logout", async (req, res) => {
  await req.session.destroy(() => {
    console.log("Logged out");
  });
  res.status(200);
  res.json({
    message: "Logged out successfully",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
