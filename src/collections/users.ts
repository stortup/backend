import { ObjectId } from "mongodb";
import { client } from "../../mongo.js";

interface UserBase {
  _id: ObjectId;
  phone?: string;
  email?: string;
  is_mentor: boolean;
  is_admin: boolean;
  name: string | null;
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
  bank_no: string | null;
  hourly_cost: number;
  categories: string[];
}

export interface Admin extends UserBase {
  is_admin: true;
}

export const usersCollection = client.db("stortup").collection<
  User | Mentor | Admin
>(
  "users",
);

await usersCollection.createIndexes([
  { key: { phone: 1 }, unique: true, sparse: true },
  { key: { email: 1 }, unique: true, sparse: true },
  { key: { is_user: 1 } },
  { key: { is_mentor: 1 } },
  { key: { categories: 1 }, sparse: true },
]);
