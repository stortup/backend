import fastify from "fastify";
import Validator from "fastest-validator";
import validatorPlugin from "fastify-fv";
import corsPlugin from "fastify-cors";
import { usersPlugin } from "./src/methods/users/index.js";
import { mentorsPlugin } from "./src/methods/mentors/index.js";
import { filesPlugin } from "./src/methods/files/files.js";

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
app.register(filesPlugin, { prefix: "/files" });

app.get("/", (req, rep) => {
  rep.send("hi");
});

app.route;

app.listen(4004, "0.0.0.0");
console.log("server running on port 4004");
