import { ObjectId } from "bson";
import { client } from "../../mongo";

export interface Meet {
  _id: ObjectId;
  creator: ObjectId;
  mentor: ObjectId;
  price_paid: number;
  // TODO: transaction Id
  start_date: Date;
  end_date: Date;
}

export const meetsCollection = client.db("stortup").collection<Meet>(
  "meets",
);

await meetsCollection.createIndexes([
  { key: { creator: 1 } },
  { key: { mentor: 1 } },
  { key: { start_date: 1 } },
]);
