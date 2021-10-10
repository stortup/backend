import fastify from "fastify";

const app = fastify();

app.get("/", (req, rep) => {
  rep.send("hi");
});

app.listen(4004);
