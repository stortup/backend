import { client } from "../../mongo.js";

export interface OtpDocument {
  _id: string; // equals phone number
  code: string;
  expire_at: Date;
}

export const otpCollection = client.db("stortup").collection<OtpDocument>(
  "otp",
);

await otpCollection.createIndexes([
  { key: { expire_at: 1 }, expireAfterSeconds: 0 },
]);
