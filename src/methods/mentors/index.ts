import { FastifyPluginCallback } from "fastify";
import { getAllMentors } from "./get_all_mentors.js";
import { getMentor } from "./get_mentor.js";

export const mentorsPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.route(getAllMentors);
  fastify.route(getMentor);
  done();
};
