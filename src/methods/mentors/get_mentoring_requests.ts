import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { assertAdmin, usersAuth } from "../../authentications/users.js";
import { mentoringRequestsCollection } from "../../collections/mentoring_requests.js";

export const getMentoringRequests = sweet({
  method: "GET",
  url: "/get_mentoring_requests",
  auth: usersAuth,
  async handler(_, { user_id }) {
    await assertAdmin(user_id);

    return mentoringRequestsCollection.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $set: {
          user: {
            $first: "$user",
          },
        },
      },
    ]).map((doc) => {
      return toView({
        _id: doc._id,
        user_id: doc.user_id,
        name: doc.user.name,
        email: doc.user.email,
        phone: doc.user.phone,
        ...doc.params,
      });
    }).toArray();
  },
});
