import db from "../utils/db";

export const getAllRecords = (
  limit: number,
  callback: (err: Error | null, rows?: any[]) => void
) => {
  db.all(`SELECT * FROM records LIMIT ?`, [limit], callback);
};

export const getRecordById = (
  id: number,
  callback: (err: Error | null, row?: any) => void
) => {
  db.get(`SELECT * FROM records WHERE id = ?`, [id], callback);
};

export const createRecord = (
  record: any,
  callback: (err: Error | null) => void
) => {
  const { title, description, location, image, entity } = record;
  console.log("entity... ", entity);
  db.run(
    `INSERT INTO records (title, description, location, image, entity) VALUES (?, ?, ?, ?,?)`,
    [title, description, location, image, entity],
    function (err) {
      callback(err || null);
    }
  );
};

export const updateRecord = (
  id: number,
  record: any,
  callback: (err: Error | null) => void
) => {
  const { title, description, location, image } = record;
  db.run(
    `UPDATE records SET title = ?, description = ?, location = ?, image = ? WHERE id = ?`,
    [title, description, location, image, id],
    callback
  );
};

export const deleteRecord = (
  id: number,
  callback: (err: Error | null) => void
) => {
  db.run(`DELETE FROM records WHERE id = ?`, [id], callback);
};

export const getPaginatedRecords = (
  page: number,
  limit: number,
  entity: string | undefined,
  callback: (err: Error | null, result?: { data: any[]; total: number }) => void
) => {
  const offset = (page - 1) * limit;
  const params: any[] = [];
  let query = `SELECT * FROM records`;
  let countQuery = `SELECT COUNT(*) AS total FROM records`;

  if (entity) {
    query += ` WHERE entity = ?`;
    countQuery += ` WHERE entity = ?`;
    params.push(entity);
  }

  query += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  db.get(
    countQuery,
    params.slice(0, entity ? 1 : 0),
    (countErr, countRow: any) => {
      if (countErr) return callback(countErr);

      db.all(query, params, (dataErr, rows) => {
        if (dataErr) return callback(dataErr);

        callback(null, { data: rows, total: countRow.total });
      });
    }
  );
};
