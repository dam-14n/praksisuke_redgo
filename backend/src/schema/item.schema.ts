import { strictObject, url, string, output, literal, z } from "zod";
const datetime = z.iso.datetime;

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

// Goods have no additional fields
const createGoodsItemSchema = strictObject({
  type: literal("goods"),
  body: payloadAll.body,
});

const createCarItemSchema = strictObject({
  type: literal("car"),
  body: payloadCar.body,
});

const createAnimalItemSchema = strictObject({
  type: literal("animal"),
  body: payloadAnimal.body,
});

// Item can be of type Good, Car or Animal
const createItemSchema = z.discriminatedUnion("type", [
  createGoodsItemSchema,
  createCarItemSchema,
  createAnimalItemSchema,
]);

export { createItemSchema };

export type CreateItemInput = output<typeof createItemSchema>;
