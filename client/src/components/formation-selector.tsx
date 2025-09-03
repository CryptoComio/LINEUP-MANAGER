import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formations } from "@shared/schema";

interface FormationSelectorProps {
  value: keyof typeof formations;
  onValueChange: (formation: keyof typeof formations) => void;
  className?: string;
}

export function FormationSelector({ value, onValueChange, className }: FormationSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(newValue) => onValueChange(newValue as keyof typeof formations)}
    >
      <SelectTrigger className={className} data-testid="formation-selector">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(formations).map((formation) => (
          <SelectItem key={formation} value={formation}>
            {formation}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
