import bodyParser from "body-parser";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import session from "cookie-session";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import authMiddleWare from "./utils/authMiddleWare";
import prismaClient from "./prismaClient";
import { checkAndSendMail, sendStartSubscriptionMail } from "./utils/mails";

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const client = new OAuth2Client(process.env.CLIENT_ID);

const port = process.env.PORT || 4000;
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
  if (!token) {
    res.status(401);
    res.json({ message: "Invalid Google auth token" });
    return;
  }
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
  //@ts-ignore
  req.session = null;
  res.status(200);
  res.json({
    message: "Logged out successfully",
  });
});

if (process.env.NODE_ENV === "production") {
  // Compute the build path and index.html path
  const buildPath = path.resolve(__dirname, "../../site/build");
  const indexHtml = path.join(buildPath, "index.html");

  // Setup build path as a static assets path
  app.use(express.static(buildPath));
  // Serve index.html on unmatched routes
  app.get("*", (req, res) => res.sendFile(indexHtml));
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
