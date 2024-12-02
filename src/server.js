import http from "http";
import { routeDefinitions } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const matchingRoute = routeDefinitions.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (matchingRoute) {
    const matchedParams = url.match(matchingRoute.path);
    const { query, ...params } = matchedParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    return matchingRoute.handler(request, response);
  }

  response.writeHead(404).end("Rota não encontrada");
});

server.listen(3000);