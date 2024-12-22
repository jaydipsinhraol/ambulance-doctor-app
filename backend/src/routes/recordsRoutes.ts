import express from "express";
import {
  fetchRecords,
  fetchRecordById,
  addRecord,
  editRecord,
  removeRecord,
} from "../controllers/recordsController";

const router = express.Router();

router.get("/", fetchRecords);
router.get("/:id", fetchRecordById);
router.post("/", addRecord);
router.put("/:id", editRecord);
router.delete("/:id", removeRecord);

export default router;
