import { MongoClient } from "mongodb";

export const client = new MongoClient("mongodb://localhost:227017/stortup");

await client.connect();
