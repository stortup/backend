import fastify from "fastify";
import Validator from "fastest-validator";
import ValidatorPlugin from "fastify-fv";
import { usersPlugin } from "./src/methods/users/index.js";

const app = fastify();

const validator = new Validator();
app.register(ValidatorPlugin, validator as any);
app.register(usersPlugin, { prefix: "/users" });

app.get("/", (req, rep) => {
  rep.send("hi");
});

app.route;

app.listen(4004);
