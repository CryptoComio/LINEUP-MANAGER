import { type Player, type InsertPlayer, type Team, type InsertTeam, type Lineup, type InsertLineup } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Players
  getPlayers(): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: string): Promise<boolean>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;

  // Lineups
  getLineups(teamId?: string): Promise<Lineup[]>;
  getLineup(id: string): Promise<Lineup | undefined>;
  createLineup(lineup: InsertLineup): Promise<Lineup>;
  updateLineup(id: string, lineup: Partial<InsertLineup>): Promise<Lineup | undefined>;
  deleteLineup(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private players: Map<string, Player>;
  private teams: Map<string, Team>;
  private lineups: Map<string, Lineup>;

  constructor() {
    this.players = new Map();
    this.teams = new Map();
    this.lineups = new Map();

    // Initialize with a default team
    const defaultTeamId = randomUUID();
    this.teams.set(defaultTeamId, {
      id: defaultTeamId,
      name: "FC Champions",
      coach: "Marco Rossi",
      formation: "4-4-2",
      captainId: null,
      motmId: null,
      logoUrl: null,
    });
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const entryOrder = Date.now();
    const player: Player = { 
      ...insertPlayer, 
      id,
      status: insertPlayer.status || "available",
      age: insertPlayer.age || null,
      notes: insertPlayer.notes || null,
      photoUrl: insertPlayer.photoUrl || null,
      entryOrder: insertPlayer.entryOrder || entryOrder,
      rating: insertPlayer.rating || null
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, playerUpdate: Partial<InsertPlayer>): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (!player) return undefined;

    const updated = { ...player, ...playerUpdate };
    this.players.set(id, updated);
    return updated;
  }

  async deletePlayer(id: string): Promise<boolean> {
    return this.players.delete(id);
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = { 
      ...insertTeam, 
      id,
      coach: insertTeam.coach || null,
      formation: insertTeam.formation || "4-4-2",
      captainId: insertTeam.captainId || null,
      motmId: insertTeam.motmId || null,
      logoUrl: insertTeam.logoUrl || null
    };
    this.teams.set(id, team);
    return team;
  }

  async updateTeam(id: string, teamUpdate: Partial<InsertTeam>): Promise<Team | undefined> {
    const team = this.teams.get(id);
    if (!team) return undefined;

    const updated = { ...team, ...teamUpdate };
    this.teams.set(id, updated);
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Lineups
  async getLineups(teamId?: string): Promise<Lineup[]> {
    const lineups = Array.from(this.lineups.values());
    return teamId ? lineups.filter(l => l.teamId === teamId) : lineups;
  }

  async getLineup(id: string): Promise<Lineup | undefined> {
    return this.lineups.get(id);
  }

  async createLineup(insertLineup: InsertLineup): Promise<Lineup> {
    const id = randomUUID();
    const lineup: Lineup = { ...insertLineup, id };
    this.lineups.set(id, lineup);
    return lineup;
  }

  async updateLineup(id: string, lineupUpdate: Partial<InsertLineup>): Promise<Lineup | undefined> {
    const lineup = this.lineups.get(id);
    if (!lineup) return undefined;

    const updated = { ...lineup, ...lineupUpdate };
    this.lineups.set(id, updated);
    return updated;
  }

  async deleteLineup(id: string): Promise<boolean> {
    return this.lineups.delete(id);
  }
}

export const storage = new MemStorage();
