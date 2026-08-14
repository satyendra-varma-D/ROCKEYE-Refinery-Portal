import { useState } from "react"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

// ─── Data ────────────────────────────────────────────────────────────────────

const productionData = [
  { time: "00:00", crude: 12400, naphtha: 3200, diesel: 5100 },
  { time: "03:00", crude: 13100, naphtha: 3400, diesel: 5300 },
  { time: "06:00", crude: 14200, naphtha: 3800, diesel: 5900 },
  { time: "09:00", crude: 15800, naphtha: 4100, diesel: 6400 },
  { time: "12:00", crude: 16200, naphtha: 4300, diesel: 6700 },
  { time: "15:00", crude: 15600, naphtha: 4200, diesel: 6500 },
  { time: "18:00", crude: 14900, naphtha: 3900, diesel: 6200 },
  { time: "21:00", crude: 14100, naphtha: 3700, diesel: 5800 },
]

const revenueData = [
  { month: "Mar", revenue: 42.1, cost: 28.4 },
  { month: "Apr", revenue: 45.8, cost: 29.1 },
  { month: "May", revenue: 43.2, cost: 27.8 },
  { month: "Jun", revenue: 48.9, cost: 30.2 },
  { month: "Jul", revenue: 52.3, cost: 31.5 },
  { month: "Aug", revenue: 49.7, cost: 30.8 },
]

const tankData = [
  { name: "Crude Oil", value: 78, capacity: 500000, fill: "#1d4ed8" },
  { name: "Naphtha", value: 54, capacity: 120000, fill: "#0891b2" },
  { name: "Diesel", value: 88, capacity: 200000, fill: "#059669" },
  { name: "ATF", value: 41, capacity: 80000, fill: "#7c3aed" },
  { name: "FO", value: 65, capacity: 150000, fill: "#d97706" },
  { name: "LPG", value: 33, capacity: 60000, fill: "#dc2626" },
]

const yieldPieData = [
  { name: "Diesel", value: 38, color: "#059669" },
  { name: "Naphtha", value: 24, color: "#1d4ed8" },
  { name: "ATF", value: 14, color: "#7c3aed" },
  { name: "FO", value: 12, color: "#d97706" },
  { name: "LPG", value: 7, color: "#0891b2" },
  { name: "Loss", value: 5, color: "#e2e8f0" },
]

const activities = [
  {
    id: 1,
    type: "production",
    msg: "CDU-1 throughput reached 16,200 BPD — daily record",
    time: "2 min ago",
    severity: "success",
  },
  {
    id: 2,
    type: "quality",
    msg: "Diesel batch QC-4821 passed all specifications",
    time: "18 min ago",
    severity: "success",
  },
  {
    id: 3,
    type: "alert",
    msg: "Tank T-14 level at 88% — approaching high-high alarm",
    time: "31 min ago",
    severity: "warning",
  },
  {
    id: 4,
    type: "maintenance",
    msg: "P-201 vibration elevated — predictive alert triggered",
    time: "1 hr ago",
    severity: "warning",
  },
  {
    id: 5,
    type: "procurement",
    msg: "Crude cargo MV Titan Star ETA 06:00 — berth confirmed",
    time: "2 hr ago",
    severity: "info",
  },
  {
    id: 6,
    type: "finance",
    msg: "Invoice INV-2024-8831 approved — ₹4.2Cr",
    time: "3 hr ago",
    severity: "info",
  },
]

const pendingTasks = [
  {
    id: 1,
    title: "Approve CDU-2 shutdown plan",
    priority: "high",
    due: "Today 17:00",
    module: "Production",
  },
  {
    id: 2,
    title: "Review tank calibration certificates",
    priority: "medium",
    due: "Tomorrow",
    module: "Tank Farm",
  },
  {
    id: 3,
    title: "Sign off FO cargo Q3 contract",
    priority: "high",
    due: "Today 15:00",
    module: "Commercial",
  },
  {
    id: 4,
    title: "Authorize maintenance work order W-8821",
    priority: "low",
    due: "Aug 14",
    module: "Maintenance",
  },
]

