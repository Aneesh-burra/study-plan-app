import { neon } from "@neondatabase/serverless";
import { makeStore } from "./store";

let client;

// Created on first query so `next build` works without DATABASE_URL.
function sql(strings, ...values) {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    client = neon(process.env.DATABASE_URL);
  }
  return client(strings, ...values);
}

export const store = makeStore(sql);
