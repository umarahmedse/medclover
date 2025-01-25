"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GiLiver } from "react-icons/gi";

const organs = [
  { value: "brain", label: "Brain", icon: "🧠" },
  { value: "heart", label: "Heart", icon: "🫀" },
  { value: "lungs", label: "Lungs", icon: "🫁" },
  { value: "kidney", label: "Kidney", icon: "🫘" },
  { value: "stomach", label: "Stomach", icon: "🫃" },
  { value: "liver", label: "Liver", icon: <GiLiver size={40} color="#B22222"/> },
  { value: "eye", label: "Eye", icon: "👁️" },
  { value: "ear", label: "Ear", icon: "👂" },
  { value: "other organ - (not speciied specifically)", label: "Other", icon: "🤔" },
];

interface MultiOrganSelectorProps {
  selectedOrgans: string[];
  onOrganChange: (organs: string[]) => void;
}

export default function MultiOrganSelector({
  selectedOrgans,
  onOrganChange,
}: MultiOrganSelectorProps) {
  const handleOrganToggle = (value: string) => {
    const updatedSelection = selectedOrgans.includes(value)
      ? selectedOrgans.filter((organ) => organ !== value)
      : [...selectedOrgans, value];

    onOrganChange(updatedSelection);
  };

  return (
    <div className="w-full p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Organs For Diagnosis</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {organs.map(({ value, label, icon }) => (
          <div key={value} className="flex flex-col items-center space-y-2">
            <Checkbox
              id={value}
              checked={selectedOrgans.includes(value)}
              onCheckedChange={() => handleOrganToggle(value)}
              className="peer sr-only"
              aria-checked={selectedOrgans.includes(value)}
            />
            <Label
              htmlFor={value}
              className="flex flex-col gap-2 items-center justify-center w-40 h-40 rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-colors"
            >
              <span className="text-4xl">{typeof icon === "string" ? icon : icon}</span>
              <span className="text-[14px] text-center">{label}</span>
            </Label>
          </div>
        ))}
      </div>
      {selectedOrgans.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">Selected organs:</p>
          <p className="font-semibold text-foreground">
            {selectedOrgans
              .map((organ) => organs.find((o) => o.value === organ)?.label)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
