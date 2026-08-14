type BadgeProps = { status: string size?: "sm" | "md" }

const colorMap: Record<string, { bg: string text: string }> = {
  // slate
  Draft: { bg: "#f1f5f9", text: "#475569" },
  Pending: { bg: "#f1f5f9", text: "#475569" },
  New: { bg: "#f1f5f9", text: "#475569" },
  // blue
  Confirmed: { bg: "#eff6ff", text: "#1d4ed8" },
  Active: { bg: "#eff6ff", text: "#1d4ed8" },
  Running: { bg: "#eff6ff", text: "#1d4ed8" },
  Pass: { bg: "#eff6ff", text: "#1d4ed8" },
  Released: { bg: "#eff6ff", text: "#1d4ed8" },
  // amber
  "In Progress": { bg: "#fffbeb", text: "#b45309" },
  Processing: { bg: "#fffbeb", text: "#b45309" },
  Planned: { bg: "#fffbeb", text: "#b45309" },
  // green
  Completed: { bg: "#f0fdf4", text: "#059669" },
  Approved: { bg: "#f0fdf4", text: "#059669" },
  Dispatched: { bg: "#f0fdf4", text: "#059669" },
  Paid: { bg: "#f0fdf4", text: "#059669" },
  Normal: { bg: "#f0fdf4", text: "#059669" },
  // purple
  Invoiced: { bg: "#faf5ff", text: "#7c3aed" },
  Partial: { bg: "#faf5ff", text: "#7c3aed" },
  // red
  Cancelled: { bg: "#fef2f2", text: "#dc2626" },
  Failed: { bg: "#fef2f2", text: "#dc2626" },
  Rejected: { bg: "#fef2f2", text: "#dc2626" },
  Critical: { bg: "#fef2f2", text: "#dc2626" },
  Fail: { bg: "#fef2f2", text: "#dc2626" },
  // orange
  "On Hold": { bg: "#fff7ed", text: "#c2410c" },
  Standby: { bg: "#fff7ed", text: "#c2410c" },
  Warning: { bg: "#fff7ed", text: "#c2410c" },
  "Low Stock": { bg: "#fff7ed", text: "#c2410c" },
  "In Stock": { bg: "#f0fdf4", text: "#059669" },
  Unpaid: { bg: "#fef2f2", text: "#dc2626" },
}

export default function Badge({ status, size = "sm" }: BadgeProps) {
  const colors = colorMap[status] || { bg: "#f1f5f9", text: "#475569" }
  const padding = size === "md" ? "3px 10px" : "2px 8px"
  const fontSize = size === "md" ? 12 : 11
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        padding,
        borderRadius: 6,
        fontSize,
        fontWeight: 600,
        whiteSpace: "nowrap" as const,
        display: "inline-block",
        letterSpacing: "0.01em",
      }}
    >
      {status}
    </span>
  )
}
