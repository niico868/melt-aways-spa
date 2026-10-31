import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, RotateCcw } from "lucide-react";

export type SortType = "text" | "number" | "currency" | "date" | "status" | "boolean" | "none";
type SortDir = "asc" | "desc";

export type SortField<T> = {
  key: string;
  type: SortType;
  value: (row: T) => any;
  statusOrder?: string[];
};

export function useTableSort<T>(fields: SortField<T>[]) {
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(null);

  function toggle(key: string) {
    const f = fields.find(x => x.key === key);
    if (!f || f.type === "none") return;
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  function sorted(rows: T[]): T[] {
    if (!sort) return rows;
    const f = fields.find(x => x.key === sort.key);
    if (!f) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    const arr = [...rows];
    arr.sort((a, b) => {
      const va = f.value(a);
      const vb = f.value(b);
      const aNull = va == null || va === "";
      const bNull = vb == null || vb === "";
      if (aNull && bNull) return 0;
      if (aNull) return 1;
      if (bNull) return -1;
      if (f.type === "status" && f.statusOrder?.length) {
        const ai = f.statusOrder.indexOf(String(va));
        const bi = f.statusOrder.indexOf(String(vb));
        return ((ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)) * dir;
      }
      if (f.type === "number" || f.type === "currency") return (Number(va) - Number(vb)) * dir;
      if (f.type === "date") return (new Date(va).getTime() - new Date(vb).getTime()) * dir;
      if (f.type === "boolean") return ((va ? 1 : 0) - (vb ? 1 : 0)) * dir;
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" }) * dir;
    });
    return arr;
  }

  return { sort, setSort, toggle, sorted };
}

export function SortableTh({
  sortKey, label, type = "text", currentSort, onToggle, className = "",
}: {
  sortKey: string;
  label: string;
  type?: SortType;
  currentSort: { key: string; dir: SortDir } | null;
  onToggle: (k: string) => void;
  className?: string;
}) {
  const active = currentSort?.key === sortKey;
  const dir = active ? currentSort!.dir : null;
  const isRight = className.includes("text-right");
  if (type === "none") {
    return <th className={`font-medium px-3 py-2 ${className || "text-left"}`}>{label}</th>;
  }
  const labels = type === "number" || type === "currency"
    ? { asc: "Lowest → Highest", desc: "Highest → Lowest" }
    : type === "date"
    ? { asc: "Oldest → Newest", desc: "Newest → Oldest" }
    : type === "boolean"
    ? { asc: "No → Yes", desc: "Yes → No" }
    : type === "status"
    ? { asc: "Status order", desc: "Reverse order" }
    : { asc: "A → Z", desc: "Z → A" };
  const title = active
    ? dir === "asc" ? `Sorted ${labels.asc} — click for ${labels.desc}` : `Sorted ${labels.desc} — click to reset`
    : `Sort ${labels.asc}`;
  return (
    <th className={`font-medium px-3 py-2 ${className || "text-left"}`}>
      <button
        type="button"
        onClick={() => onToggle(sortKey)}
        title={title}
        className={`inline-flex items-center gap-1 group hover:text-[#E8246A] ${active ? "text-[#E8246A]" : ""} ${isRight ? "ml-auto" : ""}`}
      >
        <span>{label}</span>
        {active ? (dir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />) : <ArrowUpDown size={11} className="opacity-0 group-hover:opacity-60" />}
      </button>
    </th>
  );
}

export function SortResetChip({ sort, onReset }: { sort: any; onReset: () => void }) {
  if (!sort) return null;
  return (
    <button
      type="button"
      onClick={onReset}
      title="Reset sort to default"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-[10px] text-gray-500 hover:text-[#E8246A] hover:border-[#E8246A]/40"
    >
      <RotateCcw size={11} /> Reset sort
    </button>
  );
}
