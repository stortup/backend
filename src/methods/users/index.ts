import { FastifyPluginCallback } from "fastify";
import { sendCode } from "./send_code.js";
import { enterUser } from "./enter_user.js";
import { getMe } from "./get_me.js";

export const usersPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.route(sendCode);
  fastify.route(enterUser);
  fastify.route(getMe);

  done();
};
