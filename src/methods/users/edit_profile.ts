import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { usersCollection } from "../../collections/users.js";

interface Params {
  name?: string;
  phone?: string;
  resume?: string;
  bio?: string;
  hourly_cost?: string;
  band_card?: string;
  categories?: string[];
}

export const editProfile = sweet({
  method: "POST",
  url: "/edit_profile",
  auth: usersAuth,
  params: {
    name: "string|optional",
    phone: "email|optional",
    resume: "string|optional",
    hourly_cost: "number|optional",
    band_card: "string|optional",
    categories: "string[]|optional",
  },
  async handler(params: Params, { user_id }) {
    const user = await usersCollection.findOne({ _id: user_id });

    if (!user?.is_mentor) {
      delete params.resume;
      delete params.bio;
      delete params.hourly_cost;
      delete params.band_card;
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
