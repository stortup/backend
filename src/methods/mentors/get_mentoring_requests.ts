import { sweet } from "sweet-fastify";
import { assertAdmin, usersAuth } from "../../authentications/users.js";
import { mentoringRequestsCollection } from "../../collections/mentoring_requests.js";

export const getMentoringRequests = sweet({
  method: "GET",
  url: "/get_mentoring_requests",
  auth: usersAuth,
  async handler(_, { user_id }) {
    await assertAdmin(user_id);

    return mentoringRequestsCollection.find({}).toArray();
  },
});
