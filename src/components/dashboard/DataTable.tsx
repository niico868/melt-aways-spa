import { useMemo, useState, useRef, useEffect, type ReactNode } from "react";
import { Search, Loader2, SlidersHorizontal, MoreVertical, Download, CheckSquare, Square, ArrowUp, ArrowDown, ArrowUpDown, Eye, EyeOff, RotateCcw } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  accessor?: (row: T) => string | number | null | undefined;
  className?: string;
  /** Data type used to pick sort semantics & indicator labels. Defaults to "text". Use "none" to disable sorting. */
  sortType?: "text" | "number" | "currency" | "date" | "status" | "boolean" | "none";
  /** Custom order for status values (top → bottom). If omitted, alphabetical. */
  statusOrder?: string[];
  /** Custom value used for sorting when accessor isn't sufficient. */
  sortValue?: (row: T) => string | number | Date | boolean | null | undefined;
};

type SortDir = "asc" | "desc";

function sortLabels(type: Column<any>["sortType"]) {
  switch (type) {
    case "number":
    case "currency":
      return { asc: "Lowest → Highest", desc: "Highest → Lowest" };
    case "date":
      return { asc: "Oldest → Newest", desc: "Newest → Oldest" };
    case "boolean":
      return { asc: "No → Yes", desc: "Yes → No" };
    case "status":
      return { asc: "Status order", desc: "Reverse order" };
    default:
      return { asc: "A → Z", desc: "Z → A" };
  }
}

