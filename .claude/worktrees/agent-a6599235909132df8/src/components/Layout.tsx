import { useState } from "react"
import Icon from "./Icon"
import type { Route } from "../types"

type NavItem = { label: string icon: string module: string badge?: number }

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "grid", module: "Dashboard" },
  { label: "Commercial", icon: "trending-up", module: "Commercial" },
  { label: "Procurement", icon: "shopping-cart", module: "Procurement" },
  { label: "Receiving", icon: "package", module: "Receiving" },
  { label: "Tank Farm", icon: "database", module: "TankFarm" },
  { label: "Prod. Planning", icon: "calendar", module: "ProductionPlanning" },
  { label: "Production", icon: "zap", module: "Production", badge: 2 },
  { label: "Quality", icon: "check-circle", module: "Quality" },
  { label: "Warehouse", icon: "box", module: "Warehouse" },
  { label: "Product Release", icon: "truck", module: "ProductRelease" },
  { label: "Finance", icon: "dollar-sign", module: "Finance" },
  { label: "Maintenance", icon: "tool", module: "Maintenance", badge: 4 },
  { label: "Utilities", icon: "activity", module: "Utilities" },
  { label: "Reports", icon: "bar-chart-2", module: "Reports" },
  { label: "Administration", icon: "settings", module: "Admin" },
]

const moduleLabel = (module: string) =>
  navItems.find((n) => n.module === module)?.label || module

type Props = {
  route: Route
  setRoute: (r: Route) => void
  children: React.ReactNode
}

export default function Layout({ route, setRoute, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col h-screen flex-shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 224,
          background: "var(--sidebar)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--primary)" }}
          >
            <Icon name="flame" size={16} style={{ color: "#fff" }} />
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
              <div
                className="text-xs"
                style={{ color: "rgba(148,163,184,0.7)" }}
              >
                Enterprise ERP
              </div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = item.module === route.module
            return (
              <button
                key={item.module}
                onClick={() =>
                  setRoute({ module: item.module, view: "dashboard" })
                }
                className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all duration-150 w-full"
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
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 9,
                    }}
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

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header
          className="h-14 flex items-center px-6 gap-4 flex-shrink-0"
          style={{
            background: "var(--card)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-500"
          >
            <Icon name="menu" size={16} />
          </button>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--foreground)" }}
            >
              RefineryOS
            </span>
            <Icon name="chevron-right" size={12} />
            <span>{moduleLabel(route.module)}</span>
            {route.view !== "dashboard" && (
              <>
                <Icon name="chevron-right" size={12} />
                <span className="capitalize">{route.view}</span>
              </>
            )}
          </div>
          <div className="flex-1" />
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
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            AK
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
