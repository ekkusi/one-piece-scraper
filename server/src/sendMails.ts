import { checkAndSendMails } from "./utils/mails";

checkAndSendMails().finally(() => {
  console.log("All mails sent succesfully");
  process.exit();
});
