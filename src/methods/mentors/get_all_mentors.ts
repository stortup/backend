import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { Time } from "../../collections/times.js";
import { usersCollection } from "../../collections/users.js";
import { filterAndSortTimes } from "../../utils/mentors.js";

interface Params {
  category?: string;
  search?: string;
}

interface ResultMentor {
  id: ObjectId;
  name: string;
  resume: string;
  avatar_url: string;
  bio: string;
  times: ResultTime[];
  hourly_cost: number;
}

interface ResultTime {
  date: Date;
  duration: number;
  reserved: boolean;
}

interface AggregateResult {
  _id: ObjectId;
  name: string;
  resume: string;
  avatar_url: string;
  bio: string;
  times: Time[];
  hourly_cost: number;
}

export const getAllMentors = sweet({
  method: "GET",
  url: "/get_all_mentors",
  params: {
    category: "string|optional",
    search: "string|optional",
  },
  async handler(params: Params): Promise<ResultMentor[]> {
    const page = 0;
    const result = await usersCollection
      .aggregate([
        {
          $match: {
            is_mentor: true,
            categories: params.category,
            name: params.search && {
              $regex: params.search,
            },
          },
        },
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
          $match: {
            times: {
              $ne: null,
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
      .limit(20)
      .skip(page * 20)
      .toArray() as AggregateResult[];

    return result.map(mentorToView);
  },
});

function mentorToView(d: AggregateResult) {
  d.times = filterAndSortTimes(d.times);

  const view = toView(d);

  return view;
}
