import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { usersCollection } from "../../collections/users.js";

interface Params {
  name?: string;
  phone?: string;
  email?: string;
  resume?: string;
  bio?: string;
  hourly_cost?: string;
  bank_no?: string;
  categories?: string[];
}

export const editProfile = sweet({
  method: "POST",
  url: "/edit_profile",
  auth: usersAuth,
  params: {
    name: "string|optional",
    phone: "string|optional",
    email: "string|optional", // TODO
    resume: "string|optional",
    hourly_cost: "number|optional",
    bank_no: "string|optional",
    categories: "string[]|optional",
  },
  async handler(params: Params, { user_id }) {
    const user = await usersCollection.findOne({ _id: user_id });

    if (!user?.is_mentor) {
      delete params.resume;
      delete params.bio;
      delete params.hourly_cost;
      delete params.bank_no;
    }

    await usersCollection.updateOne(
      { _id: user_id },
      {
        $set: {
          ...params,
        },
      },
    );
  },
});
