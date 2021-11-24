import fastify from "fastify";
import Validator from "fastest-validator";
import validatorPlugin from "fastify-fv";
import corsPlugin from "fastify-cors";
import { usersPlugin } from "./src/methods/users/index.js";
import { mentorsPlugin } from "./src/methods/mentors/index.js";
import { coursesPlugin } from "./src/methods/courses/index.js";
import { filesPlugin } from "./src/methods/files/files.js";
import { vodPlugin } from "./src/methods/vod/vod.js";

const app = fastify();

app.addHook("onError", (request, reply, error, done) => {
  console.error(error);
  done();
});

const validator = new Validator();
app.register(validatorPlugin, validator as any);
app.register(corsPlugin);
app.register(usersPlugin, { prefix: "/users" });
app.register(mentorsPlugin, { prefix: "/mentors" });
app.register(coursesPlugin, { prefix: "/courses" });
app.register(filesPlugin, { prefix: "/files" });
app.register(vodPlugin, { prefix: "/vod" });

app.get("/", (req, rep) => {
  rep.send("hi");
});

app.listen(4004, "0.0.0.0");
console.log("server running on port 4004");
