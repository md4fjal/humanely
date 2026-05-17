import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    let token: string | undefined;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      console.log("AUTH MIDDLEWARE: No token found. Returning 401.");
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as TokenPayload;

    req.user = decoded;

    next();
  } catch (err) {
      console.log("AUTH MIDDLEWARE: Token parsing or validation failed, returning 401:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
