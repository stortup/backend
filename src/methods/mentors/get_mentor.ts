import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { usersCollection } from "../../collections/users.js";
import { filterAndSortTimes } from "../../utils/mentors.js";

export const getMentor = sweet({
  method: "GET",
  url: "/get_mentor",
  params: {
    mentor_id: { type: "string" },
  },
  async handler({ mentor_id }) {
    const results: any = await usersCollection
      .aggregate([
        { $match: { _id: new ObjectId(mentor_id), is_mentor: true } },
        {
          $lookup: {
            from: "times",
            localField: "_id",
            foreignField: "_id",
            as: "lookup_result",
          },
        },
        {
          $set: {
            times: {
              $first: "$lookup_result.times",
            },
          },
        },
        {
          $project: {
            id: 1,
            name: 1,
            resume: 1,
            avatar_url: 1,
            bio: 1,
            times: 1,
            hourly_cost: 1,
          },
        },
      ])
      .toArray();

    const result = results[0];
    if (!result) return null;

    result.times = filterAndSortTimes(result.times ?? []);

    return toView(result);
  },
});
