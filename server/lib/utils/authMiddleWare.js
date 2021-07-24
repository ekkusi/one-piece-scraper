"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../prismaClient"));
exports.default = async (req, res, next) => {
    console.log("Checking auth");
    const userEmail = req.session.userEmail;
    if (typeof userEmail !== "string") {
        console.log("Not authorized");
        res.status(401);
        res.json({ message: "Your token has expired" });
        return;
    }
    const user = await prismaClient_1.default.user.findUnique({
        where: { email: userEmail },
    });
    console.log(JSON.stringify(user));
    if (!user) {
        console.log("Not authorized");
        res.status(401);
        res.json({ message: "Invalid email" });
    }
    req.user = user || undefined;
    next();
};
