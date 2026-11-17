import { neon } from "@neondatabase/serverless";
import { makeStore } from "./store";

let client;

// Created on first query so `next build` works without DATABASE_URL.
function sql(strings, ...values) {
  if (!client) {
    const url = process.env.DATABASE_URL || process.env.STUDY_LANE_DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    client = neon(url);
  }
  return client(strings, ...values);
}

export const store = makeStore(sql);
