import { ObjectId } from "bson";
import { client } from "../../mongo";

export interface Time {
  _id: ObjectId;
  start_date: boolean;
  end_date: boolean;
  is_free: boolean;
  meet_id?: ObjectId;
}

export interface MentorTimes {
  _id: ObjectId; // equals to mentor_id
  times: Time[];
}

export const timesCollection = client.db("mentor-times").collection<
  MentorTimes
>(
  "meets",
);
