import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { positionNames, type Player } from "@shared/schema";
import { Save, X, Upload, User } from "lucide-react";

interface PlayerModalProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (player: Omit<Player, 'id'> | Player) => void;
}

export function PlayerModal({ player, open, onOpenChange, onSave }: PlayerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    number: 1,
    preferredPosition: "",
    status: "available",
    age: undefined as number | undefined,
    notes: "",
    photoUrl: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        number: player.number,
        preferredPosition: player.preferredPosition,
        status: player.status,
        age: player.age || undefined,
        notes: player.notes || "",
        photoUrl: player.photoUrl || "",
      });
      setPhotoPreview(player.photoUrl || "");
    } else {
      setFormData({
        name: "",
        number: 1,
        preferredPosition: "",
        status: "available",
        age: undefined,
        notes: "",
        photoUrl: "",
      });
      setPhotoPreview("");
    }
  }, [player, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const playerData = {
      ...formData,
      age: formData.age || null,
      notes: formData.notes || null,
      photoUrl: formData.photoUrl || null,
    };

    if (player) {
      onSave({ ...playerData, id: player.id });
    } else {
      onSave(playerData);
    }
  };

  const isFormValid = formData.name.trim() && formData.preferredPosition;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setFormData(prev => ({ ...prev, photoUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="player-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle data-testid="modal-title">
              {player ? "Modifica Giocatore" : "Aggiungi Nuovo Giocatore"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player Photo */}
          <div>
            <Label className="text-sm font-medium">Foto Giocatore</Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Anteprima foto giocatore" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  data-testid="input-photo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-photo"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Carica Foto
                </Button>
                {photoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                    data-testid="button-remove-photo"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rimuovi
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="player-name" className="text-sm font-medium">
              Nome Giocatore
            </Label>
            <Input
              id="player-name"
              placeholder="Inserisci nome"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              data-testid="input-player-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="player-number" className="text-sm font-medium">
                Numero Maglia
              </Label>
              <Select
                value={formData.number ? formData.number.toString() : "none"}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  number: value === "none" ? 0 : parseInt(value) 
                }))}
              >
                <SelectTrigger data-testid="select-player-number">
                  <SelectValue placeholder="Seleziona numero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nessun numero</SelectItem>
                  {Array.from({ length: 99 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="player-age" className="text-sm font-medium">
                Età
              </Label>
              <Input
                id="player-age"
                type="number"
                min="16"
                max="45"
                placeholder="25"
                value={formData.age || ""}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  age: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                data-testid="input-player-age"
              />
            </div>
          </div>


          <div>
            <Label htmlFor="player-position" className="text-sm font-medium">
              Posizione Preferita
            </Label>
            <Select
              value={formData.preferredPosition}
              onValueChange={(value) => setFormData(prev => ({ ...prev, preferredPosition: value }))}
              required
              data-testid="select-player-position"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona posizione" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(positionNames).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="player-status" className="text-sm font-medium">
              Stato
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              data-testid="select-player-status"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponibile</SelectItem>
                <SelectItem value="absent">Assente</SelectItem>
                <SelectItem value="injured">Infortunato</SelectItem>
                <SelectItem value="suspended">Squalificato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="player-notes" className="text-sm font-medium">
              Note
            </Label>
            <Textarea
              id="player-notes"
              placeholder="Aggiungi note sui giocatori..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="h-20 resize-none"
              data-testid="textarea-player-notes"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              data-testid="button-save-player"
            >
              <Save className="h-4 w-4 mr-2" />
              {player ? "Aggiorna" : "Aggiungi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