const processUnits = [
  {
    name: "CDU-1",
    status: "running",
    load: 98,
    temp: "342°C",
    desc: "Crude Distillation",
  },
  {
    name: "CDU-2",
    status: "running",
    load: 87,
    temp: "338°C",
    desc: "Crude Distillation",
  },
  {
    name: "VDU-1",
    status: "running",
    load: 92,
    temp: "395°C",
    desc: "Vacuum Distillation",
  },
  {
    name: "NHT",
    status: "running",
    load: 84,
    temp: "280°C",
    desc: "Naphtha Hydrotreater",
  },
  {
    name: "DHT",
    status: "maintenance",
    load: 0,
    temp: "—",
    desc: "Diesel Hydrotreater",
  },
  {
    name: "CCR",
    status: "running",
    load: 76,
    temp: "510°C",
    desc: "Continuous Cat Reformer",
  },
  {
    name: "FCCU",
    status: "running",
    load: 89,
    temp: "520°C",
    desc: "Fluid Cat Cracking",
  },
  {
    name: "SRU",
    status: "standby",
    load: 0,
    temp: "—",
    desc: "Sulfur Recovery",
  },
]

// ─── Nav Items ────────────────────────────────────────────────────────────────

type NavItem = { label: string icon: string active?: boolean badge?: number }

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "grid", active: true },
  { label: "Commercial", icon: "trending-up" },
  { label: "Procurement", icon: "shopping-cart" },
  { label: "Receiving", icon: "package" },
  { label: "Tank Farm", icon: "database" },
  { label: "Prod. Planning", icon: "calendar" },
  { label: "Production", icon: "zap", badge: 2 },
  { label: "Quality", icon: "check-circle" },
  { label: "Warehouse", icon: "box" },
  { label: "Product Release", icon: "truck" },
  { label: "Finance", icon: "dollar-sign" },
  { label: "Maintenance", icon: "tool", badge: 4 },
  { label: "Utilities", icon: "activity" },
  { label: "Reports", icon: "bar-chart-2" },
  { label: "Administration", icon: "settings" },
]

// ─── Icon component (inline SVG) ──────────────────────────────────────────────

