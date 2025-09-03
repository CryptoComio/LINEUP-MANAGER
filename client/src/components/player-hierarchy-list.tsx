import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Crown, Star, Users, Trophy, Calendar } from "lucide-react";
import type { Player, Team } from "@shared/schema";
import { positionNames } from "@shared/schema";

interface PlayerHierarchyListProps {
  players: Player[];
  team?: Team;
  lineup: Record<string, string>;
  onPlayerEdit: (player: Player) => void;
}

export function PlayerHierarchyList({ players, team, lineup, onPlayerEdit }: PlayerHierarchyListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Position categories mapping
  const positionCategories = {
    goalkeepers: ["GK"],
    defenders: ["LB", "CB", "CB1", "CB2", "CB3", "RB", "LWB", "RWB"],
    midfielders: ["LM", "CM", "CM1", "CM2", "CM3", "CDM", "CDM1", "CDM2", "CAM", "RM"],
    attackers: ["LW", "RW", "LF", "RF", "ST", "ST1", "ST2"]
  };

  // Group players by role and side
  const categorizePlayer = (player: Player) => {
    const pos = player.preferredPosition;
    
    if (positionCategories.goalkeepers.includes(pos)) {
      return { category: "goalkeepers", subCategory: "center", priority: 1 };
    }
    
    if (positionCategories.defenders.includes(pos)) {
      const subCategory = pos.includes("L") || pos.includes("LW") ? "left" : 
                         pos.includes("R") || pos.includes("RW") ? "right" : "center";
      return { category: "defenders", subCategory, priority: 2 };
    }
    
    if (positionCategories.midfielders.includes(pos)) {
      const subCategory = pos.includes("L") ? "left" : 
                         pos.includes("R") ? "right" : "center";
      return { category: "midfielders", subCategory, priority: 3 };
    }
    
    if (positionCategories.attackers.includes(pos)) {
      const subCategory = pos.includes("L") || pos.includes("LW") ? "left" : 
                         pos.includes("R") || pos.includes("RW") ? "right" : "center";
      return { category: "attackers", subCategory, priority: 4 };
    }
    
    return { category: "others", subCategory: "center", priority: 5 };
  };

  // Sort players by entry order (newest first if entryOrder exists, otherwise by ID)
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.entryOrder && b.entryOrder) {
      return a.entryOrder - b.entryOrder; // Earlier entry first
    }
    return a.id.localeCompare(b.id);
  });

  // Group players by category and subcategory
  const groupedPlayers = sortedPlayers.reduce((acc, player) => {
    const { category, subCategory } = categorizePlayer(player);
    
    if (!acc[category]) acc[category] = { left: [], center: [], right: [] };
    acc[category][subCategory as keyof typeof acc[typeof category]].push(player);
    
    return acc;
  }, {} as Record<string, { left: Player[], center: Player[], right: Player[] }>);

  const getPlayerStatusBadge = (player: Player) => {
    const isAssigned = Object.values(lineup).includes(player.id);
    const isCaptain = team?.captainId === player.id;
    const isMotm = team?.motmId === player.id;

    if (isCaptain) return <Badge variant="default" className="bg-yellow-500"><Crown className="h-3 w-3 mr-1" />Capitano</Badge>;
    if (isMotm) return <Badge variant="default" className="bg-purple-500"><Star className="h-3 w-3 mr-1" />MOTM</Badge>;
    if (isAssigned) return <Badge variant="default">Titolare</Badge>;
    
    switch (player.status) {
      case "available":
        return <Badge variant="secondary">Disponibile</Badge>;
      case "absent":
        return <Badge variant="destructive">Assente</Badge>;
      case "injured":
        return <Badge variant="outline">Infortunato</Badge>;
      case "suspended":
        return <Badge variant="outline">Squalificato</Badge>;
      default:
        return <Badge variant="secondary">{player.status}</Badge>;
    }
  };

  const getPositionDisplay = (position: string) => {
    return positionNames[position as keyof typeof positionNames] || position;
  };

  const PlayerCard = ({ player, entryNumber }: { player: Player, entryNumber: number }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPlayerEdit(player)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Player Photo or Number */}
            <div className="relative">
              {player.photoUrl ? (
                <img 
                  src={player.photoUrl} 
                  alt={player.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {player.number}
                </div>
              )}
              {/* Entry Order Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                {entryNumber}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{player.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                #{player.number} • {getPositionDisplay(player.preferredPosition)}
                {player.age && ` • ${player.age} anni`}
              </p>
              {player.notes && (
                <p className="text-xs text-muted-foreground mt-1 italic">{player.notes}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            {getPlayerStatusBadge(player)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CategorySection = ({ title, category, icon }: { title: string, category: string, icon: React.ReactNode }) => {
    const categoryPlayers = groupedPlayers[category];
    if (!categoryPlayers) return null;

    const hasPlayers = categoryPlayers.left.length + categoryPlayers.center.length + categoryPlayers.right.length > 0;
    if (!hasPlayers) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
            <Badge variant="outline" className="ml-2">
              {categoryPlayers.left.length + categoryPlayers.center.length + categoryPlayers.right.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Side */}
            {categoryPlayers.left.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                  ← Sinistro ({categoryPlayers.left.length})
                </h4>
                {categoryPlayers.left.map((player, index) => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    entryNumber={sortedPlayers.findIndex(p => p.id === player.id) + 1}
                  />
                ))}
              </div>
            )}

            {/* Center */}
            {categoryPlayers.center.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                  ⬆ Centro ({categoryPlayers.center.length})
                </h4>
                {categoryPlayers.center.map((player, index) => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    entryNumber={sortedPlayers.findIndex(p => p.id === player.id) + 1}
                  />
                ))}
              </div>
            )}

            {/* Right Side */}
            {categoryPlayers.right.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center">
                  Destro ({categoryPlayers.right.length}) →
                </h4>
                {categoryPlayers.right.map((player, index) => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    entryNumber={sortedPlayers.findIndex(p => p.id === player.id) + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerarchia Giocatori
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Giocatori organizzati per ruolo e posizione secondo l'ordine di registrazione
          </p>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tutti</TabsTrigger>
          <TabsTrigger value="goalkeepers">Portieri</TabsTrigger>
          <TabsTrigger value="defenders">Difensori</TabsTrigger>
          <TabsTrigger value="midfielders">Centrocampisti</TabsTrigger>
          <TabsTrigger value="attackers">Attaccanti</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ScrollArea className="h-[600px]">
            <CategorySection title="Portieri" category="goalkeepers" icon={<div className="text-xl">🥅</div>} />
            <CategorySection title="Difensori" category="defenders" icon={<div className="text-xl">🛡️</div>} />
            <CategorySection title="Centrocampisti" category="midfielders" icon={<div className="text-xl">⚙️</div>} />
            <CategorySection title="Attaccanti" category="attackers" icon={<div className="text-xl">⚽</div>} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="goalkeepers" className="mt-6">
          <CategorySection title="Portieri" category="goalkeepers" icon={<div className="text-xl">🥅</div>} />
        </TabsContent>

        <TabsContent value="defenders" className="mt-6">
          <CategorySection title="Difensori" category="defenders" icon={<div className="text-xl">🛡️</div>} />
        </TabsContent>

        <TabsContent value="midfielders" className="mt-6">
          <CategorySection title="Centrocampisti" category="midfielders" icon={<div className="text-xl">⚙️</div>} />
        </TabsContent>

        <TabsContent value="attackers" className="mt-6">
          <CategorySection title="Attaccanti" category="attackers" icon={<div className="text-xl">⚽</div>} />
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Statistiche Rosa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{players.length}</p>
              <p className="text-sm text-muted-foreground">Totale Giocatori</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {players.filter(p => p.status === "available").length}
              </p>
              <p className="text-sm text-muted-foreground">Disponibili</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">
                {players.filter(p => p.status === "absent").length}
              </p>
              <p className="text-sm text-muted-foreground">Assenti</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {players.filter(p => p.status === "injured").length}
              </p>
              <p className="text-sm text-muted-foreground">Infortunati</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}