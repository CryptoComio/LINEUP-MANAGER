import { formations, positionNames, type Player, type Team } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Star } from "lucide-react";

interface SoccerFieldProps {
  formation: keyof typeof formations;
  lineup: Record<string, string>;
  players: Player[];
  onPositionAssign: (position: string, playerId: string) => void;
  team?: Team;
}

export function SoccerField({ formation, lineup, players, onPositionAssign, team }: SoccerFieldProps) {
  const positions = formations[formation];
  
  const getPlayerByPosition = (position: string) => {
    const playerId = lineup[position];
    return playerId ? players.find(p => p.id === playerId) : null;
  };

  const getAvailablePlayers = () => {
    const assignedPlayerIds = Object.values(lineup);
    return players.filter(p => p.status === "available" && !assignedPlayerIds.includes(p.id));
  };

  const getPositionCoordinates = (position: string, index: number) => {
    const fieldWidth = 500;
    const fieldHeight = 700;
    
    // Formation-specific positioning
    switch (formation) {
      case "4-4-2":
        return getCoordinates442(position, fieldWidth, fieldHeight);
      case "4-3-3":
        return getCoordinates433(position, fieldWidth, fieldHeight);
      case "3-5-2":
        return getCoordinates352(position, fieldWidth, fieldHeight);
      case "4-5-1":
        return getCoordinates451(position, fieldWidth, fieldHeight);
      case "5-3-2":
        return getCoordinates532(position, fieldWidth, fieldHeight);
      case "4-2-1-3":
        return getCoordinates4213(position, fieldWidth, fieldHeight);
      default:
        return { left: "50%", top: "50%" };
    }
  };

  const getCoordinates442 = (position: string, width: number, height: number) => {
    const positions: Record<string, { left: string; top: string }> = {
      GK: { left: "50%", top: "90%" },
      LB: { left: "15%", top: "70%" },
      CB1: { left: "35%", top: "70%" },
      CB2: { left: "65%", top: "70%" },
      RB: { left: "85%", top: "70%" },
      LM: { left: "10%", top: "45%" },
      CM1: { left: "35%", top: "45%" },
      CM2: { left: "65%", top: "45%" },
      RM: { left: "90%", top: "45%" },
      LF: { left: "35%", top: "20%" },
      RF: { left: "65%", top: "20%" },
    };
    return positions[position] || { left: "50%", top: "50%" };
  };

  const getCoordinates433 = (position: string, width: number, height: number) => {
    const positions: Record<string, { left: string; top: string }> = {
      GK: { left: "50%", top: "90%" },
      LB: { left: "15%", top: "70%" },
      CB1: { left: "35%", top: "70%" },
      CB2: { left: "65%", top: "70%" },
      RB: { left: "85%", top: "70%" },
      CDM: { left: "50%", top: "55%" },
      CM1: { left: "25%", top: "45%" },
      CM2: { left: "75%", top: "45%" },
      LW: { left: "15%", top: "20%" },
      ST: { left: "50%", top: "15%" },
      RW: { left: "85%", top: "20%" },
    };
    return positions[position] || { left: "50%", top: "50%" };
  };

  const getCoordinates352 = (position: string, width: number, height: number) => {
    const positions: Record<string, { left: string; top: string }> = {
      GK: { left: "50%", top: "90%" },
      CB1: { left: "25%", top: "70%" },
      CB2: { left: "50%", top: "70%" },
      CB3: { left: "75%", top: "70%" },
      LWB: { left: "10%", top: "50%" },
      CM1: { left: "30%", top: "45%" },
      CM2: { left: "50%", top: "40%" },
      CM3: { left: "70%", top: "45%" },
      RWB: { left: "90%", top: "50%" },
      ST1: { left: "35%", top: "20%" },
      ST2: { left: "65%", top: "20%" },
    };
    return positions[position] || { left: "50%", top: "50%" };
  };

  const getCoordinates451 = (position: string, width: number, height: number) => {
    const positions: Record<string, { left: string; top: string }> = {
      GK: { left: "50%", top: "90%" },
      LB: { left: "15%", top: "70%" },
      CB1: { left: "35%", top: "70%" },
      CB2: { left: "65%", top: "70%" },
      RB: { left: "85%", top: "70%" },
      LM: { left: "10%", top: "45%" },
      CM1: { left: "25%", top: "40%" },
      CM2: { left: "50%", top: "40%" },
      CM3: { left: "75%", top: "40%" },
      RM: { left: "90%", top: "45%" },
      ST: { left: "50%", top: "15%" },
    };
    return positions[position] || { left: "50%", top: "50%" };
  };

  const getCoordinates532 = (position: string, width: number, height: number) => {
    const positions: Record<string, { left: string; top: string }> = {
      GK: { left: "50%", top: "90%" },
      CB1: { left: "20%", top: "70%" },
      CB2: { left: "35%", top: "75%" },
      CB3: { left: "50%", top: "70%" },
      LWB: { left: "10%", top: "50%" },
      RWB: { left: "90%", top: "50%" },
      CM1: { left: "30%", top: "45%" },
      CM2: { left: "50%", top: "40%" },
      CM3: { left: "70%", top: "45%" },
      ST1: { left: "35%", top: "20%" },
      ST2: { left: "65%", top: "20%" },
    };
    return positions[position] || { left: "50%", top: "50%" };
  };

  const getCoordinates4213 = (position: string, width: number, height: number) => {
    const positions: Record<string, { left: string; top: string }> = {
      GK: { left: "50%", top: "90%" },
      LB: { left: "15%", top: "70%" },
      CB1: { left: "35%", top: "70%" },
      CB2: { left: "65%", top: "70%" },
      RB: { left: "85%", top: "70%" },
      CDM1: { left: "35%", top: "50%" },
      CDM2: { left: "65%", top: "50%" },
      CAM: { left: "50%", top: "35%" },
      LW: { left: "15%", top: "20%" },
      ST: { left: "50%", top: "15%" },
      RW: { left: "85%", top: "20%" },
    };
    return positions[position] || { left: "50%", top: "50%" };
  };

  return (
    <div className="soccer-field rounded-xl p-8 relative mx-auto border-4 border-white max-w-[500px] h-[700px]">
      {/* Field lines overlay */}
      <div className="field-lines"></div>
      
      {/* Goal Areas */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-16 border-2 border-white border-t-0"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-16 border-2 border-white border-b-0"></div>
      
      {/* Goal Posts */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white"></div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white"></div>

      {/* Formation Label */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
        <span data-testid="field-formation">{formation}</span>
      </div>

      {/* Field Info */}
      {team && (
        <div className="absolute top-4 right-4 text-white text-xs space-y-1">
          {team.captainId && (
            <div className="bg-black/50 px-2 py-1 rounded flex items-center">
              <Crown className="h-3 w-3 text-yellow-400 mr-1" />
              <span>Capitano</span>
            </div>
          )}
          {team.motmId && (
            <div className="bg-black/50 px-2 py-1 rounded flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1" />
              <span>MOTM</span>
            </div>
          )}
        </div>
      )}

      {/* Player Positions */}
      {positions.map((position, index) => {
        const coords = getPositionCoordinates(position, index);
        const player = getPlayerByPosition(position);
        const isCaptain = team?.captainId === player?.id;
        const isMotm = team?.motmId === player?.id;
        
        return (
          <div
            key={position}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: coords.left, top: coords.top }}
          >
            {/* Player Jersey */}
            <div className="player-position relative group">
              <div 
                className={`w-16 h-20 rounded-lg border-3 shadow-xl flex flex-col items-center justify-center text-white font-bold transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-2xl ${
                  player ? 'bg-gradient-to-b from-primary to-primary/80 border-white' : 'bg-gradient-to-b from-gray-600 to-gray-700 border-gray-400'
                } ${position === "GK" ? 'bg-gradient-to-b from-yellow-500 to-yellow-600' : ''}`}
                data-testid={`position-${position}`}
              >
                <div className="text-sm font-bold" data-testid={`player-number-${position}`}>
                  {player?.number === 0 ? "?" : player?.number || "-"}
                </div>
                <div className="text-xs font-medium mb-1">
                  {positionNames[position as keyof typeof positionNames] || position}
                </div>
                {position === "GK" ? (
                  <div className="text-xl">🥅</div>
                ) : isCaptain ? (
                  <Crown className="h-5 w-5 text-yellow-300 drop-shadow-lg" />
                ) : isMotm ? (
                  <Star className="h-5 w-5 text-yellow-300 drop-shadow-lg" />
                ) : player ? (
                  <div className="text-xl">⚽</div>
                ) : (
                  <div className="text-xl opacity-50">+</div>
                )}
              </div>

              {/* Player Selector */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-24 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Select
                  value={lineup[position] || "none"}
                  onValueChange={(value) => onPositionAssign(position, value)}
                  data-testid={`select-${position}`}
                >
                  <SelectTrigger className="bg-black/80 border border-white/30 rounded-lg px-2 py-1 text-xs w-full h-8 text-white backdrop-blur-sm hover:bg-black/90 transition-colors">
                    <SelectValue placeholder="Seleziona" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/30 backdrop-blur-md">
                    <SelectItem value="none" className="text-white hover:bg-white/20">Nessuno</SelectItem>
                    {player && (
                      <SelectItem value={player.id} className="text-white hover:bg-white/20">
                        {player.name}
                      </SelectItem>
                    )}
                    {getAvailablePlayers().map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-white hover:bg-white/20">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Player Name */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs text-center max-w-24">
                <div className="bg-black/80 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm border border-white/20 shadow-lg">
                  {player ? (
                    <div className="text-center">
                      <div className="text-white">{player.name}</div>
                      {player.rating && (
                        <div className="text-yellow-400 text-[10px] mt-0.5">★{player.rating}/10</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-300">{positionNames[position as keyof typeof positionNames] || position}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
