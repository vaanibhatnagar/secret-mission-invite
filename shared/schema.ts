import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rsvps = pgTable("rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  attendees: integer("attendees").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const insertRsvpSchema = createInsertSchema(rsvps).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  attendees: z.number().min(1, "At least 1 attendee").max(6, "Maximum 6 attendees"),
});

export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;

export const puzzles = [
  {
    id: 1,
    title: "The First Lock",
    subtitle: "Every heist begins with reconnaissance",
    riddle: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. I have roads, but no cars drive there. What am I?",
    answer: "map",
    hint: "You'd need one to plan any heist...",
  },
  {
    id: 2,
    title: "The Second Lock",
    subtitle: "Bypass the security system",
    riddle: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hint: "Be careful not to leave these at the crime scene...",
  },
  {
    id: 3,
    title: "The Final Lock",
    subtitle: "Crack the vault",
    riddle: "I can be cracked, made, told, and played. What am I?",
    answer: "joke",
    hint: "Something that makes people laugh...",
  },
];
