import { X } from "lucide-react";
import { type ReactNode } from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-white shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:max-w-2xl md:max-w-3xl flex flex-col"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 p-2 -mr-2"><X size={18} /></button>
        </div>
        <div className="p-4 overflow-y-auto min-h-0">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-[11px] font-medium text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

export const inputCls = "w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8246A]/30";