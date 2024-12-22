import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to SQLite database.");
});

db.serialize(() => {
  // Create the table with the new "entity" field
  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT,
      entity TEXT NOT NULL
    )
  `);

  // Seed data with the "entity" field
  const seedData = [
    [
      "Ambulance A",
      "Available for emergencies",
      "Iscon,Ahemdabad A",
      "https://cdn-icons-png.flaticon.com/512/196/196134.png",
      "ambulance",
    ],
    [
      "Ambulance B",
      "Fast response team",
      "Prahlad nagar,Ahemdabad",
      "https://cdn-icons-png.flaticon.com/512/196/196134.png",
      "ambulance",
    ],
    [
      "Doctor X",
      "Specialist in trauma care",
      "Paldi,Ahemdabad",
      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
      "doctor",
    ],
    [
      "Doctor Y",
      "Pediatrician",
      "Iscon,Ahemdabad",
      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
      "doctor",
    ],
  ];

  seedData.forEach(([title, description, location, image, entity]) => {
    db.run(
      `INSERT INTO records (title, description, location, image, entity) VALUES (?, ?, ?, ?, ?)`,
      [title, description, location, image, entity]
    );
  });
});

export default db;
