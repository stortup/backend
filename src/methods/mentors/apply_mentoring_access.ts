import { ObjectId } from "bson";
import createError from "fastify-error";
import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { mentoringRequestsCollection } from "../../collections/mentoring_requests.js";
import { usersCollection } from "../../collections/users.js";

interface Params {
  resume: string;
  bio: string;
  bank_no: string;
  hourly_cost: number;
  categories: string[];
}

const ALREADY_MENTOR = createError(
  "ALREADY_MENTOR",
  "You are already a mentor",
  400,
);

export const applyMentoringAccess = sweet({
  method: "POST",
  url: "/apply_mentoring_access",
  auth: usersAuth,
  params: {
    resume: "string",
    bio: "string",
    bank_no: "string",
    hourly_cost: "number",
    categories: "string[]",
  },
  async handler(params: Params, { user_id }) {
    const user = await usersCollection.findOne({ _id: user_id });

    if (user!.is_mentor) throw new ALREADY_MENTOR();

    await mentoringRequestsCollection.insertOne({
      _id: new ObjectId(),
      user_id,
      params,
    });
  },
});
