import { ObjectId } from "bson";
import { client } from "../../mongo.js";

interface MentoringRequestDocument {
  _id: ObjectId;
  user_id: ObjectId;
  params: {
    resume: string;
    bio: string;
    bank_no: string;
    hourly_cost: number;
    categories: string[];
  };
}

export const mentoringRequestsCollection = client.db("stortup").collection<
  MentoringRequestDocument
>(
  "mentoring-requests",
);
