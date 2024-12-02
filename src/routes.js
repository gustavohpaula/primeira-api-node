import { randomUUID } from "node:crypto";
import { Database } from "./db.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const db = new Database();

export const routeDefinitions = [
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { search } = req.query;
      const users = db.select("users", search ? { name: search, email: search } : null);
      res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { name, email } = req.body;
      db.insert("users", { id: randomUUID(), name, email });
      res.writeHead(201).end();
    },
  }
];