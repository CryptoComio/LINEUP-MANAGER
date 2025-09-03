import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerSchema, insertTeamSchema, insertLineupSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Players endpoints
  app.get("/api/players", async (req, res) => {
    const players = await storage.getPlayers();
    res.json(players);
  });

  app.get("/api/players/:id", async (req, res) => {
    const player = await storage.getPlayer(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  });

  app.post("/api/players", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(playerData);
      res.status(201).json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid player data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/players/:id", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.partial().parse(req.body);
      const player = await storage.updatePlayer(req.params.id, playerData);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid player data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    const deleted = await storage.deletePlayer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(204).send();
  });

  // Teams endpoints
  app.get("/api/teams", async (req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });

  app.get("/api/teams/:id", async (req, res) => {
    const team = await storage.getTeam(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const teamData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(teamData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    try {
      const teamData = insertTeamSchema.partial().parse(req.body);
      const team = await storage.updateTeam(req.params.id, teamData);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lineups endpoints
  app.get("/api/lineups", async (req, res) => {
    const teamId = req.query.teamId as string;
    const lineups = await storage.getLineups(teamId);
    res.json(lineups);
  });

  app.get("/api/lineups/:id", async (req, res) => {
    const lineup = await storage.getLineup(req.params.id);
    if (!lineup) {
      return res.status(404).json({ message: "Lineup not found" });
    }
    res.json(lineup);
  });

  app.post("/api/lineups", async (req, res) => {
    try {
      const lineupData = insertLineupSchema.parse(req.body);
      const lineup = await storage.createLineup(lineupData);
      res.status(201).json(lineup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lineup data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/lineups/:id", async (req, res) => {
    try {
      const lineupData = insertLineupSchema.partial().parse(req.body);
      const lineup = await storage.updateLineup(req.params.id, lineupData);
      if (!lineup) {
        return res.status(404).json({ message: "Lineup not found" });
      }
      res.json(lineup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lineup data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
