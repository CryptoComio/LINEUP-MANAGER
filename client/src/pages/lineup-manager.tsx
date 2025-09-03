import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Player, Team } from "@shared/schema";
import { SoccerField } from "@/components/soccer-field";
import { PlayerManagementSidebar } from "@/components/player-management-sidebar";
import { PlayerModal } from "@/components/player-modal";
import { PlayerHierarchyList } from "@/components/player-hierarchy-list";
import { formations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share, Menu, Users, MapPin, Download, Star } from "lucide-react";
import html2canvas from "html2canvas";

export default function LineupManager() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showHierarchy, setShowHierarchy] = useState(false);
  const [currentFormation, setCurrentFormation] = useState<keyof typeof formations>("4-4-2");
  const [currentLineup, setCurrentLineup] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch players
  const { data: players = [], isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  // Fetch teams
  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const currentTeam = teams[0]; // Use first team for now

  // Player mutations
  const createPlayerMutation = useMutation({
    mutationFn: async (player: Omit<Player, 'id'>) => {
      const response = await apiRequest("POST", "/api/players", player);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({ title: "Giocatore creato con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nella creazione del giocatore", variant: "destructive" });
    }
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({ id, ...player }: Partial<Player> & { id: string }) => {
      const response = await apiRequest("PUT", `/api/players/${id}`, player);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({ title: "Giocatore aggiornato con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento del giocatore", variant: "destructive" });
    }
  });

  const deletePlayerMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/players/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({ title: "Giocatore eliminato con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'eliminazione del giocatore", variant: "destructive" });
    }
  });

  // Team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async (team: Partial<Team> & { id: string }) => {
      const { id, ...teamData } = team;
      const response = await apiRequest("PUT", `/api/teams/${id}`, teamData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Squadra aggiornata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento della squadra", variant: "destructive" });
    }
  });

  const handlePlayerSave = (player: Omit<Player, 'id'> | Player) => {
    if ('id' in player) {
      updatePlayerMutation.mutate(player);
    } else {
      createPlayerMutation.mutate(player);
    }
    setIsPlayerModalOpen(false);
    setSelectedPlayer(null);
  };

  const handlePlayerEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const handlePlayerDelete = (playerId: string) => {
    deletePlayerMutation.mutate(playerId);
  };

  const handlePositionAssign = (position: string, playerId: string) => {
    setCurrentLineup(prev => ({
      ...prev,
      [position]: playerId === "none" ? "" : playerId
    }));
  };

  const handleFormationChange = (formation: keyof typeof formations) => {
    setCurrentFormation(formation);
    if (currentTeam) {
      updateTeamMutation.mutate({
        id: currentTeam.id,
        formation: formation
      });
    }
  };

  const handleOpenAddPlayer = () => {
    setSelectedPlayer(null);
    setIsPlayerModalOpen(true);
  };

  const handleShareLineup = () => {
    const shareUrl = new URL("/share", window.location.origin);
    shareUrl.searchParams.set("team", currentTeam?.id || "");
    shareUrl.searchParams.set("formation", currentFormation);
    shareUrl.searchParams.set("lineup", encodeURIComponent(JSON.stringify(currentLineup)));
    
    navigator.clipboard.writeText(shareUrl.toString());
    toast({ title: "Link di condivisione copiato!", description: "Condividi questo link per mostrare la formazione" });
  };

  const handleExportPNG = async () => {
    const fieldElement = document.querySelector('.soccer-field') as HTMLElement;
    if (!fieldElement) {
      toast({ title: "Errore", description: "Campo non trovato per l'esportazione", variant: "destructive" });
      return;
    }

    try {
      const rect = fieldElement.getBoundingClientRect();
      
      const canvas = await html2canvas(fieldElement, {
        backgroundColor: '#10b981',
        scale: 1.5,
        width: rect.width,
        height: rect.height,
        useCORS: true,
        allowTaint: false,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `formazione-${currentTeam?.name || 'team'}-${currentFormation}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({ title: "Formazione esportata!", description: "L'immagine è stata scaricata con successo" });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: "Errore nell'esportazione", description: "Non è stato possibile esportare l'immagine", variant: "destructive" });
    }
  };

  const getPlayerStats = () => {
    const assignedPlayers = Object.values(currentLineup).filter(Boolean).length;
    const availablePlayers = players.filter(p => p.status === "available").length;
    const absentPlayers = players.filter(p => p.status === "absent").length;
    
    return {
      starters: assignedPlayers,
      bench: availablePlayers - assignedPlayers,
      absent: absentPlayers
    };
  };

  if (playersLoading || teamsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            data-testid="button-toggle-sidebar"
          >
            <Menu className="h-4 w-4" />
            <span className="ml-2">Menu</span>
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-bold" data-testid="team-name">
              {currentTeam?.name || "Lineup Manager"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {currentFormation}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPNG}
              data-testid="button-export-png"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLineup}
              data-testid="button-share-lineup"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block lg:w-80 ${isSidebarOpen ? 'fixed lg:relative inset-y-0 left-0 z-50 w-80' : ''} bg-card border-r border-border transition-all duration-300`}>
          <PlayerManagementSidebar
            players={players}
            team={currentTeam}
            formation={currentFormation}
            lineup={currentLineup}
            onFormationChange={handleFormationChange}
            onPlayerEdit={handlePlayerEdit}
            onPlayerDelete={handlePlayerDelete}
            onAddPlayer={handleOpenAddPlayer}
            onTeamUpdate={(teamData) => currentTeam && updateTeamMutation.mutate({ id: currentTeam.id, ...teamData })}
            stats={getPlayerStats()}
          />
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold" data-testid="team-name">
                {currentTeam?.name || "Lineup Manager"}
              </h2>
              <p className="text-muted-foreground">
                Formazione: <span data-testid="current-formation">{currentFormation}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                data-testid="button-toggle-sidebar"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPNG}
                data-testid="button-export-png"
              >
                <Download className="h-4 w-4 mr-2" />
                Esporta PNG
              </Button>
              <Link href="/post-match">
                <Button variant="outline" data-testid="button-post-match">
                  <Star className="h-4 w-4 mr-2" />
                  Pagelle
                </Button>
              </Link>
              <Button
                onClick={handleShareLineup}
                data-testid="button-share-lineup"
              >
                <Share className="h-4 w-4 mr-2" />
                Condividi
              </Button>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="field" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="field" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Campo di Gioco
              </TabsTrigger>
              <TabsTrigger value="hierarchy" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gerarchia Giocatori
              </TabsTrigger>
            </TabsList>

            <TabsContent value="field">
              <SoccerField
                formation={currentFormation}
                lineup={currentLineup}
                players={players}
                onPositionAssign={handlePositionAssign}
                team={currentTeam}
              />
            </TabsContent>

            <TabsContent value="hierarchy">
              <PlayerHierarchyList
                players={players}
                team={currentTeam}
                lineup={currentLineup}
                onPlayerEdit={handlePlayerEdit}
              />
            </TabsContent>
          </Tabs>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Giocatori Titolari</p>
                  <p className="text-2xl font-bold text-primary" data-testid="stat-starters">
                    {getPlayerStats().starters}
                  </p>
                </div>
                <div className="text-primary text-2xl">⚽</div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Panchina</p>
                  <p className="text-2xl font-bold text-accent" data-testid="stat-bench">
                    {getPlayerStats().bench}
                  </p>
                </div>
                <div className="text-accent text-2xl">🪑</div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Assenti</p>
                  <p className="text-2xl font-bold text-yellow-500" data-testid="stat-absent">
                    {getPlayerStats().absent}
                  </p>
                </div>
                <div className="text-yellow-500 text-2xl">⚠️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Modal */}
      <PlayerModal
        player={selectedPlayer}
        open={isPlayerModalOpen}
        onOpenChange={setIsPlayerModalOpen}
        onSave={handlePlayerSave}
      />
    </div>
  );
}
