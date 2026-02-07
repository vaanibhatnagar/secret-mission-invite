import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema, puzzles } from "@shared/schema";
import { appendRsvpToSheet } from "./googleSheets";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/rsvp", async (req, res) => {
    try {
      const parsed = insertRsvpSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const rsvp = await storage.createRsvp(parsed.data);

      appendRsvpToSheet(parsed.data.name, parsed.data.attendees).catch((err) => {
        console.error("Google Sheets sync failed (non-blocking):", err);
      });

      return res.json(rsvp);
    } catch (error) {
      console.error("RSVP creation error:", error);
      return res.status(500).json({ error: "Failed to save RSVP" });
    }
  });

  app.get("/api/rsvps", async (_req, res) => {
    try {
      const rsvps = await storage.getRsvps();
      return res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      return res.status(500).json({ error: "Failed to fetch RSVPs" });
    }
  });

  app.post("/api/puzzle/check", (req, res) => {
    const { puzzleId, answer } = req.body;
    const puzzle = puzzles.find((p) => p.id === puzzleId);

    if (!puzzle) {
      return res.status(404).json({ error: "Puzzle not found" });
    }

    const correct =
      answer?.trim().toLowerCase() === puzzle.answer.toLowerCase();
    return res.json({ correct });
  });

  return httpServer;
}
