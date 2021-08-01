import { Request, Response, NextFunction } from "express";
import prismaClient from "../prismaClient";

export default async (req: Request, res: Response, next: NextFunction) => {
  const userEmail = req.session.userEmail;
  if (typeof userEmail !== "string") {
    console.log("Not authorized");
    res.status(401);
    res.json({ message: "Your token has expired" });
    return;
  }
  const user = await prismaClient.user.findUnique({
    where: { email: userEmail },
  });
  if (!user) {
    console.log("Not authorized");
    res.status(401);
    res.json({ message: "Invalid email" });
  }
  req.user = user || undefined;
  next();
};
