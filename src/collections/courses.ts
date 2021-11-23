import { ObjectId } from "mongodb";
import { client } from "../../mongo.js";

export interface Course {
  _id: ObjectId;
  creator: ObjectId;
  title: string;
  description: string;
  episodes: Episode[];
}

export interface Episode {
  title: string;
  video: string;
  thumbnail: string;
}

export const coursesCollection = client.db("stortup").collection<Course>(
  "courses",
);
