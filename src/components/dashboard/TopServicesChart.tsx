import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useTopServices } from "@/lib/dashboard-queries";

export function TopServicesChart() {
  const { data, isLoading } = useTopServices();
  const rows = data ?? [];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col min-h-0">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex-shrink-0">Top services</h3>
      {isLoading && <div className="text-xs text-gray-400 py-2">Loading…</div>}
      {!isLoading && rows.length === 0 && <div className="text-xs text-gray-400 py-2">No sales this month yet.</div>}
      {rows.length > 0 && <div className="flex-1 min-h-0 flex items-center gap-2">
        <div className="w-[110px] h-[110px] flex-shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={rows} dataKey="percentage" nameKey="name" innerRadius={32} outerRadius={52} paddingAngle={1} stroke="none">
                {rows.map((d) => (<Cell key={d.name} fill={d.fill} />))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex-1 min-w-0 space-y-0.5">
          {rows.map((d) => (
            <li key={d.name} className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
              <span className="text-gray-600 truncate">{d.name}</span>
              <span className="font-semibold text-gray-900 ml-auto">{d.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
}