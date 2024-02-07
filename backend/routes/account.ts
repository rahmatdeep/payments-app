import express from "express";
import authMiddleware from "../middleware";
import { User, Account } from "../db";
import mongoose from "mongoose";

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.headers["userId"],
    });
    if (!account) {
      return res.status(404).json({ msg: "Account not Found" });
    }
    res.json({
      balance: account.balance,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Servor Error",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  if (req.headers["userId"] === req.body.to) {
    return res.status(411).json({
      msg: "You cannot send money to yourself",
    });
  }
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({
      userId: req.headers["userId"],
    }).session(session);

    if (!account || account.balance < amount) {
      if (session) {
        await session.abortTransaction();
        return res.status(400).json({
          msg: "Insuffecient balance",
        });
      }
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      if (session) {
        await session.abortTransaction();
        return res.status(400).json({
          msg: "Invalid account",
        });
      }
    }

    await Account.updateOne(
      { userId: req.headers["userId"] },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    res.json({
      msg: "Transaction successful",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Servor Error" });
  }
});

export default router;
