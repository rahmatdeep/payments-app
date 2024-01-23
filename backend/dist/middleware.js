"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "Access denied",
        });
    }
    const token = authHeader.split(" ")[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, config_1.default, (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "auth failed" });
            }
            if (!payload) {
                return res.status(403).json({ message: "auth failed" });
            }
            if (typeof payload === "string") {
                return res.status(403).json({ message: "auth failed" });
            }
            req.headers["userId"] = payload.userId;
            next();
        });
    }
    else {
        return res.status(403).json({ message: "auth failed" });
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
exports.default = authMiddleware;
