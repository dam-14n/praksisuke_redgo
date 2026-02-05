import {
  GetItemInput,
  GetItemListInput,
  CreateItemInput,
  CheckoutItemInput,
} from "../schema/item.schema.js";
import { db } from "../database.js";
import { Request, Response } from "express";

function verifyResult(result: any, response: Response) {
  if (typeof result === "undefined") {
    response.status(404).send("Item not found");
  } else {
    response.status(200).send(JSON.stringify(result));
  }
}

function generateFilterStrings(filterList: GetItemListInput["query"]) {
  let whereStatements: [string, string][] = [];
  for (const filterKey in filterList) {
    const filterValue =
      filterList[filterKey as keyof GetItemListInput["query"]];
    whereStatements.push([filterKey, filterValue]);
  }
  return whereStatements;
}

export async function getItemHandler(
  req: Request<GetItemInput["params"]>,
  res: Response,
) {
  try {
    const result = await db
      .selectFrom(req.params.type)
      .where("id", "=", Number(req.params.id))
      .selectAll()
      .executeTakeFirst();
    verifyResult(result, res);
  } catch (error) {
    console.error("Error getting item by ID:", error);
    res.status(500).send("Internal server error");
  }
}

export async function getItemListHandler(
  req: Request<{}, {}, GetItemListInput["query"]>,
  res: Response,
) {
  try {
    const itemTypes: ("car" | "animal" | "goods")[] = [];
    let queryFilters = req.query;

    if ("type" in req.query) {
      // validator middleware already ensures that this is a valid type
      itemTypes.push(req.query.type as "car" | "animal" | "goods");
      const { type, ...rest } = req.query;
      queryFilters = rest;
    } else {
      itemTypes.push("car", "animal", "goods");
    }
    const whereStatements = generateFilterStrings(queryFilters);

    const results: { [key: string]: any[] } = {};
    // loop through item types and execute query for each type, then combine results
    for (const itemType of itemTypes) {
      let query = db.selectFrom(itemType);
      for (const [column, value] of whereStatements) {
        query.where(column as any, "=", value);
      }
      let result = await query.selectAll().execute();
      results[itemType] = result;
      console.log(`Query for ${itemType} returned ${result.length} results`);
    }
    res.status(200).send(JSON.stringify(results));
  } catch (error) {
    console.error("Error getting item list:", error);
    res.status(500).send("Internal server error");
  }
}

export async function createItemHandler(
  req: Request<{ type: string }, {}, CreateItemInput["body"]>,
  res: Response,
) {
  try {
    const itemType = req.params.type as "car" | "animal" | "goods";
    const itemData = req.body;

    const result = await db
      .insertInto(itemType)
      .values(itemData as any)
      .returningAll()
      .executeTakeFirst();

    if (result) {
      console.log(`Created new ${itemType} item with ID ${result.id}`);
      res.status(201).send(JSON.stringify(result));
    } else {
      res.status(500).send("Failed to create item");
    }
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).send("Internal server error");
  }
}

export async function checkoutItemHandler(
  req: Request<CheckoutItemInput["params"], {}, CheckoutItemInput["body"]>,
  res: Response,
) {
  try {
    const itemType = req.params.type as "car" | "animal" | "goods";
    const itemId = Number(req.params.id);
    const { checkout_date, checkout_person, signature, comment } = req.body;

    // check if item exists
    const existingItem = await db
      .selectFrom(itemType)
      .where("id", "=", itemId)
      .executeTakeFirst();

    if (!existingItem) {
      res.status(404).send("Item not found");
      return;
    }

    // update the item
    const result = await db
      .updateTable(itemType)
      .set({
        checkout_date: new Date(checkout_date),
        checkout_person: checkout_person,
        checkout_signature: signature,
        checkout_comment: comment || null,
      })
      .where("id", "=", itemId)
      .returningAll()
      .executeTakeFirst();

    if (result) {
      console.log(
        `Checked out ${itemType} item with ID ${result.id} by ${checkout_person}`,
      );
      res.status(200).send(JSON.stringify(result));
    } else {
      res.status(500).send("Failed to checkout item");
    }
  } catch (error) {
    console.error("Error checking out item:", error);
    res.status(500).send("Internal server error");
  }
}
