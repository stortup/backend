import { FastifyPluginCallback } from "fastify";
import { getAllMentors } from "./get_all_mentors.js";
import { getMentor } from "./get_mentor.js";
import { getMyMeets } from "./get_my_meets.js";
import { getMyTimes } from "./get_my_times.js";
import { reserveMentor } from "./reserve_mentor.js";
import { setMyTimes } from "./set_my_times.js";

export const mentorsPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.route(getAllMentors);
  fastify.route(getMentor);
  fastify.route(getMyTimes);
  fastify.route(setMyTimes);
  fastify.route(getMyMeets);
  fastify.route(reserveMentor);
  done();
};
