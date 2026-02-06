import { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import validate from "./middleware/validateRequest.js";
import {
  createItemSchema,
  getItemSchema,
  getItemListSchema,
  checkoutItemSchema,
  GetItemInput,
  GetItemListInput,
  CreateItemInput,
  CheckoutItemInput,
} from "./schema/item.schema.js";

import {
  getItemHandler,
  getItemListHandler,
  createItemHandler,
  checkoutItemHandler,
} from "./handlers/item.handler.js";

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
      createItemHandler(
        req as unknown as Request<
          { type: string },
          {},
          CreateItemInput["body"]
        >,
        res,
      );
    },
  );
  app.get(
    "/api/items/:type/:id",
    [validate(getItemSchema)],
    //
    (req: Request, res: Response) =>
      getItemHandler(req as unknown as Request<GetItemInput["params"]>, res),
  );

  app.get(
    "/api/items/",
    [validate(getItemListSchema)],
    (req: Request, res: Response) => {
      getItemListHandler(
        req as unknown as Request<{}, {}, GetItemListInput["query"]>,
        res,
      );
    },
  );

  app.put(
    "/api/items/:type/:id",
    [jsonParser, validate(checkoutItemSchema)],
    (req: Request, res: Response) => {
      checkoutItemHandler(
        req as unknown as Request<
          CheckoutItemInput["params"],
          {},
          CheckoutItemInput["body"]
        >,
        res,
      );
    },
  );
}

export default routes;
