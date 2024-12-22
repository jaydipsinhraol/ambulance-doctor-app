"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordsController_1 = require("../controllers/recordsController");
const router = express_1.default.Router();
router.get("/", recordsController_1.fetchRecords);
router.get("/:id", recordsController_1.fetchRecordById);
router.post("/", recordsController_1.addRecord);
router.put("/:id", recordsController_1.editRecord);
router.delete("/:id", recordsController_1.removeRecord);
exports.default = router;