function Icon({
  name,
  size = 16,
  className = "",
}: {
  name: string
  size?: number
  className?: string
}) {
  const s = {
    width: size,
    height: size,
    strokeWidth: 1.75,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  const icons: Record<string, JSX.Element> = {
    grid: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    "trending-up": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    "shopping-cart": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    package: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    database: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    zap: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    "check-circle": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    box: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    truck: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    "dollar-sign": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    tool: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    activity: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    "bar-chart-2": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    cpu: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
    "chevron-right": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    "chevron-down": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    "more-horizontal": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
    sun: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    "alert-triangle": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
        <path d="M5 18l.5 1.5L7 20l-1.5.5L5 22l-.5-1.5L3 20l1.5-.5L5 18z" />
      </svg>
    ),
    flame: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
    droplets: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
        <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.56-2.42z" />
      </svg>
    ),
    gauge: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    layers: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    x: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
  }
  return (
    icons[name] || (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <circle cx="12" cy="12" r="9" />
      </svg>
    )
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

type KpiProps = {
  label: string
  value: string
  unit?: string
  change: string
  up: boolean
  icon: string
  color: string
  sparkData?: number[]
}

function KpiCard({
  label,
  value,
  unit,
  change,
  up,
  icon,
  color,
  sparkData,
}: KpiProps) {
  const tinyData = sparkData || [40, 55, 48, 62, 58, 71, 65, 78]
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${color}18` }}
          >
            <Icon name={icon} size={15} className="" style={{ color }} />
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            {label}
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
            up ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
          }`}
        >
          {change}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{
              color: "var(--foreground)",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {value}
          </span>
          {unit && (
            <span
              className="text-xs ml-1"
              style={{ color: "var(--muted-foreground)" }}
            >
              {unit}
            </span>
          )}
        </div>
        <div style={{ width: 64, height: 32 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={tinyData.map((v, i) => ({ v, i }))}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#sg-${label})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── Tank Gauge ───────────────────────────────────────────────────────────────

function TankBar({
  name,
  value,
  fill,
}: {
  name: string
  value: number
  fill: string
}) {
  const color = value > 85 ? "#dc2626" : value > 70 ? "#d97706" : fill
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--card-foreground)" }}
        >
          {name}
        </span>
        <span
          className="text-xs font-bold"
          style={{ color, fontFamily: "JetBrains Mono, monospace" }}
        >
          {value}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--secondary)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Process Unit Status ──────────────────────────────────────────────────────

function ProcessUnit({
  name,
  status,
  load,
  temp,
  desc,
}: typeof processUnits[0]) {
  const statusColor =
    status === "running"
      ? "#059669"
      : status === "maintenance"
        ? "#dc2626"
        : "#d97706"
  const statusLabel =
    status === "running"
      ? "RUNNING"
      : status === "maintenance"
        ? "MAINT"
        : "STANDBY"
  return (
    <div
      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: statusColor,
            boxShadow:
              status === "running" ? `0 0 6px ${statusColor}80` : "none",
          }}
        />
        <div>
          <div
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {name}
          </div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {desc}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div
            className="text-xs font-mono font-medium"
            style={{ color: "var(--foreground)" }}
          >
            {temp}
          </div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Temp
          </div>
        </div>
        {status === "running" ? (
          <div className="text-right">
            <div
              className="text-xs font-mono font-bold"
              style={{ color: statusColor }}
            >
              {load}%
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Load
            </div>
          </div>
        ) : (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: `${statusColor}15`, color: statusColor }}
          >
            {statusLabel}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  collapsed,
  activeNav,
  setActiveNav,
}: {
  collapsed: boolean
  activeNav: string
  setActiveNav: (s: string) => void
}) {
  return (
    <aside
      className="flex flex-col h-screen flex-shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 64 : 224,
        background: "var(--sidebar)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--primary)" }}
        >
          <Icon name="flame" size={16} className="" style={{ color: "#fff" }} />
        </div>
        {!collapsed && (
          <div>
            <div
              className="text-sm font-bold text-white"
              style={{
                fontFamily: "DM Sans, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              RefineryOS
            </div>
            <div className="text-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
              Enterprise ERP
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = item.label === activeNav
          return (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all duration-150 w-full group"
              style={{
                background: isActive ? "rgba(29,78,216,0.9)" : "transparent",
                color: isActive ? "#fff" : "var(--sidebar-foreground)",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon name={item.icon} size={16} />
              {!collapsed && (
                <span className="text-xs font-medium flex-1 whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {!collapsed && item.badge && (
                <span
                  className="text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0"
                  style={{ background: "#ef4444", color: "#fff", fontSize: 9 }}
                >
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span
                  className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#ef4444" }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom user */}
      <div
        className="px-3 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            AK
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                Arjun Kumar
              </div>
              <div
                className="text-xs truncate"
                style={{ color: "rgba(148,163,184,0.6)" }}
              >
                Plant Manager
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ onToggle }: { onToggle: () => void }) {
  return (
    <header
      className="h-14 flex items-center px-6 gap-4 flex-shrink-0"
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-500"
      >
        <Icon name="menu" size={16} />
      </button>

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-1.5 text-xs"
        style={{ color: "var(--muted-foreground)" }}
      >
        <span className="font-medium" style={{ color: "var(--foreground)" }}>
          RefineryOS
        </span>
        <Icon name="chevron-right" size={12} />
        <span>Dashboard</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
        style={{
          background: "var(--secondary)",
          color: "var(--muted-foreground)",
          width: 220,
          cursor: "pointer",
        }}
      >
        <Icon name="search" size={13} />
        <span>Search anything...</span>
        <span className="ml-auto font-mono text-xs opacity-50">⌘K</span>
      </div>

      {/* AI Copilot */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg,#6d28d9,#1d4ed8)",
          color: "#fff",
        }}
      >
        <Icon name="sparkles" size={12} />
        Ask AI
      </button>

      {/* Plant switcher */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-100 transition-colors"
        style={{
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      >
        <Icon name="flame" size={12} style={{ color: "var(--primary)" }} />
        Vadinar Refinery
        <Icon
          name="chevron-down"
          size={11}
          style={{ color: "var(--muted-foreground)" }}
        />
      </div>

      {/* Notifications */}
      <button
        className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
        style={{ color: "var(--muted-foreground)" }}
      >
        <Icon name="bell" size={16} />
        <span
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          style={{ background: "#ef4444" }}
        />
      </button>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
        style={{ background: "var(--primary)", color: "#fff" }}
      >
        AK
      </div>
    </header>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState("Dashboard")

  const kpis: KpiProps[] = [
    {
      label: "Production Today",
      value: "16,241",
      unit: "BPD",
      change: "+3.2%",
      up: true,
      icon: "gauge",
      color: "#1d4ed8",
      sparkData: [60, 62, 68, 72, 74, 80, 77, 85],
    },
    {
      label: "Refinery Efficiency",
      value: "94.7",
      unit: "%",
      change: "+1.1%",
      up: true,
      icon: "zap",
      color: "#059669",
      sparkData: [88, 90, 91, 92, 93, 94, 93, 95],
    },
    {
      label: "Tank Utilization",
      value: "67.3",
      unit: "%",
      change: "-2.4%",
      up: false,
      icon: "database",
      color: "#0891b2",
      sparkData: [72, 71, 70, 69, 68, 70, 69, 67],
    },
    {
      label: "Yield %",
      value: "95.1",
      unit: "%",
      change: "+0.4%",
      up: true,
      icon: "layers",
      color: "#7c3aed",
      sparkData: [93, 94, 94, 95, 94, 95, 95, 95],
    },
    {
      label: "Quality Pass Rate",
      value: "99.2",
      unit: "%",
      change: "+0.3%",
      up: true,
      icon: "check-circle",
      color: "#059669",
      sparkData: [97, 98, 98, 99, 99, 98, 99, 99],
    },
    {
      label: "Revenue",
      value: "₹49.7",
      unit: "Cr",
      change: "-5.0%",
      up: false,
      icon: "dollar-sign",
      color: "#d97706",
      sparkData: [55, 52, 54, 50, 48, 49, 50, 49],
    },
    {
      label: "Maintenance Due",
      value: "7",
      unit: "items",
      change: "+2",
      up: false,
      icon: "tool",
      color: "#dc2626",
      sparkData: [3, 4, 3, 4, 5, 5, 6, 7],
    },
    {
      label: "Utility Consumption",
      value: "84.2",
      unit: "MW",
      change: "+1.8%",
      up: false,
      icon: "activity",
      color: "#0891b2",
      sparkData: [78, 80, 81, 82, 83, 82, 83, 84],
    },
  ]

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <Sidebar
        collapsed={collapsed}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onToggle={() => setCollapsed((c) => !c)} />

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "20px 24px" }}
        >
          {/* Page title */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1
                className="text-lg font-bold tracking-tight"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
                }}
              >
                Executive Dashboard
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                Vadinar Refinery · Aug 12, 2026 · 14:37 IST · Live
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#059669" }}
                />
                All systems nominal
              </div>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                <Icon name="plus" size={12} />
                New Report
              </button>
            </div>
          </div>

          {/* KPI Row */}
          <div
            className="grid gap-3 mb-5"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {kpis.slice(0, 4).map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>
          <div
            className="grid gap-3 mb-5"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {kpis.slice(4).map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>

          {/* Middle: Production chart + Process Units + Tank Farm */}
          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
          >
            {/* Production chart */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: "var(--foreground)",
                    }}
                  >
                    Production Flow — Today
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Crude throughput & product yields (BPD)
                  </div>
                </div>
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {[
                    { c: "#1d4ed8", l: "Crude" },
                    { c: "#0891b2", l: "Naphtha" },
                    { c: "#059669", l: "Diesel" },
                  ].map(({ c, l }) => (
                    <span key={l} className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: c }}
                      />
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={productionData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    {[
                      { id: "crude", c: "#1d4ed8" },
                      { id: "naphtha", c: "#0891b2" },
                      { id: "diesel", c: "#059669" },
                    ].map(({ id, c }) => (
                      <linearGradient
                        key={id}
                        id={id}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={c} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
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
                      background: "#0f172a",
                      border: "none",
                      borderRadius: 8,
                      color: "#f8fafc",
                      fontSize: 12,
                    }}
                    itemStyle={{ color: "#cbd5e1" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="crude"
                    stroke="#1d4ed8"
                    strokeWidth={2}
                    fill="url(#crude)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="naphtha"
                    stroke="#0891b2"
                    strokeWidth={2}
                    fill="url(#naphtha)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="diesel"
                    stroke="#059669"
                    strokeWidth={2}
                    fill="url(#diesel)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Process Units */}
            <div
              className="rounded-xl p-5 flex flex-col"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div
                className="text-sm font-semibold mb-1"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--foreground)",
                }}
              >
                Live Process Status
              </div>
              <div
                className="text-xs mb-3"
                style={{ color: "var(--muted-foreground)" }}
              >
                8 process units
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-0">
                {processUnits.map((u) => (
                  <ProcessUnit key={u.name} {...u} />
                ))}
              </div>
            </div>

            {/* Tank Farm */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div
                className="text-sm font-semibold mb-1"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--foreground)",
                }}
              >
                Tank Farm Overview
              </div>
              <div
                className="text-xs mb-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                Inventory levels by product
              </div>
              <div className="flex flex-col gap-3.5">
                {tankData.map((t) => (
                  <TankBar key={t.name} {...t} />
                ))}
              </div>
            </div>
          </div>

          {/* Revenue chart + Yield Pie + Activities */}
          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: "1.4fr 0.7fr 1.9fr" }}
          >
            {/* Revenue chart */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div
                className="text-sm font-semibold mb-1"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--foreground)",
                }}
              >
                Revenue vs Cost
              </div>
              <div
                className="text-xs mb-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                Last 6 months (₹ Crore)
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={revenueData}
                  margin={{ top: 0, right: 4, left: -20, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
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
                      background: "#0f172a",
                      border: "none",
                      borderRadius: 8,
                      color: "#f8fafc",
                      fontSize: 12,
                    }}
                    itemStyle={{ color: "#cbd5e1" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#1d4ed8"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                  <Bar
                    dataKey="cost"
                    fill="#e2e8f0"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Yield Pie */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div
                className="text-sm font-semibold mb-1"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  color: "var(--foreground)",
                }}
              >
                Yield Mix
              </div>
              <div
                className="text-xs mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                Product yield %
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={yieldPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={52}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {yieldPieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "none",
                      borderRadius: 8,
                      color: "#f8fafc",
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                {yieldPieData
                  .filter((d) => d.name !== "Loss")
                  .map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: d.color }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {d.name}
                      </span>
                      <span
                        className="text-xs font-semibold ml-auto"
                        style={{
                          color: "var(--foreground)",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {d.value}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Activities */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: "var(--foreground)",
                    }}
                  >
                    Recent Activity
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Live plant operations feed
                  </div>
                </div>
                <button
                  className="text-xs font-medium"
                  style={{ color: "var(--primary)" }}
                >
                  View all
                </button>
              </div>
              <div className="flex flex-col gap-0">
                {activities.map((a, i) => {
                  const dotColor =
                    a.severity === "success"
                      ? "#059669"
                      : a.severity === "warning"
                        ? "#d97706"
                        : "#0891b2"
                  return (
                    <div
                      key={a.id}
                      className="flex gap-3 py-2.5"
                      style={{
                        borderBottom:
                          i < activities.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: dotColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--card-foreground)" }}
                        >
                          {a.msg}
                        </p>
                        <span
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {a.time}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Pending Tasks + Alerts */}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {/* Pending Tasks */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: "var(--foreground)",
                    }}
                  >
                    Pending Approvals
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Awaiting your action
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#fef2f2", color: "#dc2626" }}
                >
                  4 urgent
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {pendingTasks.map((t) => {
                  const priColor =
                    t.priority === "high"
                      ? "#dc2626"
                      : t.priority === "medium"
                        ? "#d97706"
                        : "#94a3b8"
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: priColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs font-medium truncate"
                          style={{ color: "var(--foreground)" }}
                        >
                          {t.title}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {t.module} · Due {t.due}
                        </div>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded capitalize"
                        style={{ background: `${priColor}12`, color: priColor }}
                      >
                        {t.priority}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Insights */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 1px 4px rgba(15,23,42,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.2)" }}
                >
                  <Icon
                    name="sparkles"
                    size={14}
                    style={{ color: "#a5b4fc" }}
                  />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    AI Copilot Insights
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(148,163,184,0.7)" }}
                  >
                    3 predictive alerts · updated 2 min ago
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: "alert-triangle",
                    color: "#f59e0b",
                    title: "P-201 bearing failure likely in 48–72 hrs",
                    sub: "Vibration pattern matches 6 prior failure events. Schedule inspection.",
                  },
                  {
                    icon: "droplets",
                    color: "#0891b2",
                    title: "Tank T-14 will hit high alarm by 17:30",
                    sub: "Current fill rate exceeds draw-off by 340 BPH. Reroute to T-11.",
                  },
                  {
                    icon: "trending-up",
                    color: "#34d399",
                    title: "CDU-2 throughput optimization available",
                    sub: "AI model predicts +4.2% yield improvement with temperature adjustment.",
                  },
                ].map((ins, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon
                      name={ins.icon}
                      size={14}
                      style={{ color: ins.color, flexShrink: 0, marginTop: 1 }}
                    />
                    <div>
                      <div
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: "#f1f5f9" }}
                      >
                        {ins.title}
                      </div>
                      <div
                        className="text-xs leading-relaxed"
                        style={{ color: "rgba(148,163,184,0.8)" }}
                      >
                        {ins.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 w-full text-xs font-semibold py-2 rounded-lg transition-all hover:opacity-90"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}
              >
                Open AI Copilot →
              </button>
            </div>
          </div>

          <div style={{ height: 32 }} />
        </main>
      </div>
    </div>
  )
}
