import { MongoClient } from "mongodb";

export const client = new MongoClient("mongodb://localhost:27017/stortup");

await client.connect();
