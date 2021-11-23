import { FastifyPluginCallback } from "fastify";
import { getAllCourses } from "./get_all_courses.js";
import { getCourse } from "./get_course.js";

export const coursesPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.route(getAllCourses);
  fastify.route(getCourse);
  done();
};
