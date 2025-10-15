import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goalAmount: integer("goal_amount").notNull(),
  currentAmount: integer("current_amount").notNull().default(0),
  coverImage: text("cover_image"),
  location: text("location"),
  deadline: timestamp("deadline"),
  isPublic: boolean("is_public").notNull().default(true),
  organizerName: text("organizer_name").notNull(),
  organizerEmail: text("organizer_email").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const contributions = pgTable("contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  amount: integer("amount").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isPledge: boolean("is_pledge").notNull().default(false),
  message: text("message"),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  currentAmount: true,
  createdAt: true,
});

export const insertContributionSchema = createInsertSchema(contributions).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type Contribution = typeof contributions.$inferSelect;
