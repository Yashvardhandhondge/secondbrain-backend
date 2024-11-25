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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup_1 = __importDefault(require("./Rout/signup"));
const signin_1 = __importDefault(require("./Rout/signin"));
const cors_1 = __importDefault(require("cors"));
const brainRoute_1 = __importDefault(require("./Rout/brainRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/user', signup_1.default);
app.use('/user', signin_1.default);
app.use('/brain', brainRoute_1.default);
const Mongo = process.env.MONGO_URL;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connected = yield mongoose_1.default.connect(Mongo || '');
            console.log('connected to mongodb');
        }
        catch (error) {
            console.error('Failed to connect to MongoDB', error);
        }
    });
}
// Call the MongoDB connection function
main();
// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
