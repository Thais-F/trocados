import { CATEGORY_COLORS } from "@/lib/colors";
import { CheckIcon } from "./icons";

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorSwatchPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={color}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            value === color
              ? "ring-2 ring-foreground ring-offset-2 ring-offset-surface"
              : "opacity-80 hover:opacity-100"
          }`}
          style={{ backgroundColor: color }}
        >
          {value === color && <CheckIcon className="h-4 w-4 text-white" />}
        </button>
      ))}
    </div>
  );
}
