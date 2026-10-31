import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useConsultationTrend } from "@/lib/dashboard-queries";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm text-xs">
      <div className="text-gray-500">{label}</div>
      <div className="font-semibold text-gray-900">{payload[0].value} submissions</div>
    </div>
  );
}

export function ConsultationChart() {
  const { data } = useConsultationTrend();
  const rows = data ?? [];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 h-full flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-1 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Submissions (7d)</h3>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
            <defs>
              <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8246A" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#E8246A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF", fontSize: 9 }} />
            <YAxis domain={[0, 40]} tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF", fontSize: 9 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke="#E8246A" strokeWidth={2} fill="url(#pinkGradient)" activeDot={{ r: 4, fill: "#E8246A" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}