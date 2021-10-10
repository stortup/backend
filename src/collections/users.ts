import { ObjectId } from "mongodb";
import { client } from "../../mongo";

export interface User {
  _id: ObjectId;
  phone: string;
  is_user: true;
  is_mentor: boolean;
  is_admin: boolean;
  is_verified: boolean;
  name: string | null;
  email: string | null;
  email_verified: boolean;
}

export interface Mentor extends User {
  is_mentor: true;
  is_available: boolean;
  resume: string;
  bio: string;
  avatar_url: string | null;
  hourly_cost: number;
}

export const usersCollection = client.db("stortup").collection<User | Mentor>(
  "users",
);

await usersCollection.createIndexes([
  { key: { is_user: 1, is_mentor: 1 } },
  { key: { is_available: 1 }, sparse: true },
]);
