import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  number: integer("number").notNull(),
  preferredPosition: text("preferred_position").notNull(),
  status: text("status").notNull().default("available"), // available, absent, injured, suspended
  age: integer("age"),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  entryOrder: integer("entry_order").default(sql`extract(epoch from now())`),
  rating: integer("rating"), // 1-10 scale for performance rating
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  coach: text("coach"),
  formation: text("formation").notNull().default("4-4-2"),
  captainId: varchar("captain_id"),
  motmId: varchar("motm_id"), // man of the match
  logoUrl: text("logo_url"),
});

export const lineups = pgTable("lineups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull(),
  name: text("name").notNull(),
  formation: text("formation").notNull(),
  positions: jsonb("positions").notNull(), // { GK: "player-id", LB: "player-id", ... }
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertLineupSchema = createInsertSchema(lineups).omit({
  id: true,
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Lineup = typeof lineups.$inferSelect;
export type InsertLineup = z.infer<typeof insertLineupSchema>;

export const formations = {
  "4-4-2": ["GK", "LB", "CB1", "CB2", "RB", "LM", "CM1", "CM2", "RM", "LF", "RF"],
  "4-3-3": ["GK", "LB", "CB1", "CB2", "RB", "CDM", "CM1", "CM2", "LW", "ST", "RW"],
  "3-5-2": ["GK", "CB1", "CB2", "CB3", "LWB", "CM1", "CM2", "CM3", "RWB", "ST1", "ST2"],
  "4-5-1": ["GK", "LB", "CB1", "CB2", "RB", "LM", "CM1", "CM2", "CM3", "RM", "ST"],
  "5-3-2": ["GK", "CB1", "CB2", "CB3", "LWB", "RWB", "CM1", "CM2", "CM3", "ST1", "ST2"],
  "4-2-1-3": ["GK", "LB", "CB1", "CB2", "RB", "CDM1", "CDM2", "CAM", "LW", "ST", "RW"],
};

export const positionNames = {
  GK: "POR",
  LB: "TS", 
  CB: "DC",
  CB1: "DC",
  CB2: "DC", 
  CB3: "DC",
  RB: "TD",
  LWB: "TS",
  RWB: "TD",
  LM: "CDS",
  CM: "COC",
  CM1: "COC",
  CM2: "COC",
  CM3: "COC",
  CDM: "CDS",
  CDM1: "CDS",
  CDM2: "CDS",
  CAM: "COC",
  RM: "CDS",
  LW: "AS",
  RW: "AD",
  LF: "ATT",
  RF: "ATT",
  ST: "ATT",
  ST1: "ATT",
  ST2: "ATT",
};
