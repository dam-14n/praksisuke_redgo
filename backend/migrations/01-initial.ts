import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("car")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("checkin_date", "timestamptz", (col) => col.notNull())
    .addColumn("ref_number", "varchar", (col) => col.notNull())
    .addColumn("contact_person", "varchar", (col) => col.notNull())
    .addColumn("storage_location", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar", (col) => col.notNull())
    .addColumn("photo_url", "varchar", (col) => col.defaultTo(null))
    .addColumn("registration_number", "varchar", (col) => col.notNull())
    .addColumn("make_model", "varchar", (col) => col.notNull())
    .addColumn("color", "varchar", (col) => col.notNull())
    .addColumn("condition", "varchar", (col) => col.notNull())

    .addColumn("checkout_date", "timestamptz", (col) => col.defaultTo(null))
    .addColumn("checkout_person", "varchar", (col) => col.defaultTo(null))
    .addColumn("checkout_signature", "varchar", (col) => col.defaultTo(null))
    .addColumn("checkout_comment", "varchar", (col) => col.defaultTo(null))
    .execute();

  await db.schema
    .createTable("animal")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("checkin_date", "timestamptz", (col) => col.notNull())
    .addColumn("ref_number", "varchar", (col) => col.notNull())
    .addColumn("contact_person", "varchar", (col) => col.notNull())
    .addColumn("storage_location", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar", (col) => col.notNull())
    .addColumn("photo_url", "varchar", (col) => col.defaultTo(null))
    .addColumn("species", "varchar", (col) => col.notNull())
    .addColumn("sex", "varchar", (col) => col.notNull())
    .addColumn("markings", "varchar", (col) => col.notNull())
    .addColumn("special_needs", "varchar", (col) => col.notNull())

    .addColumn("checkout_date", "timestamptz", (col) => col.defaultTo(null))
    .addColumn("checkout_person", "varchar", (col) => col.defaultTo(null))
    .addColumn("checkout_signature", "varchar", (col) => col.defaultTo(null))
    .addColumn("checkout_comment", "varchar", (col) => col.defaultTo(null))
    .execute();

  await db.schema
    .createTable("goods")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("checkin_date", "timestamptz", (col) => col.notNull())
    .addColumn("ref_number", "varchar", (col) => col.notNull())
    .addColumn("contact_person", "varchar", (col) => col.notNull())
    .addColumn("storage_location", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar", (col) => col.notNull())
    .addColumn("photo_url", "varchar", (col) => col.defaultTo(null))

    .addColumn("checkout_date", "timestamptz", (col) => col.defaultTo(null))
    .addColumn("checkout_person", "varchar", (col) => col.defaultTo(null))
    .addColumn("checkout_signature", "varchar", (col) => col.defaultTo(null))
    .addColumn("checkout_comment", "varchar", (col) => col.defaultTo(null))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("goods").execute();
  await db.schema.dropTable("animal").execute();
  await db.schema.dropTable("car").execute();
}
