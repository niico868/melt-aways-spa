import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, X, Check } from "lucide-react";

export type FilterDef = {
  /** Column key — matches the row property (or a getter). */
  key: string;
  label: string;
  /** Extract the string value from a row (defaults to row[key]). */
  get?: (row: any) => string | number | null | undefined;
  /** Type of filter: multi-select values or free-text contains. */
  type?: "select" | "text";
};

export type ColumnFilters = Record<string, { values?: string[]; text?: string }>;

/** Apply a set of column filters to rows. */
export function applyColumnFilters<T>(rows: T[], defs: FilterDef[], filters: ColumnFilters): T[] {
  return rows.filter(row => {
    for (const d of defs) {
      const f = filters[d.key];
      if (!f) continue;
      const v = d.get ? d.get(row) : (row as any)[d.key];
      const s = String(v ?? "").toLowerCase();
      if (d.type === "text") {
        if (f.text && !s.includes(f.text.toLowerCase())) return false;
      } else {
        if (f.values && f.values.length > 0 && !f.values.includes(String(v ?? ""))) return false;
      }
    }
    return true;
  });
}

export function ColumnFilterButton({
  defs, rows, filters, onChange,
}: {
  defs: FilterDef[];
  rows: any[];
  filters: ColumnFilters;
  onChange: (next: ColumnFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(defs[0]?.key ?? "");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const activeDef = defs.find(d => d.key === active) ?? defs[0];
  const uniqueValues = useMemo(() => {
    if (!activeDef || activeDef.type === "text") return [];
    const set = new Set<string>();
    for (const r of rows) {
      const v = activeDef.get ? activeDef.get(r) : (r as any)[activeDef.key];
      const s = v == null ? "" : String(v);
      if (s) set.add(s);
    }
    return Array.from(set).sort();
  }, [activeDef, rows]);

  const totalActive = Object.values(filters).reduce((sum, f) => {
    if (!f) return sum;
    return sum + (f.values?.length ?? 0) + (f.text ? 1 : 0);
  }, 0);

  function toggleValue(v: string) {
    if (!activeDef) return;
    const cur = new Set(filters[activeDef.key]?.values ?? []);
    cur.has(v) ? cur.delete(v) : cur.add(v);
    onChange({ ...filters, [activeDef.key]: { values: Array.from(cur) } });
  }

  function setText(v: string) {
    if (!activeDef) return;
    onChange({ ...filters, [activeDef.key]: { text: v } });
  }

  function clearAll() { onChange({}); }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`h-9 inline-flex items-center gap-1 px-2.5 text-xs rounded-lg border transition ${
          totalActive > 0 ? "bg-[#FDF2F7] border-[#E8246A] text-[#E8246A]" : "bg-white border-gray-200 text-gray-600 hover:border-[#E8246A]/40"
        }`}
      >
        <Filter size={12} />
        Filter
        {totalActive > 0 && (
          <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#E8246A] text-white text-[10px] font-semibold">
            {totalActive}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-[340px] bg-white border border-gray-200 rounded-xl shadow-xl z-30 flex text-xs">
          {/* Column list */}
          <div className="w-[120px] border-r border-gray-100 p-1 max-h-72 overflow-auto">
            {defs.map(d => {
              const count = (filters[d.key]?.values?.length ?? 0) + (filters[d.key]?.text ? 1 : 0);
              return (
                <button key={d.key}
                  onClick={() => setActive(d.key)}
                  className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between gap-1 ${
                    active === d.key ? "bg-[#FDF2F7] text-[#E8246A] font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  <span className="truncate">{d.label}</span>
                  {count > 0 && <span className="text-[10px] bg-[#E8246A] text-white rounded-full px-1.5">{count}</span>}
                </button>
              );
            })}
          </div>
          {/* Values */}
          <div className="flex-1 p-2 max-h-72 overflow-auto">
            {activeDef?.type === "text" ? (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Contains</div>
                <input
                  autoFocus
                  value={filters[activeDef.key]?.text ?? ""}
                  onChange={e => setText(e.target.value)}
                  placeholder={`Filter ${activeDef.label}…`}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#E8246A]"
                />
              </div>
            ) : (
              <>
                <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 px-1">
                  {activeDef?.label} ({uniqueValues.length})
                </div>
                {uniqueValues.length === 0 && <div className="text-[11px] text-gray-400 px-1 py-2">No values in view.</div>}
                {uniqueValues.map(v => {
                  const checked = filters[activeDef!.key]?.values?.includes(v);
                  return (
                    <label key={v} className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-gray-50 cursor-pointer">
                      <span className={`w-3.5 h-3.5 inline-flex items-center justify-center rounded border ${checked ? "bg-[#E8246A] border-[#E8246A] text-white" : "border-gray-300"}`}>
                        {checked && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span className="truncate">{v}</span>
                    </label>
                  );
                })}
              </>
            )}
          </div>
          {/* Footer */}
          <div className="absolute bottom-0 right-0 left-[120px] border-t border-gray-100 bg-gray-50 rounded-br-xl px-2 py-1 flex items-center justify-between">
            <button onClick={clearAll} className="text-[10px] text-gray-500 hover:text-[#E8246A] inline-flex items-center gap-1">
              <X size={10} /> Clear all
            </button>
            <button onClick={() => setOpen(false)} className="text-[10px] text-[#E8246A] font-medium">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}