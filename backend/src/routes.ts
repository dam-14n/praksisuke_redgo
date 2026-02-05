import { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import validate from "./middleware/validateRequest.js";
import { createItemSchema } from "./schema/item.schema.js";
import mockData from "./mockData.json" with { type: "json" };

// We are using JSON for item creation
let jsonParser = bodyParser.json();

function routes(app: Express) {
  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).send("API is healthy");
  });
  app.post(
    "/api/items",
    [jsonParser, validate(createItemSchema)],
    (req: Request, res: Response) => {
      res.status(201).send(mockData.goods[0]);
    },
  );
  app.get("/api/items/:type/:id", (req: Request, res: Response) => {
    if (
      !(typeof req.params.type === "string") ||
      !(typeof Number(req.params.id) === "number")
    ) {
      res.status(400).send("Invalid request parameters");
      return;
    }
    res.send(
      mockData[req.params.type as keyof typeof mockData][Number(req.params.id)],
    );
  });

  app.get("/api/items/", (req: Request, res: Response) => {
    res.send(JSON.stringify(mockData));
  });
}

export default routes;
