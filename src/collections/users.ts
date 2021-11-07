import { ObjectId } from "mongodb";
import { client } from "../../mongo.js";

interface UserBase {
  _id: ObjectId;
  phone?: string;
  is_mentor: boolean;
  is_admin: boolean;
  name: string | null;
  email: string | null;
  email_verified: boolean;
}

export interface User extends UserBase {
  is_mentor: false;
}

export interface Mentor extends UserBase {
  is_mentor: true;
  resume: string;
  bio: string;
  avatar_url: string | null;
  bank_card: string | null;
  hourly_cost: number;
}

export const usersCollection = client.db("stortup").collection<User | Mentor>(
  "users",
);

await usersCollection.createIndexes([
  { key: { phone: 1 }, unique: true, sparse: true },
  { key: { email: 1 }, unique: true, sparse: true },
  { key: { is_user: 1 } },
  { key: { is_mentor: 1 } },
  { key: { is_available: 1 }, sparse: true },
]);
