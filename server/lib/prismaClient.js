"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const isProd = process.env.NODE_ENV === "production";
// If in development, log prisma queries and errors
const prisma = new client_1.PrismaClient({
    log: isProd ? [] : ["query", "info", "warn", "error"],
});
exports.default = prisma;
