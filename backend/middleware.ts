import jwt, { decode } from "jsonwebtoken";

import JWT_SECRET from "./config"
import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token){
    jwt.verify(token, JWT_SECRET, (err, payload)=>{
      "string"
      if(err) {
        return res.status(403).json({message:"auth failed"})
      }
      if(!payload){
        return res.status(403).json({message:"auth failed"})
      }
      if(typeof payload === "string"){
        return res.status(403).json({message: "auth failed"})
      }
      req.headers["userId"] = payload.userId;
      next()
    })
  }else{
    return res.status(403).json({message:"auth failed"})
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

export default authMiddleware
