import e from "express";
import {
  ZodObject,
  strictObject,
  url,
  string,
  output,
  literal,
  z,
  object,
} from "zod";

const datetime = z.iso.datetime;
const numberFromString = z.coerce.number();
const itemTypeEnum = z.enum(["goods", "car", "animal"]);

const payloadAll = {
  body: strictObject({
    checkin_date: datetime(),
    ref_number: string(),
    contact_person: string(),
    storage_location: string(),
    description: string(),
    photo_url: url().optional(),
  }),
};

const payloadCar = {
  body: strictObject({
    ...payloadAll.body.shape,
    registration_number: string(),
    make_model: string(),
    color: string(),
    condition: string(),
  }),
};

const payloadAnimal = {
  body: strictObject({
    ...payloadAll.body.shape,
    species: string(),
    sex: z.enum(["male", "female", "unknown"]),
    markings: string(),
    special_needs: string(),
  }),
};

const payloadGetItem = {
  params: strictObject({
    type: itemTypeEnum,
    id: numberFromString,
  }),
};

const payloadGetItemList = {
  query: object({
    // generic fields
    type: itemTypeEnum.optional(),
    checkin_date: datetime(),
    ref_number: string(),
    contact_person: string(),
    storage_location: string(),
    description: string(),
    photo_url: url(),

    // car specific fields
    registration_number: string(),
    make_model: string(),
    color: string(),
    condition: string(),

    // animal specific fields
    species: string(),
    sex: z.enum(["male", "female", "unknown"]),
    markings: string(),
    special_needs: string(),
  })
    .partial()
    .optional(),
  // all filter fields are optional, as all items are returned when no filters are specified
};

const payloadCheckout = {
  params: strictObject({
    type: itemTypeEnum,
    id: numberFromString,
  }),
  body: strictObject({
    checkout_date: datetime(),
    checkout_person: string(),
    signature: string(),
    comment: string().optional(),
  }),
};

// Goods have no additional fields
const createGoodsItemSchema = object({
  type: literal("goods"),
  body: payloadAll.body,
});

const createCarItemSchema = object({
  type: literal("car"),
  body: payloadCar.body,
});

const createAnimalItemSchema = object({
  type: literal("animal"),
  body: payloadAnimal.body,
});

const getItemSchema = object({
  ...payloadGetItem,
});

const getItemListSchema = object({
  ...payloadGetItemList,
});

const checkoutItemSchema = object({
  ...payloadCheckout,
});

// Item can be of type Good, Car or Animal
const createItemSchema = z.discriminatedUnion("type", [
  createGoodsItemSchema,
  createCarItemSchema,
  createAnimalItemSchema,
]);

export {
  createItemSchema,
  getItemSchema,
  getItemListSchema,
  checkoutItemSchema,
};

export type CreateItemInput = output<typeof createItemSchema>;
export type GetItemInput = output<typeof getItemSchema>;
export type GetItemListInput = output<typeof getItemListSchema>;
export type CheckoutItemInput = output<typeof checkoutItemSchema>;
