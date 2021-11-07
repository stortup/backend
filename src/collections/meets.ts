import { ObjectId } from "bson";
import { client } from "../../mongo.js";

export interface Meet {
  _id: ObjectId;
  user_id: ObjectId;
  mentor_id: ObjectId;
  price_paid: number;
  // TODO: transaction Id
  date: Date;
  duration: number;
}

export const meetsCollection = client.db("stortup").collection<Meet>(
  "meets",
);

await meetsCollection.createIndexes([
  { key: { user_id: 1 } },
  { key: { mentor_id: 1 } },
  { key: { date: 1 } },
]);
