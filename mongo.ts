import { MongoClient } from "mongodb";

export const client = new MongoClient("mongodb://localhost:27017/stortup", {
  ignoreUndefined: true,
});

await client.connect();
