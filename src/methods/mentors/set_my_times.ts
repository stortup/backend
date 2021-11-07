import createError from "fastify-error";
import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { Time, timesCollection } from "../../collections/times.js";
import { usersCollection } from "../../collections/users.js";

const UNAUTHORIZED = createError("FORBIDDEN", "user is not mentor", 403);

interface Request {
  times: RequestTime[];
}

interface RequestTime {
  date: Date;
  duration: number;
}

export const setMyTimes = sweet({
  method: "POST",
  url: "/set_my_times",
  params: {
    times: {
      type: "array",
      values: {
        type: "object",
        props: {
          date: "date",
          duration: "number",
        },
      },
    },
  },
  auth: usersAuth,
  async handler(params: Request, { user_id }) {
    const user = await usersCollection.findOne({
      _id: user_id,
      is_mentor: true,
    });

    if (!user) {
      throw new UNAUTHORIZED();
    }

    const timeDocument = await timesCollection.findOne({
      _id: user_id,
    });

    const currentTimes: Time[] = timeDocument?.times ?? [];
    const newTimes: Time[] = [];

    for (const currentTime of currentTimes) {
      if (currentTime.reserved) newTimes.push(currentTime);
    }

    for (const time of params.times) {
      newTimes.push({
        date: time.date,
        duration: time.duration,
        reserved: false,
      });
    }

    await timesCollection.replaceOne({ _id: user_id }, {
      _id: user_id,
      times: newTimes,
    }, { upsert: true });
  },
});
