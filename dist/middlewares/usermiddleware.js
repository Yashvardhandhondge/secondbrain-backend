"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usermiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Jwt_scerate = process.env.JWT_SECRET;
function usermiddleware(req, res, next) {
    const token = req.headers.token || "";
    if (!token) {
        res.status(401).json({
            message: "No token provided"
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token.toString(), Jwt_scerate || "");
        if (decoded && decoded.id) {
            req.userId = decoded.id;
            next();
        }
        else {
            res.status(401).json({
                message: "Unauthorized"
            });
        }
    }
    catch (e) {
        res.status(403).json({
            message: "Invalid token"
        });
    }
}
