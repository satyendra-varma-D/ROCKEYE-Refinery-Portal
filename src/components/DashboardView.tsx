import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"
import { Icon } from "./DesignSystem"

// Multi-colored Swirl Logo for ROCKEYE (copied for convenience)
function RockeyeLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} flex-shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10C65 10 78 20 83 34C80 32 75 31 70 32C60 34 52 42 50 52C48 42 40 34 30 32C25 31 20 32 17 34C22 20 35 10 50 10Z"
        fill="#dc2626"
      />
      <path
        d="M90 50C90 65 80 78 66 83C68 80 69 75 68 70C66 60 58 52 48 50C58 48 66 40 68 30C69 25 68 20 66 17C80 22 90 35 90 50Z"
        fill="#2563eb"
      />
      <path
        d="M50 90C35 90 22 80 17 66C20 68 25 69 30 68C40 66 48 58 50 48C52 58 60 66 70 68C75 69 80 68 83 66C78 80 65 90 50 90Z"
        fill="#16a34a"
      />
      <path
        d="M10 50C10 35 20 22 34 17C32 20 31 25 32 30C34 40 42 48 52 50C42 52 34 60 32 70C31 75 32 80 34 83C20 78 10 65 10 50Z"
        fill="#ca8a04"
      />
      <circle cx="50" cy="50" r="12" fill="#ffffff" />
      <circle cx="50" cy="50" r="6" fill="#ca8a04" />
    </svg>
  )
}

// Edible Oil Production analytics data (MT)
const productionFlowData = [
  { day: "Mon", cpoProcessed: 1200, rbdOlein: 840, rbdStearin: 300, pfad: 60 },
  { day: "Tue", cpoProcessed: 1250, rbdOlein: 875, rbdStearin: 310, pfad: 65 },
  { day: "Wed", cpoProcessed: 1300, rbdOlein: 910, rbdStearin: 320, pfad: 70 },
  { day: "Thu", cpoProcessed: 1100, rbdOlein: 770, rbdStearin: 275, pfad: 55 },
  { day: "Fri", cpoProcessed: 1400, rbdOlein: 980, rbdStearin: 350, pfad: 70 },
  { day: "Sat", cpoProcessed: 1350, rbdOlein: 945, rbdStearin: 335, pfad: 70 },
  { day: "Sun", cpoProcessed: 1280, rbdOlein: 896, rbdStearin: 320, pfad: 64 },
]

const tankInventoryData = [
  {
    name: "CPO T-101",
    value: 85,
    capacity: 5000,
    fill: "#dc2626",
    text: "Crude Palm Oil",
  },
  {
    name: "CPO T-102",
    value: 45,
    capacity: 5000,
    fill: "#f87171",
    text: "Crude Palm Oil",
  },
  {
    name: "RBD PO T-201",
    value: 92,
    capacity: 4000,
    fill: "#ca8a04",
    text: "Olein",
  },
  {
    name: "RBD PS T-202",
    value: 60,
    capacity: 3000,
    fill: "#facc15",
    text: "Stearin",
  },
  {
    name: "PFAD T-301",
    value: 20,
    capacity: 1000,
    fill: "#64748b",
    text: "PFAD",
  },
]

const warehouseInventoryData = [
  { name: "Bleaching Earth", current: 120, max: 200, unit: "MT" },
  { name: "Citric Acid", current: 45, max: 100, unit: "MT" },
  { name: "Phosphoric Acid", current: 80, max: 150, unit: "MT" },
  { name: "Spares/Consumables", current: 3500, max: 5000, unit: "Items" },
]

export function DashboardView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RockeyeLogo className="w-6 h-6" />
              ROCKEYE REFINERY OPERATIONS
            </h1>
            <p className="text-[11px] text-slate-400">
              Live operational telemetry, yields, and inventory analytics
              summary.
            </p>
          </div>
        </div>

        {/* KPI metrics grid */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Inbound Volume (Today)",
              value: "1,250",
              unit: "MT",
              icon: "truck",
              color: "#2563eb",
            },
            {
              label: "Overall Production Yield",
              value: "94.2",
              unit: "%",
              icon: "activity",
              color: "#16a34a",
            },
            {
              label: "Tank Farm Utilization",
              value: "78.4",
              unit: "%",
              icon: "database",
              color: "#ca8a04",
            },
            {
              label: "First-Pass QA Pass Rate",
              value: "98.5",
              unit: "%",
              icon: "check-circle",
              color: "#0284c7",
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50"
                style={{ color: kpi.color }}
              >
                <Icon name={kpi.icon} size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {kpi.label}
                </div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">
                  {kpi.value}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    {kpi.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <div className="col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800">
              Daily Throughput Trend: Processed CPO vs. Refined Yields (MT)
            </h3>
            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={productionFlowData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      fontSize: "11px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area
                    type="monotone"
                    dataKey="cpoProcessed"
                    name="CPO Processed"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.05}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="rbdOlein"
                    name="RBD PO (Olein)"
                    stroke="#ca8a04"
                    fill="#ca8a04"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="rbdStearin"
                    name="RBD PS (Stearin)"
                    stroke="#facc15"
                    fill="#facc15"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operational Alerts & Queue */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800">
              Operational Queue & Alerts
            </h3>

            <div className="flex flex-col gap-3">
              <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex gap-3 items-start">
                <Icon
                  name="alert-triangle"
                  size={16}
                  className="text-orange-500 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    2 Vehicles on QA Hold
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    WBB 5678 B, WCC 1290 C waiting for lab re-test (FFA levels
                    high).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start">
                <Icon name="clock" size={16} className="text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    4 Vehicles Pending Discharge
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Awaiting tank allocation for CPO receipt.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3 items-start">
                <Icon name="tool" size={16} className="text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Critical Maintenance
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Bleacher V-201 vibration sensors indicating abnormal levels.
                    Immediate check required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Tank Farm Inventory */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800">
              Tank Farm Inventory Summary
            </h3>
            <div className="flex flex-col gap-4 mt-2">
              {tankInventoryData.map((t, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end text-xs text-slate-700">
                    <div>
                      <span className="font-bold">{t.name}</span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        {t.text}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[11px]">{t.value}%</span>
                      <span className="text-[9px] text-slate-400 block -mt-1">
                        {((t.value / 100) * t.capacity).toLocaleString()} /{" "}
                        {t.capacity.toLocaleString()} MT
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${t.value}%`, backgroundColor: t.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Inventory */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800">
              Warehouse Chemical Stock
            </h3>
            <div className="flex flex-col gap-5 mt-2">
              {warehouseInventoryData.map((item, idx) => {
                const pct = Math.round((item.current / item.max) * 100)
                const isLow = pct < 30
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs text-slate-700 items-end">
                      <span className="font-bold flex items-center gap-2">
                        {item.name}
                        {isLow && (
                          <span className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                            Reorder
                          </span>
                        )}
                      </span>
                      <span className="text-[11px]">
                        <strong>{item.current.toLocaleString()}</strong> /{" "}
                        {item.max.toLocaleString()} {item.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isLow ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
