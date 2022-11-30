"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 8000;
const one = 8;
const two = 12;
const three = undefined;
app.get("/", (req, res) => res.send(`one + two = ${one + two}`));
app.listen(port);
console.log(`[app]: http://localhost:${port}`);