export function DataTable<T extends { id: string | number }>({
  rows,
  columns,
  loading,
  error,
  searchable = true,
  searchPlaceholder = "Search…",
  onRowClick,
  empty = "Nothing here yet.",
  rowActions,
  selectable = true,
  exportName = "export",
}: {
  rows: T[] | undefined;
  columns: Column<T>[];
  loading?: boolean;
  error?: unknown;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  empty?: string;
  rowActions?: (row: T) => ReactNode;
  selectable?: boolean;
  exportName?: string;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(null);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const visibleColumns = useMemo(() => columns.filter(c => !hiddenCols.has(c.key)), [columns, hiddenCols]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(row =>
      columns.some(c => {
        const val = c.accessor ? c.accessor(row) : (row as any)[c.key];
        return String(val ?? "").toLowerCase().includes(needle);
      }),
    );
  }, [rows, q, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find(c => c.key === sort.key);
    if (!col || col.sortType === "none") return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    const type = col.sortType ?? "text";
    const getVal = (row: T): any => {
      if (col.sortValue) return col.sortValue(row);
      if (col.accessor) return col.accessor(row);
      return (row as any)[col.key];
    };
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      const aNull = va == null || va === "";
      const bNull = vb == null || vb === "";
      if (aNull && bNull) return 0;
      if (aNull) return 1;
      if (bNull) return -1;
      if (type === "status" && col.statusOrder?.length) {
        const ai = col.statusOrder.indexOf(String(va));
        const bi = col.statusOrder.indexOf(String(vb));
        const an = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
        const bn = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
        return (an - bn) * dir;
      }
      if (type === "number" || type === "currency") {
        return (Number(va) - Number(vb)) * dir;
      }
      if (type === "date") {
        return (new Date(va as any).getTime() - new Date(vb as any).getTime()) * dir;
      }
      if (type === "boolean") {
        return ((va ? 1 : 0) - (vb ? 1 : 0)) * dir;
      }
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" }) * dir;
    });
    return arr;
  }, [filtered, sort, columns]);

  function toggleSort(col: Column<T>) {
    if (col.sortType === "none") return;
    setSort(prev => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  }

  function toggle(id: string | number) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  const allSelected = sorted.length > 0 && sorted.every(r => selected.has(r.id));
  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(sorted.map(r => r.id)));
  }

  function exportCsv(source: T[]) {
    if (source.length === 0) return;
    const header = visibleColumns.map(c => c.header || c.key).join(",");
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const body = source.map(r => visibleColumns.map(c => {
      const v = c.accessor ? c.accessor(r) : (r as any)[c.key];
      return escape(v);
    }).join(",")).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportName}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100 flex-shrink-0 flex items-center gap-2">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8246A]/30"
            />
          </div>
        )}
        <div className="ml-auto flex items-center gap-1">
          {sort && (
            <button
              type="button"
              onClick={() => setSort(null)}
              title="Reset sort to default"
              className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-[10px] text-gray-500 hover:text-[#E8246A] hover:border-[#E8246A]/40"
            >
              <RotateCcw size={11} /> Reset sort
            </button>
          )}
          {selected.size > 0 && (
            <span className="text-[11px] text-gray-500 mr-1">{selected.size} selected</span>
          )}
          <button
            type="button"
            onClick={() => setQ("")}
            title="Clear filter"
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#E8246A] hover:border-[#E8246A]/40"
          >
            <SlidersHorizontal size={13} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#E8246A] hover:border-[#E8246A]/40"
            >
              <MoreVertical size={13} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 text-xs max-h-80 overflow-auto">
                <button
                  onClick={() => { exportCsv(sorted); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download size={12} /> Export visible ({sorted.length})
                </button>
                <button
                  disabled={selected.size === 0}
                  onClick={() => { exportCsv(sorted.filter(r => selected.has(r.id))); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Download size={12} /> Export selected ({selected.size})
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  disabled={selected.size === 0}
                  onClick={() => { setSelected(new Set()); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  Clear selection
                </button>
                <button
                  disabled={!sort}
                  onClick={() => { setSort(null); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <RotateCcw size={12} /> Reset sort
                </button>
                <div className="border-t border-gray-100 my-1" />
                <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-gray-400">Columns</div>
                {columns.filter(c => c.header).map(c => {
                  const hidden = hiddenCols.has(c.key);
                  return (
                    <button
                      key={c.key}
                      onClick={() => {
                        setHiddenCols(prev => {
                          const next = new Set(prev);
                          next.has(c.key) ? next.delete(c.key) : next.add(c.key);
                          return next;
                        });
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2"
                    >
                      {hidden ? <EyeOff size={12} className="text-gray-400" /> : <Eye size={12} className="text-[#E8246A]" />}
                      <span className={hidden ? "text-gray-400 line-through" : ""}>{c.header}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {loading ? (
          <div className="p-8 flex items-center justify-center text-gray-400 text-xs">
            <Loader2 size={16} className="animate-spin mr-2" /> Loading…
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-500">
            {(error as Error).message ?? "Failed to load."}
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">{empty}</div>
        ) : (
          <>
          {/* Mobile stacked cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {sorted.map(row => (
              <div
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`p-3 ${onRowClick ? "active:bg-gray-50 cursor-pointer" : ""}`}
              >
                <div className="flex items-start gap-2">
                  {selectable && (
                    <button
                      onClick={e => { e.stopPropagation(); toggle(row.id); }}
                      className="text-gray-400 hover:text-[#E8246A] pt-0.5"
                    >
                      {selected.has(row.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                  )}
                  <dl className="flex-1 min-w-0 space-y-1">
                    {visibleColumns.map(c => (
                      <div key={c.key} className="flex items-baseline gap-2">
                        <dt className="text-[10px] uppercase tracking-wide text-gray-400 min-w-[70px] flex-shrink-0">{c.header}</dt>
                        <dd className="text-xs text-gray-800 flex-1 min-w-0 break-words">
                          {c.render ? c.render(row) : String((row as any)[c.key] ?? "—")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {rowActions && (
                    <div onClick={e => e.stopPropagation()} className="flex-shrink-0">{rowActions(row)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <table className="hidden md:table w-full text-xs">
            <thead className="bg-gray-50 text-gray-500 sticky top-0">
              <tr>
                {selectable && (
                  <th className="w-8 px-3 py-2">
                    <button onClick={toggleAll} className="text-gray-400 hover:text-[#E8246A]">
                      {allSelected ? <CheckSquare size={13} /> : <Square size={13} />}
                    </button>
                  </th>
                )}
                {visibleColumns.map(c => {
                  const sortable = c.sortType !== "none" && !!c.header;
                  const active = sort?.key === c.key;
                  const dir = active ? sort!.dir : null;
                  const labels = sortLabels(c.sortType);
                  const title = sortable
                    ? active
                      ? dir === "asc"
                        ? `Sorted ${labels.asc} — click for ${labels.desc}`
                        : `Sorted ${labels.desc} — click to reset`
                      : `Sort ${labels.asc}`
                    : undefined;
                  const isRight = (c.className ?? "").includes("text-right");
                  return (
                    <th key={c.key} className={`font-medium px-3 py-2 ${c.className ?? "text-left"}`}>
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c)}
                          title={title}
                          className={`inline-flex items-center gap-1 group hover:text-[#E8246A] ${active ? "text-[#E8246A]" : ""} ${isRight ? "ml-auto" : ""}`}
                        >
                          <span>{c.header}</span>
                          {active ? (
                            dir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />
                          ) : (
                            <ArrowUpDown size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                          )}
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  );
                })}
                {rowActions && <th className="w-10" />}
              </tr>
            </thead>
            <tbody>
              {sorted.map(row => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-t border-gray-100 ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                >
                  {selectable && (
                    <td className="px-3 py-2 w-8" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggle(row.id)} className="text-gray-400 hover:text-[#E8246A]">
                        {selected.has(row.id) ? <CheckSquare size={13} /> : <Square size={13} />}
                      </button>
                    </td>
                  )}
                  {visibleColumns.map(c => (
                    <td key={c.key} className={`px-3 py-2 ${c.className ?? ""}`}>
                      {c.render ? c.render(row) : String((row as any)[c.key] ?? "—")}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-3 py-2 text-right" onClick={e => e.stopPropagation()}>
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </div>
    </div>
  );
}

export function fmtMoney(n: number | null | undefined) {
  if (n == null) return "—";
  return `TT$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmtDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
