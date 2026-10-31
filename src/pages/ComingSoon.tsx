import { Clock } from "lucide-react";

export function ComingSoon({ page }: { page: string }) {
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      <div className="text-center">
        <Clock size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-500">{page}</h2>
        <p className="text-sm mt-2">This section is being built — check back soon.</p>
      </div>
    </div>
  );
}