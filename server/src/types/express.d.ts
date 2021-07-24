import { User } from "@prisma/client";
declare global {
  export namespace Express {
    interface Request {
      user?: User;
    }
  }
}
