"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mails_1 = require("./utils/mails");
mails_1.checkAndSendMails().finally(() => {
    console.log("All mails sent succesfully");
    process.exit();
});
