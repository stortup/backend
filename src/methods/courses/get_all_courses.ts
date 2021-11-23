import { ObjectId } from "bson";
import { sweet } from "sweet-fastify";
import { toView } from "../../../utils.js";
import { coursesCollection } from "../../collections/courses.js";

interface Params {
  search?: string;
}

export const getAllCourses = sweet({
  method: "GET",
  url: "/get_all_courses",
  params: {
    search: "string|optional",
  },
  async handler(params: Params) {
    const page = 0;
    const result = await coursesCollection
      .aggregate([
        {
          $match: {
            title: params.search && {
              $regex: params.search,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "creator",
          },
        },
        {
          $set: {
            creator: {
              $first: "$creator",
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            creator: {
              _id: 1,
              name: 1,
              bio: 1,
            },
          },
        },
      ])
      .limit(20)
      .skip(page * 20)
      .toArray() as {
        _id: ObjectId;
        title: string;
        description: string;
        creator: {
          _id: ObjectId;
          name: string;
          bio: string;
        };
      }[];

    return result.map((d) => {
      return toView({
        ...d,
        creator: toView(d.creator),
      });
    });
  },
});
