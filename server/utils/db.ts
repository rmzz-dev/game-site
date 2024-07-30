import { createDatabase } from "db0";
// https://github.com/unjs/db0/issues/62
// import postgresql from "db0/connectors/postgresql";
import postgresql from "./postgresql-connector";

const db = createDatabase(
  postgresql({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as unknown as number,
    database: process.env.DB_DATABASE,
    ssl: true,
  })
);

export async function setup() {
  // Create RoomType table
  await db.sql`CREATE TABLE IF NOT EXISTS RoomType (
        RoomTypeId INTEGER PRIMARY KEY,
        Name VARCHAR NOT NULL
    );`;

  // Create Room table
  await db.sql`CREATE TABLE IF NOT EXISTS Room (
        RoomId SERIAL PRIMARY KEY,
        RoomTypeId INTEGER NOT NULL,
        Name VARCHAR NOT NULL,
        Settings VARCHAR,
        IsActive BOOLEAN NOT NULL,
        LastActivity TIMESTAMP NOT NULL,
        CreatedOn TIMESTAMP NOT NULL,
        FOREIGN KEY (RoomTypeId) REFERENCES RoomType (RoomTypeId)
    );`;

  // Create RoomLog table
  await db.sql`CREATE TABLE IF NOT EXISTS RoomLog (
        RoomLogId SERIAL PRIMARY KEY,
        RoomId INTEGER NOT NULL,
        Message VARCHAR NOT NULL,
        CreatedOn TIMESTAMP NOT NULL,
        FOREIGN KEY (RoomId) REFERENCES Room (RoomId)
    );`;

  // Insert RoomType data
  await db.sql`DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM RoomType WHERE RoomTypeId = 1) THEN
            INSERT INTO RoomType (RoomTypeId, Name) VALUES (1, 'Chat');
        END IF;
    END $$;`;
}
