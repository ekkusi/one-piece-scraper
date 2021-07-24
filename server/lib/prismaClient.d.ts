import { PrismaClient } from "@prisma/client";
declare const prisma: PrismaClient<{
    log: ("info" | "query" | "warn" | "error")[];
}, never, false>;
export default prisma;
