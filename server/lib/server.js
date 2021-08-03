"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_auth_library_1 = require("google-auth-library");
const cookie_session_1 = __importDefault(require("cookie-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleWare_1 = __importDefault(require("./utils/authMiddleWare"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const mails_1 = require("./utils/mails");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", "..", ".env") });
const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID);
const port = process.env.PORT || 4000;
const app = express_1.default();
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
app.use(cookie_session_1.default(sess));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.get("/api/terve", authMiddleWare_1.default, (req, res) => {
    res.status(200);
    res.json({
        message: "TERVEEE",
    });
});
app.get("/api/me", authMiddleWare_1.default, async (req, res) => {
    res.status(200);
    res.json(req.user);
});
app.post("/api/update-subscription", authMiddleWare_1.default, async (req, res) => {
    const userEmail = req.session.userEmail;
    const { searchString } = req.body;
    if (searchString === undefined) {
        res.status(400);
        res.json({ message: "You need to pass searchString parameter in body " });
    }
    const searchWordsArray = searchString.split(", ");
    const checkedArray = searchWordsArray[0] === "" ? [] : searchWordsArray;
    const updatedUser = await prismaClient_1.default.user.update({
        where: { email: userEmail },
        data: {
            search_words: checkedArray,
        },
    });
    if (updatedUser.search_words.length > 0) {
        await mails_1.sendStartSubscriptionMail(updatedUser);
        await mails_1.checkAndSendMail(updatedUser);
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
        const user = await prismaClient_1.default.user.upsert({
            where: { email },
            update: { email },
            create: { email },
        });
        req.session.userEmail = user.email;
        res.status(200);
        res.json(user);
    }
    else {
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
    const buildPath = path_1.default.resolve(__dirname, "../../site/build");
    const indexHtml = path_1.default.join(buildPath, "index.html");
    // Setup build path as a static assets path
    app.use(express_1.default.static(buildPath));
    // Serve index.html on unmatched routes
    app.get("*", (req, res) => res.sendFile(indexHtml));
}
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
