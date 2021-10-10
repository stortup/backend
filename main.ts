import fastify from "fastify";
import Validator from "fastest-validator";
import ValidatorPlugin from "fastify-fv";

const app = fastify();

const validator = new Validator();
app.register(ValidatorPlugin, validator as any);

app.get("/", (req, rep) => {
  rep.send("hi");
});

app.listen(4004);
