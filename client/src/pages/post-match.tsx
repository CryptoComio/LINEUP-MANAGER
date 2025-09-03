import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { PostMatchRatings } from "@/components/post-match-ratings";
import { apiRequest } from "@/lib/queryClient";
import type { Player } from "@shared/schema";

export default function PostMatchPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({ playerId, rating }: { playerId: string; rating: number }) =>
      apiRequest(`/api/players/${playerId}`, {
        method: "PUT",
        body: { rating },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    },
  });

  const handleSaveRatings = async (ratings: Record<string, number>) => {
    try {
      await Promise.all(
        Object.entries(ratings).map(([playerId, rating]) =>
          updatePlayerMutation.mutateAsync({ playerId, rating })
        )
      );
      
      toast({
        title: "Pagelle salvate!",
        description: "Le valutazioni dei giocatori sono state aggiornate con successo.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore nel salvare le pagelle. Riprova.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna al Lineup Manager
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Pagelle Post-Partita</h1>
          <p className="text-muted-foreground">
            Valuta le prestazioni dei giocatori dopo la partita
          </p>
        </div>

        {/* Ratings Component */}
        <PostMatchRatings players={players} onSaveRatings={handleSaveRatings} />
      </div>
    </div>
  );
}