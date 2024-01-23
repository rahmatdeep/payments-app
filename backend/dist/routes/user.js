"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const db_1 = require("../db");
const middleware_1 = __importDefault(require("../middleware"));
const router = express_1.default.Router();
//SIGN UP
const signupSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs",
        });
    }
    const exsistingUser = yield db_1.User.findOne({
        username: req.body.username,
    });
    if (exsistingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        });
    }
    const user = yield db_1.User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    const userId = user._id;
    yield db_1.Account.create({
        userId,
        balance: Math.floor(Math.random() * 10000) + 1,
    });
    const token = jsonwebtoken_1.default.sign({
        userId,
    }, config_1.default);
    res.json({
        message: "User created successfully",
        token: token,
    });
}));
//SIGNIN
const singinSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = singinSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const user = yield db_1.User.findOne({
        username: req.body.username,
        password: req.body.password,
    });
    if (user) {
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, config_1.default);
        res.json({
            token: token,
        });
        return;
    }
    else {
        res.status(411).json({
            message: "Error while loggin in",
        });
    }
}));
//UPDATE
const updateSchema = zod_1.default.object({
    password: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
});
router.put("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = updateSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information",
        });
    }
    const updatedFields = Object.keys(req.body);
    if (updatedFields.length === 0) {
        return res.status(411).json({
            message: "No fields provided for update",
        });
    }
    yield db_1.User.updateOne({ _id: req.headers["userId"] }, { $set: req.body });
    res.json({
        message: "Updated successfully",
    });
}));
//SEARCH USERS
router.get("/bulk", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    if (filter === "") {
        return res.json({
            message: "Filter Empty",
        });
    }
    const users = yield db_1.User.find({
        $or: [
            {
                firstName: {
                    $regex: filter,
                },
            },
            {
                lastName: {
                    $regex: filter,
                },
            },
        ],
    });
    res.json({
        user: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
}));
exports.default = router;
