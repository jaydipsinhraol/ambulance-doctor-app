"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedRecords = exports.deleteRecord = exports.updateRecord = exports.createRecord = exports.getRecordById = exports.getAllRecords = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getAllRecords = (limit, callback) => {
    db_1.default.all(`SELECT * FROM records LIMIT ?`, [limit], callback);
};
exports.getAllRecords = getAllRecords;
const getRecordById = (id, callback) => {
    db_1.default.get(`SELECT * FROM records WHERE id = ?`, [id], callback);
};
exports.getRecordById = getRecordById;
const createRecord = (record, callback) => {
    const { title, description, location, image } = record;
    db_1.default.run(`INSERT INTO records (title, description, location, image) VALUES (?, ?, ?, ?)`, [title, description, location, image], function (err) {
        callback(err || null);
    });
};
exports.createRecord = createRecord;
const updateRecord = (id, record, callback) => {
    const { title, description, location, image } = record;
    db_1.default.run(`UPDATE records SET title = ?, description = ?, location = ?, image = ? WHERE id = ?`, [title, description, location, image, id], callback);
};
exports.updateRecord = updateRecord;
const deleteRecord = (id, callback) => {
    db_1.default.run(`DELETE FROM records WHERE id = ?`, [id], callback);
};
exports.deleteRecord = deleteRecord;
const getPaginatedRecords = (page, limit, callback) => {
    const offset = (page - 1) * limit;
    // Query to get total count of records
    db_1.default.get(`SELECT COUNT(*) as total FROM records`, [], (countErr, countRow) => {
        if (countErr)
            return callback(countErr);
        const total = countRow.total;
        // Query to fetch paginated records
        db_1.default.all(`SELECT * FROM records LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
            if (err)
                return callback(err);
            callback(null, { rows, total });
        });
    });
};
exports.getPaginatedRecords = getPaginatedRecords;
