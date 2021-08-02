import { User } from "@prisma/client";
export declare const formatBeginSubscriptionMail: (user: User) => {
    from: string | undefined;
    to: string;
    subject: string;
    html: string;
};
declare const _default: (to: string, searchString: string) => {
    from: string | undefined;
    to: string;
    subject: string;
    html: string;
};
export default _default;
