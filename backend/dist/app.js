"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const recordsRoutes_1 = __importDefault(require("./routes/recordsRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/api/records", recordsRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Ambulance & Doctor Locator API is running!");
});
exports.default = app;
