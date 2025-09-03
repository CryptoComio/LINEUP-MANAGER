import { useState } from "react";
import { formations, positionNames, type Player, type Team } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, FolderOpen, Download, Users, Upload, Image } from "lucide-react";

interface PlayerManagementSidebarProps {
  players: Player[];
  team?: Team;
  formation: keyof typeof formations;
  lineup: Record<string, string>;
  onFormationChange: (formation: keyof typeof formations) => void;
  onPlayerEdit: (player: Player) => void;
  onPlayerDelete: (playerId: string) => void;
  onAddPlayer: () => void;
  onTeamUpdate: (teamData: Partial<Team>) => void;
  stats: {
    starters: number;
    bench: number;
    absent: number;
  };
}

export function PlayerManagementSidebar({
  players,
  team,
  formation,
  lineup,
  onFormationChange,
  onPlayerEdit,
  onPlayerDelete,
  onAddPlayer,
  onTeamUpdate,
  stats
}: PlayerManagementSidebarProps) {
  const [teamName, setTeamName] = useState(team?.name || "");
  const [coachName, setCoachName] = useState(team?.coach || "");
  const [logoPreview, setLogoPreview] = useState(team?.logoUrl || "");

  const handleTeamSave = () => {
    onTeamUpdate({ name: teamName, coach: coachName });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        onTeamUpdate({ logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "absent":
        return "secondary";
      case "injured":
        return "destructive";
      case "suspended":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponibile";
      case "absent":
        return "Assente";
      case "injured":
        return "Infortunato";
      case "suspended":
        return "Squalificato";
      default:
        return status;
    }
  };

  const assignedPlayerIds = Object.values(lineup);
  const isPlayerAssigned = (playerId: string) => assignedPlayerIds.includes(playerId);

  return (
    <div className="w-80 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2 flex items-center">
            ⚽ Lineup Manager
          </h1>
          <p className="text-muted-foreground text-sm">Gestisci la formazione della tua squadra</p>
        </div>

        <div className="space-y-6">
          {/* Team Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informazioni Squadra</h3>
            
            {/* Team Logo */}
            <div>
              <Label className="text-sm font-medium">Logo Squadra</Label>
              <div className="flex items-center space-x-4 mt-2">
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo squadra" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    data-testid="button-upload-logo"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {logoPreview ? 'Cambia Logo' : 'Carica Logo'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="team-name" className="text-sm font-medium">Nome Squadra</Label>
              <Input
                id="team-name"
                placeholder="Inserisci nome squadra"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onBlur={handleTeamSave}
                data-testid="input-team-name"
              />
            </div>

            <div>
              <Label htmlFor="coach-name" className="text-sm font-medium">Allenatore</Label>
              <Input
                id="coach-name"
                placeholder="Nome allenatore"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                onBlur={handleTeamSave}
                data-testid="input-coach-name"
              />
            </div>
          </div>

          {/* Formation Selector */}
          <div>
            <Label className="text-sm font-medium">Formazione</Label>
            <Select
              value={formation}
              onValueChange={(value) => onFormationChange(value as keyof typeof formations)}
              data-testid="select-formation"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(formations).map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Player Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Giocatori Selezionati</span>
            <span className="text-primary font-bold" data-testid="selected-players-count">
              {stats.starters}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button className="w-full" data-testid="button-save-lineup">
              <Save className="h-4 w-4 mr-2" />
              Salva Formazione
            </Button>
            
            <Button variant="secondary" className="w-full" data-testid="button-load-lineup">
              <FolderOpen className="h-4 w-4 mr-2" />
              Carica Formazione
            </Button>
            
            <Button variant="outline" className="w-full" data-testid="button-export-lineup">
              <Download className="h-4 w-4 mr-2" />
              Esporta PDF
            </Button>
          </div>

          {/* Player Management */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gestione Giocatori</h3>
              <Button
                onClick={onAddPlayer}
                size="sm"
                data-testid="button-add-player"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Player List */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {players.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-sm">Nessun giocatore nella rosa</p>
                    <Button onClick={onAddPlayer} size="sm" className="mt-2">
                      Aggiungi primo giocatore
                    </Button>
                  </div>
                ) : (
                  players.map((player) => (
                    <Card key={player.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {player.number === 0 ? "?" : player.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{player.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {positionNames[player.preferredPosition as keyof typeof positionNames] || player.preferredPosition}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge
                            variant={getStatusBadgeVariant(player.status)}
                            className="text-xs"
                            data-testid={`player-status-${player.id}`}
                          >
                            {isPlayerAssigned(player.id) ? "Titolare" : getStatusLabel(player.status)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPlayerEdit(player)}
                            data-testid={`button-edit-${player.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPlayerDelete(player.id)}
                            data-testid={`button-delete-${player.id}`}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Match Settings */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Impostazioni Partita</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Capitano</Label>
                <Select
                  value={team?.captainId || "none"}
                  onValueChange={(value) => onTeamUpdate({ captainId: value === "none" ? null : value })}
                  data-testid="select-captain"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona capitano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessuno</SelectItem>
                    {players
                      .filter(p => p.status === "available")
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Migliore in Campo</Label>
                <Select
                  value={team?.motmId || "none"}
                  onValueChange={(value) => onTeamUpdate({ motmId: value === "none" ? null : value })}
                  data-testid="select-motm"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nessuno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nessuno</SelectItem>
                    {players
                      .filter(p => p.status === "available")
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}