import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// import JWT_SECRET from "./config";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!JWT_SECRET) {
    console.log("JWT key absent");

    return res.status(500).json({
      msg: "Servor Error",
    });
  }
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        msg: "token absent",
      });
    }

    const token = authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, JWT_SECRET, (err, payload) => {
        "string";
        if (err) {
          console.log(err);
          return res.status(403).json({ msg: "error in jwt verification" });
        }
        if (!payload) {
          return res.status(403).json({ msg: "payload absent" });
        }
        if (typeof payload === "string") {
          return res.status(403).json({ msg: "payload is not a string" });
        }
        req.headers["userId"] = payload.userId;
        next();
      });
    } else {
      return res.status(403).json({ msg: "auth failed" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Servor Error",
    });
  }

  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET);
  //   if(!decode){
  //     return res.status(403).json({message: "Auth middleware failed 1"})
  //   }
  //   if(typeof decoded.userId === "string"){
  //     return res.status(403).json({message: "Auth middleware failed 2"})
  //   }
  //   if (decoded.userId) {
  //     req.headers["userId"] = decoded.userId;
  //     next();
  //   } else {
  //     return res.status(403).json({
  //       message: "Access Denied",
  //     });
  //   }
  // } catch (e) {
  //   console.log(e);
  //   return res.status(403).json({
  //     message: "Access Denied",
  //   });
  // }
};

export default authMiddleware;
