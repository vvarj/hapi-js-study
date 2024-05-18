const Hapi = require("@hapi/hapi");
const Path = require("path");
const Handlebars = require("handlebars");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: Path.join(__dirname, "public"),
      },
    },
  });

  await server.register(require("@hapi/inert"));
  await server.register(require("@hapi/vision"));

  // To regisiter template engine :hbs
  server.views({
    engines: { hbs: Handlebars },
    relativeTo: __dirname,
    path: `views`,
  });

  // to server a route
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "<h1>Hello World!</h1>";
    },
  });

  server.route({
    method: "GET",
    path: "/user/{name}",
    handler: (request, h) => {
      return `<h1>Hello ${request.params.name}</h1>`;
    },
  });

  // Serving static files
  server.route({
    method: "GET",
    path: "/about",
    handler: (request, h) => {
      return h.file("about.html");
    },
  });

  // TO serve view engine
  server.route({
    method: "GET",
    path: "/view-page",
    handler: (request, h) => {
      return h.view("index", {
        title: "HBS page title test",
        message: "Hey this is message from hapi server",
      });
    },
  });

  await server.start();
  console.log("Server running on", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
