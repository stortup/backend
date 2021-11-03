import { ObjectId } from "bson";
import { client } from "../../mongo.js";

export interface TokenDocument {
  _id: ObjectId; // equals phone number
  user_id: ObjectId;
}

export const tokensCollection = client.db("stortup").collection<
  TokenDocument
>(
  "tokens",
);
