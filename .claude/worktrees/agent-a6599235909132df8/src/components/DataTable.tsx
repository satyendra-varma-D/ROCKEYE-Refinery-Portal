import { useState, ReactNode } from "react"
import Icon from "./Icon"
import Badge from "./Badge"

export type Column = {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode
  sortable?: boolean
  width?: number
}

type Props = {
  columns: Column[]
  data: Record<string, unknown>[]
  onRowClick?: (row: Record<string, unknown>) => void
  toolbar?: ReactNode
  title?: string
  actions?: ReactNode
  onNew?: () => void
}

const STATUS_KEYS = ["status", "payment", "result"]

export default function DataTable({
  columns,
  data,
  onRowClick,
  toolbar,
  title,
  actions,
  onNew,
}: Props) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [sortKey, setSortKey] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const PAGE_SIZE = 10

  const filtered = data.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase()),
    ),
  )

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] as string | number
        const bv = b[sortKey] as string | number
        if (av < bv) return sortAsc ? -1 : 1
        if (av > bv) return sortAsc ? 1 : -1
        return 0
      })
    : filtered

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortAsc((a) => !a)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const toggleSelect = (i: number) => {
    setSelected((s) => {
      const ns = new Set(s)
      if (ns.has(i)) ns.delete(i)
      else ns.add(i)
      return ns
    })
  }

  const allSelected =
    paged.length > 0 &&
    paged.every((_, i) => selected.has(page * PAGE_SIZE + i))

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {title && (
          <span
            className="text-sm font-semibold"
            style={{
              color: "var(--foreground)",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {title}
          </span>
        )}
        {toolbar}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-xs"
          style={{
            background: "var(--secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <Icon
            name="search"
            size={13}
            style={{ color: "var(--muted-foreground)" }}
          />
          <input
            className="bg-transparent outline-none text-xs flex-1"
            style={{ color: "var(--foreground)" }}
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
          />
        </div>
        <div className="flex-1" />
        {selected.size > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "#eff6ff", color: "#1d4ed8" }}
          >
            {selected.size} selected
            <button
              className="text-xs opacity-60 hover:opacity-100"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </button>
          </div>
        )}
        <button
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          style={{
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
          }}
        >
          <Icon name="download" size={12} /> Export
        </button>
        <button
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          style={{
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
          }}
        >
          <Icon name="filter" size={12} /> Filter
        </button>
        {actions}
        {onNew && (
          <button
            onClick={onNew}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            <Icon name="plus" size={12} /> New
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                background: "#f8fafc",
              }}
            >
              <th className="w-8 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => {
                    if (allSelected) setSelected(new Set())
                    else
                      setSelected(
                        new Set(paged.map((_, i) => page * PAGE_SIZE + i)),
                      )
                  }}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-2.5"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    cursor: col.sortable ? "pointer" : "default",
                    whiteSpace: "nowrap",
                    width: col.width,
                  }}
                >
                  <div
                    className="flex items-center gap-1"
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    {col.label}
                    {col.sortable && (
                      <Icon
                        name={
                          sortKey === col.key
                            ? sortAsc
                              ? "chevron-down"
                              : "chevron-right"
                            : "more-horizontal"
                        }
                        size={10}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-16"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Icon
                    name="box"
                    size={32}
                    style={{ color: "#cbd5e1", margin: "0 auto 8px" }}
                  />
                  <div className="text-sm">No records found</div>
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => {
                const globalIdx = page * PAGE_SIZE + ri
                const isSelected = selected.has(globalIdx)
                return (
                  <tr
                    key={ri}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: isSelected ? "#eff6ff" : undefined,
                    }}
                    onClick={() => onRowClick?.(row)}
                  >
                    <td
                      className="px-4 py-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(globalIdx)}
                      />
                    </td>
                    {columns.map((col) => {
                      const val = row[col.key]
                      let content: ReactNode
                      if (col.render) {
                        content = col.render(val, row)
                      } else if (
                        STATUS_KEYS.includes(col.key) &&
                        typeof val === "string"
                      ) {
                        content = <Badge status={val} />
                      } else {
                        content = (
                          <span
                            style={{
                              fontFamily:
                                typeof val === "number"
                                  ? "JetBrains Mono, monospace"
                                  : undefined,
                            }}
                          >
                            {String(val ?? "")}
                          </span>
                        )
                      }
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-2.5 text-xs"
                          style={{ color: "var(--card-foreground)" }}
                        >
                          {content}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          {search && ` (filtered from ${data.length})`}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="w-7 h-7 rounded text-xs font-medium transition-colors"
              style={{
                background: page === i ? "var(--primary)" : "transparent",
                color: page === i ? "#fff" : "var(--muted-foreground)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
