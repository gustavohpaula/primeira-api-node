import fs from "node:fs/promises";
const dbFilePath = new URL("../db.json", import.meta.url);

export class Database {
  #data = {};

  constructor() {
    fs.readFile(dbFilePath, "utf-8")
      .then((content) => {
        this.#data = JSON.parse(content);
      })
      .catch(() => {
        this.#persistData();
      });
  }

  #persistData() {
    fs.writeFile(dbFilePath, JSON.stringify(this.#data));
  }

  select(table, filters) {
    let records = this.#data[table] || [];

    if (filters) {
      records = records.filter((record) => {
        return Object.entries(filters).some(([field, value]) => {
          return record[field]?.toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return records;
  }

  insert(table, record) {
    if (!Array.isArray(this.#data[table])) {
      this.#data[table] = [];
    }
    this.#data[table].push(record);
    this.#persistData();
    return record;
  }
}