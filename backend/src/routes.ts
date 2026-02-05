import { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import validate from "./middleware/validateRequest.js";
import {
  createItemSchema,
  getItemSchema,
  getItemListSchema,
  checkoutItemSchema,
} from "./schema/item.schema.js";
import mockData from "./mockData.json" with { type: "json" };

// We are using JSON for item creation
let jsonParser = bodyParser.json();

function routes(app: Express) {
  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).send("API is healthy");
  });
  app.post(
    "/api/items/:type",
    [jsonParser, validate(createItemSchema)],
    (req: Request, res: Response) => {
      res.status(201).send(mockData.goods[0]);
    },
  );
  app.get(
    "/api/items/:type/:id",
    [validate(getItemSchema)],
    (req: Request, res: Response) => {
      if (
        !(typeof req.params.type === "string") ||
        !(typeof Number(req.params.id) === "number")
      ) {
        res.status(400).send("Invalid request parameters");
        return;
      }
      res.send(
        mockData[req.params.type as keyof typeof mockData][
          Number(req.params.id)
        ],
      );
    },
  );

  app.get(
    "/api/items/",
    [validate(getItemListSchema)],
    (req: Request, res: Response) => {
      res.send(JSON.stringify(mockData));
    },
  );

  app.put(
    "/api/items/:type/:id",
    [jsonParser, validate(checkoutItemSchema)],
    (req: Request, res: Response) => {
      res.send(
        `Checked out item of type ${req.params.type} with id ${req.params.id}`,
      );
    },
  );
}

export default routes;
