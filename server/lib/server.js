"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_auth_library_1 = require("google-auth-library");
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleWare_1 = __importDefault(require("./utils/authMiddleWare"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID);
const port = 4000;
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
app.use(express_session_1.default(sess));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.get("/api/terve", authMiddleWare_1.default, (req, res) => {
    res.status(200);
    res.json({
        message: "TERVEEE",
    });
});
app.post("/api/login", async (req, res) => {
    console.log(JSON.stringify(req.body));
    const { token } = req.body;
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
        res.status(201);
        res.json(user);
    }
    else {
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
