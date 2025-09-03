import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Player, Team } from "@shared/schema";
import { SoccerField } from "@/components/soccer-field";
import { formations } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Calendar } from "lucide-react";

export default function ShareLineup() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("team");
  const formationParam = params.get("formation") as keyof typeof formations;
  const lineupParam = params.get("lineup");

  // Parse lineup from URL
  const lineup = lineupParam ? JSON.parse(decodeURIComponent(lineupParam)) : {};

  // Fetch players and teams
  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const currentTeam = teams.find(t => t.id === teamId) || teams[0];
  const formation = formationParam || currentTeam?.formation || "4-4-2";

  // Get assigned players
  const assignedPlayers = players.filter(p => Object.values(lineup).includes(p.id));

  // Group players by position category
  const playersByCategory = {
    goalkeepers: assignedPlayers.filter(p => formations[formation].find(pos => lineup[pos] === p.id && pos.includes("GK"))),
    defenders: assignedPlayers.filter(p => formations[formation].find(pos => lineup[pos] === p.id && (pos.includes("B") || pos.includes("CB")))),
    midfielders: assignedPlayers.filter(p => formations[formation].find(pos => lineup[pos] === p.id && (pos.includes("M") || pos.includes("DM") || pos.includes("AM")))),
    attackers: assignedPlayers.filter(p => formations[formation].find(pos => lineup[pos] === p.id && (pos.includes("W") || pos.includes("F") || pos.includes("ST"))))
  };

  if (!currentTeam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Formazione non trovata</h1>
          <p className="text-muted-foreground">Il link di condivisione non è valido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="shared-team-name">
              <Eye className="h-8 w-8" />
              {currentTeam.name}
            </h1>
            <p className="text-muted-foreground">
              Formazione: {formation} • Allenatore: {currentTeam.coach || "Non specificato"}
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("it-IT")}
          </Badge>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Giocatori Schierati</p>
                  <p className="text-2xl font-bold text-primary">{assignedPlayers.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portieri</p>
                  <p className="text-2xl font-bold text-accent">{playersByCategory.goalkeepers.length}</p>
                </div>
                <div className="text-2xl">🥅</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Difensori</p>
                  <p className="text-2xl font-bold text-blue-500">{playersByCategory.defenders.length}</p>
                </div>
                <div className="text-2xl">🛡️</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attaccanti</p>
                  <p className="text-2xl font-bold text-red-500">{playersByCategory.attackers.length}</p>
                </div>
                <div className="text-2xl">⚽</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Soccer Field */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campo di Gioco - {formation}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SoccerField
                formation={formation}
                lineup={lineup}
                players={players}
                onPositionAssign={() => {}} // Read-only
                team={currentTeam}
              />
            </CardContent>
          </Card>
        </div>

        {/* Player Lists */}
        <div className="space-y-6">
          {/* Goalkeepers */}
          {playersByCategory.goalkeepers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🥅 Portieri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playersByCategory.goalkeepers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">#{player.number}</p>
                      </div>
                      <Badge variant="outline">POR</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Defenders */}
          {playersByCategory.defenders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🛡️ Difensori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playersByCategory.defenders.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">#{player.number}</p>
                      </div>
                      <Badge variant="outline">
                        {player.preferredPosition.includes("L") ? "TS" : 
                         player.preferredPosition.includes("R") ? "TD" : "DC"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Midfielders */}
          {playersByCategory.midfielders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚙️ Centrocampisti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playersByCategory.midfielders.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">#{player.number}</p>
                      </div>
                      <Badge variant="outline">
                        {player.preferredPosition.includes("DM") ? "CDS" : "COC"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attackers */}
          {playersByCategory.attackers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚽ Attaccanti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playersByCategory.attackers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">#{player.number}</p>
                      </div>
                      <Badge variant="outline">
                        {player.preferredPosition.includes("L") ? "AS" : 
                         player.preferredPosition.includes("R") ? "AD" : "ATT"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}