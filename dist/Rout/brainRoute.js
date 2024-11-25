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
const db_1 = require("../models/db");
const usermiddleware_1 = __importDefault(require("../middlewares/usermiddleware"));
const crypto_1 = __importDefault(require("crypto"));
const brainRoute = express_1.default.Router();
brainRoute.post('/add', usermiddleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) !== null && _a !== void 0 ? _a : "";
        const { contentType, contentLink, title, description, tags, manualContent } = req.body;
        const braincraeted = yield db_1.Brain.create({
            user: userId,
            contentType,
            contentLink,
            title,
            description,
            tags,
            manualContent,
        });
        if (braincraeted) {
            res.status(201).json({
                message: "Brain Created",
                braincraeted
            });
        }
        else {
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
brainRoute.get('/user', usermiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) !== null && _a !== void 0 ? _a : "";
        const Allbrain = yield db_1.Brain.find({ user: userId });
        res.status(200).json(Allbrain);
    }
    catch (error) {
        console.error(error);
    }
}));
brainRoute.put('/update/:id', usermiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) !== null && _a !== void 0 ? _a : "";
        const { id } = req.params;
        const { contentType, contentLink, title, description, tags, manualContent } = req.body;
        const brainUpdate = yield db_1.Brain.findByIdAndUpdate({ _id: id,
            user: userId
        }, {
            contentType,
            contentLink,
            title,
            description,
            tags,
            manualContent,
        }, {
            new: true
        });
        if (brainUpdate) {
            res.status(200).json({
                message: "Brain Updated",
                brainUpdate
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
brainRoute.delete('/delete/:id', usermiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) !== null && _a !== void 0 ? _a : "";
        const { id } = req.params;
        const brainDelete = yield db_1.Brain.findByIdAndDelete({ _id: id, user: userId });
        if (brainDelete) {
            res.status(200).json({
                message: "Brain Deleted",
                brainDelete
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
const generateShareableLink = (brainId) => {
    const hash = crypto_1.default.randomBytes(16).toString('hex');
    return `${process.env.APP_URL}/shared/${brainId}/${hash}`;
};
brainRoute.put('/share/:id', usermiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) !== null && _a !== void 0 ? _a : "";
        const { id } = req.params;
        const brainShared = yield db_1.Brain.findOne({
            _id: id,
            user: userId
        });
        if (!brainShared) {
            res.status(404).json({
                message: "Brain Not Found"
            });
            return;
        }
        else {
            brainShared.isShared = true;
            brainShared.shareableLink = generateShareableLink(brainShared._id.toString());
        }
        yield brainShared.save();
        res.status(200).json({
            message: "Brain Shared",
            brainShared
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
brainRoute.get('/search', usermiddleware_1.default), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) !== null && _a !== void 0 ? _a : "";
        const { contentType, title, tags } = req.query;
        let serachCriteria = { user: userId };
        if (contentType) {
            serachCriteria.contentType = contentType;
        }
        if (title) {
            serachCriteria.title = { $regex: title, $options: 'i' };
        }
        if (tags) {
            const tagArray = Array.isArray(tags);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.default = brainRoute;
