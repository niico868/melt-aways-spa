import { employeeData } from "@/data/mockData";

export function EmployeeOverview() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 min-w-[260px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Employee overview</h3>
        <a className="text-[10px] text-[#E8246A] hover:underline cursor-pointer">View all</a>
      </div>
      <div>
        {employeeData.map((e) => {
          const pct = Math.round((e.slotsBooked / e.slotsTotal) * 100);
          const avatarCls = e.avatarTone === "pink"
            ? "bg-[#FBEAF0] text-[#E8246A]"
            : "bg-purple-100 text-purple-700";
          return (
            <div key={e.name} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <div className={`${avatarCls} w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center flex-shrink-0`}>
                {e.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-gray-900 leading-tight">{e.name}</div>
                <div className="text-[9px] text-gray-500 mb-1">{e.role}</div>
                <div className="text-[9px] text-gray-400 mb-0.5">{e.slotsBooked} / {e.slotsTotal} slots today</div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div className="bg-[#E8246A] h-1 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}