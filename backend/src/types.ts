import { Generated } from "kysely"

export interface Database {
  car: CarTable
  animal: AnimalTable
  good: GoodTable
}

export interface CarTable {
  id: Generated<number>
  checkin_date: Date
  ref_number: string
  contact_person: string
  storage_location: string
  description: string
  photo_url: string | null

  registration_number: string
  make_model: string
  color: string
  condition: string
}

export interface AnimalTable {
  id: Generated<number>
  checkin_date: Date
  ref_number: string
  contact_person: string
  storage_location: string
  description: string
  photo_url: string | null

  species: string
  sex: "male" | "female" | "unknown"
  markings: string
  special_needs: string
}

export interface GoodTable {
  id: Generated<number>
  checkin_date: Date
  ref_number: string
  contact_person: string
  storage_location: string
  description: string
  photo_url: string | null
}