import { Request, Response } from "express";
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getPaginatedRecords,
} from "../models/recordsModel";

export const fetchRecords1 = (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1; // Default page is 1
  const limit = Number(req.query.limit) || 10; // Default limit is 10
  const entity = req.query.entity as string;

  getPaginatedRecords(page, limit, entity, (err, result: any) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  });
};
export const fetchRecords = (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const entity = req.query.entity as string;

  getPaginatedRecords(page, limit, entity, (err, result: any) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    const totalPages = Math.ceil(result.total / limit);

    res.json({
      success: true,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
      },
      data: result.data,
    });
  });
};
export const fetchRecordById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  getRecordById(id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Record not found" });
    res.json(row);
  });
};

export const addRecord = (req: Request, res: Response) => {
  createRecord(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Record added successfully" });
  });
};

export const editRecord = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  updateRecord(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Record updated successfully" });
  });
};

export const removeRecord = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  deleteRecord(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Record deleted successfully" });
  });
};
