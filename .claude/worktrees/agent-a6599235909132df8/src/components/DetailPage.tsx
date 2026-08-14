import { useState, ReactNode } from "react"
import Icon from "./Icon"
import Badge from "./Badge"

type Breadcrumb = { label: string onClick?: () => void }
type Tab = { label: string content: ReactNode }
type Action = {
  label: string
  icon: string
  onClick: () => void
  variant?: "primary" | "default" | "danger"
}

type Props = {
  title: string
  subtitle?: string
  status?: string
  breadcrumbs: Breadcrumb[]
  tabs: Tab[]
  actions: Action[]
  onBack: () => void
}

export default function DetailPage({
  title,
  subtitle,
  status,
  breadcrumbs,
  tabs,
  actions,
  onBack,
}: Props) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-1.5 text-xs mb-4"
        style={{ color: "var(--muted-foreground)" }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          style={{ color: "var(--primary)" }}
        >
          <Icon name="arrow-left" size={12} /> Back
        </button>
        {breadcrumbs.map((bc, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <Icon name="chevron-right" size={12} />
            {bc.onClick ? (
              <button
                className="hover:opacity-70 transition-opacity"
                style={{ color: "var(--primary)" }}
                onClick={bc.onClick}
              >
                {bc.label}
              </button>
            ) : (
              <span>{bc.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1
              className="text-lg font-bold"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            {status && <Badge status={status} size="md" />}
          </div>
          {subtitle && (
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions.map((action, i) => {
            let bg = "var(--secondary)",
              color = "var(--foreground)",
              border = "1px solid var(--border)"
            if (action.variant === "primary") {
              bg = "var(--primary)"
              color = "#fff"
              border = "none"
            }
            if (action.variant === "danger") {
              bg = "#fef2f2"
              color = "#dc2626"
              border = "1px solid #fecaca"
            }
            return (
              <button
                key={i}
                onClick={action.onClick}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                style={{ background: bg, color, border }}
              >
                <Icon name={action.icon} size={12} />
                {action.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-lg"
        style={{ background: "var(--secondary)", width: "fit-content" }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className="text-xs font-medium px-3 py-1.5 rounded-md transition-all"
            style={{
              background: activeTab === i ? "var(--card)" : "transparent",
              color:
                activeTab === i
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              boxShadow: activeTab === i ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tabs[activeTab]?.content}
    </div>
  )
}
