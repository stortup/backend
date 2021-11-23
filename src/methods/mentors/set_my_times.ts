import createError from "fastify-error";
import { sweet } from "sweet-fastify";
import { usersAuth } from "../../authentications/users.js";
import { Time, timesCollection } from "../../collections/times.js";
import { usersCollection } from "../../collections/users.js";
import { addTime } from "../../utils/times.js";

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
      items: {
        type: "object",
        props: {
          date: "date|convert",
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
    const newTimes: Time[] = []; // sorted by date

    for (const currentTime of currentTimes) {
      if (currentTime.reserved) addTime(newTimes, currentTime);
    }

    for (const time of params.times) {
      addTime(newTimes, {
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
