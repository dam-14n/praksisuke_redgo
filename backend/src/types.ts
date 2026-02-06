import { Generated } from "kysely";

export interface Database {
  car: CarTable;
  animal: AnimalTable;
  goods: GoodsTable;
}

export interface CarTable {
  id: Generated<number>;
  checkin_date: Date;
  ref_number: string;
  contact_person: string;
  storage_location: string;
  description: string;
  photo_url: string;

  registration_number: string;
  make_model: string;
  color: string;
  condition: string;

  checkout_date: Date | null;
  checkout_person: string | null;
  checkout_signature: string | null;
  checkout_comment: string | null;
}

export interface AnimalTable {
  id: Generated<number>;
  checkin_date: Date;
  ref_number: string;
  contact_person: string;
  storage_location: string;
  description: string;
  photo_url: string;

  species: string;
  sex: "male" | "female" | "unknown";
  markings: string;
  special_needs: string;

  checkout_date: Date | null;
  checkout_person: string | null;
  checkout_signature: string | null;
  checkout_comment: string | null;
}

export interface GoodsTable {
  id: Generated<number>;
  checkin_date: Date;
  ref_number: string;
  contact_person: string;
  storage_location: string;
  description: string;
  photo_url: string;

  checkout_date: Date | null;
  checkout_person: string | null;
  checkout_signature: string | null;
  checkout_comment: string | null;
}
