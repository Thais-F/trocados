import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

type Props = {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
};

export function MonthNavigator({ year, month, onPrev, onNext }: Props) {
  const rawLabel = new Date(year, month, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

  return (
    <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-surface p-1">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Mês anterior"
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-surface-hover hover:text-foreground"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <span className="min-w-[9rem] px-1 text-center text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={onNext}
        aria-label="Próximo mês"
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-surface-hover hover:text-foreground"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
