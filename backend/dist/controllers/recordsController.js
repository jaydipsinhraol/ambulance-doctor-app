"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRecord = exports.editRecord = exports.addRecord = exports.fetchRecordById = exports.fetchRecords = void 0;
const recordsModel_1 = require("../models/recordsModel");
const fetchRecords = (req, res) => {
    const page = Number(req.query.page) || 1; // Default page is 1
    const limit = Number(req.query.limit) || 10; // Default limit is 10
    (0, recordsModel_1.getPaginatedRecords)(page, limit, (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message });
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
exports.fetchRecords = fetchRecords;
const fetchRecordById = (req, res) => {
    const id = Number(req.params.id);
    (0, recordsModel_1.getRecordById)(id, (err, row) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (!row)
            return res.status(404).json({ error: "Record not found" });
        res.json(row);
    });
};
exports.fetchRecordById = fetchRecordById;
const addRecord = (req, res) => {
    (0, recordsModel_1.createRecord)(req.body, (err) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Record added successfully" });
    });
};
exports.addRecord = addRecord;
const editRecord = (req, res) => {
    const id = Number(req.params.id);
    (0, recordsModel_1.updateRecord)(id, req.body, (err) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: "Record updated successfully" });
    });
};
exports.editRecord = editRecord;
const removeRecord = (req, res) => {
    const id = Number(req.params.id);
    (0, recordsModel_1.deleteRecord)(id, (err) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: "Record deleted successfully" });
    });
};
exports.removeRecord = removeRecord;
