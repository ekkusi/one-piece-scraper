import { User } from "@prisma/client";
export declare const checkAndSendMails: () => Promise<void>;
export declare const checkAndSendMail: (user: User) => Promise<string[][]>;
export declare const sendStartSubscriptionMail: (user: User) => Promise<void>;
