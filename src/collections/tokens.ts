import { ObjectId } from "bson";
import { client } from "../../mongo";

export interface TokenDocument {
  _id: ObjectId; // equals phone number
  user: ObjectId;
}

export const tokensCollection = client.db("stortup").collection<
  TokenDocument
>(
  "tokens",
);
