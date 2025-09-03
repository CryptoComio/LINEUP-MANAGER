import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Save } from "lucide-react";
import { type Player } from "@shared/schema";

interface PostMatchRatingsProps {
  players: Player[];
  onSaveRatings: (ratings: Record<string, number>) => void;
}

export function PostMatchRatings({ players, onSaveRatings }: PostMatchRatingsProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRatingChange = (playerId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [playerId]: rating
    }));
  };

  const handleSave = () => {
    onSaveRatings(ratings);
  };

  const getStarRating = (playerId: string, starIndex: number) => {
    const rating = ratings[playerId] || 0;
    return rating >= starIndex ? "text-yellow-500 fill-current" : "text-gray-300";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Pagelle Post-Partita
        </CardTitle>
        <p className="text-muted-foreground">
          Valuta le prestazioni dei giocatori (1-10)
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players
            .filter(p => p.status === "available")
            .map((player) => (
              <div key={player.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  {player.photoUrl ? (
                    <img 
                      src={player.photoUrl} 
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {player.number === 0 ? "?" : player.number}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      #{player.number === 0 ? "?" : player.number}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Voto (1-10)</Label>
                  
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(player.id, star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-4 w-4 ${getStarRating(player.id, star)} hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Numeric Input */}
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    placeholder="7.5"
                    value={ratings[player.id] || ""}
                    onChange={(e) => handleRatingChange(
                      player.id, 
                      e.target.value ? parseFloat(e.target.value) : 0
                    )}
                    className="w-full"
                  />

                  {ratings[player.id] && (
                    <div className="text-center">
                      <span className="text-lg font-bold text-primary">
                        {ratings[player.id]}/10
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={handleSave} className="min-w-32">
            <Save className="h-4 w-4 mr-2" />
            Salva Pagelle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}