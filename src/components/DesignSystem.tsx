import React, { useState, useEffect } from "react"
import {
  BaseEntity,
  MasterEntity,
  TransactionEntity,
  AuditTrailEntry,
  ActivityLogEntry,
  CommentEntry,
  AttachmentEntry,
} from "../types"

// Inline SVG Icon Component matching original design
export function Icon({
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
  const icons: Record<string, React.JSX.Element> = {
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
    "chevron-left": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    "more-horizontal": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    "trash-2": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
    copy: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    archive: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    upload: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    printer: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
    "refresh-cw": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    "alert-triangle": (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
      </svg>
    ),
    paperclip: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </svg>
    ),
    eye: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    x: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    filter: (
      <svg viewBox="0 0 24 24" {...s} className={className}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

// ─── Button Component ────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  icon?: string
}

export function Button({
  children,
  variant = "secondary",
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none cursor-pointer focus:outline-none"
  const styles = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 active:scale-[0.98]",
    secondary:
      "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 active:scale-[0.98]",
    danger:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-[0.98]",
    ghost: "text-slate-500 hover:bg-slate-100",
  }

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  )
}

// ─── Input Components ────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-700">{label}</label>
      )}
      <input
        className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 ${
          error ? "border-red-500" : "border-slate-200"
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-red-500 font-medium">{error}</span>
      )}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: string[]
  error?: string
}

export function Select({
  label,
  options,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-700">{label}</label>
      )}
      <select
        className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 ${
          error ? "border-red-500" : "border-slate-200"
        } ${className}`}
        {...props}
      >
        <option value="">Select option...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[10px] text-red-500 font-medium">{error}</span>
      )}
    </div>
  )
}

// ─── Drawer Framework ────────────────────────────────────────────────────────
interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: DrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Content Container */}
      <div className="relative w-[500px] h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 border-l border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            {subtitle && (
              <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 hover:bg-slate-100 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── DataTable Component ─────────────────────────────────────────────────────
interface DataTableProps {
  title: string
  columns: { key: string; label: string }[]
  data: any[]
  onRowClick: (row: any) => void
  onCreateClick: () => void
  onBulkDelete?: (ids: string[]) => void
  onImportClick?: () => void
  onExportClick?: (format: "Excel" | "PDF") => void
  onDuplicateClick?: (row: any) => void
  onArchiveClick?: (row: any) => void

  // External filter & toolbar states
  search: string
  setSearch: (val: string) => void
  selectedStatusFilter: string
  setSelectedStatusFilter: (val: string) => void
  activeColumns: string[]
  setActiveColumns: (val: string[]) => void
  selectedIds: string[]
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export function DataTable({
  title,
  columns,
  data,
  onRowClick,
  onCreateClick,
  onBulkDelete,
  onImportClick,
  onExportClick,
  onDuplicateClick,
  onArchiveClick,
  search,
  setSearch,
  selectedStatusFilter,
  setSelectedStatusFilter,
  activeColumns,
  setActiveColumns,
  selectedIds,
  setSelectedIds,
}: DataTableProps) {
  const [filterMenu, setFilterMenu] = useState(false)
  const [showChooser, setShowChooser] = useState(false)
  const [sortField, setSortField] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const itemsPerPage = 8

  // Filter & Search Logic
  const filteredData = data.filter((row) => {
    const valuesString = Object.values(row)
      .concat(Object.values(row.details || {}))
      .join(" ")
      .toLowerCase()
    const matchesSearch = valuesString.includes(search.toLowerCase())
    const matchesStatus = selectedStatusFilter
      ? row.status === selectedStatusFilter
      : true
    return matchesSearch && matchesStatus
  })

  // Sort Logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    const aVal = (a[sortField] ?? a.details?.[sortField] ?? "").toString()
    const bVal = (b[sortField] ?? b.details?.[sortField] ?? "").toString()
    return sortOrder === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal)
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage))
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedData.map((d) => d.id))
    }
  }

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const exportData = (format: "Excel" | "PDF") => {
    if (onExportClick) onExportClick(format)
    alert(
      `Successfully generated and exported ${title} dataset as ${format} standard template.`,
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Modern Enterprise Table */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="w-10 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === paginatedData.length &&
                    paginatedData.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300"
                />
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                System Code
              </th>
              {columns
                .filter((col) => activeColumns.includes(col.key))
                .map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.key &&
                        (sortOrder === "asc" ? "▲" : "▼")}
                    </div>
                  </th>
                ))}
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 4}
                  className="text-center py-10 text-slate-400"
                >
                  <Icon
                    name="alert-triangle"
                    size={24}
                    className="mx-auto mb-2 opacity-50"
                  />
                  No records found matching criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td
                    className="px-4 py-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td
                    className="px-4 py-3 font-semibold text-blue-700 hover:underline"
                    onClick={() => onRowClick(row)}
                  >
                    {row.code}
                  </td>
                  {columns
                    .filter((col) => activeColumns.includes(col.key))
                    .map((col) => {
                      const val = row[col.key] ?? row.details?.[col.key] ?? "—"

                      // Performance tag badge
                      if (col.key === "performanceTag") {
                        const tag = (val as string) || "—"
                        const tagStyles: Record<string, string> = {
                          High: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                          Average: "bg-amber-50 text-amber-700 border border-amber-200",
                          Low: "bg-red-50 text-red-600 border border-red-200",
                        }
                        const tagDots: Record<string, string> = {
                          High: "bg-emerald-500",
                          Average: "bg-amber-500",
                          Low: "bg-red-500",
                        }
                        return (
                          <td
                            key={col.key}
                            className="px-4 py-3"
                            onClick={() => onRowClick(row)}
                          >
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${tagStyles[tag] || "bg-slate-100 text-slate-600"}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${tagDots[tag] || "bg-slate-400"}`} />
                              {tag}
                            </span>
                          </td>
                        )
                      }

                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 text-slate-700"
                          onClick={() => onRowClick(row)}
                        >
                          {typeof val === "number" ? val.toLocaleString() : val}
                        </td>
                      )
                    })}
                  <td className="px-4 py-3" onClick={() => onRowClick(row)}>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === "Active" ||
                        row.status === "Approved" ||
                        row.status === "Passed Quality Test" ||
                        row.status === "Operational"
                          ? "bg-emerald-50 text-emerald-700"
                          : row.status === "Pending Review" ||
                              row.status === "Awaiting Approvals"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-right relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === row.id ? null : row.id)
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded shadow-sm transition-colors cursor-pointer"
                    >
                      Action
                      <Icon name="chevron-down" size={10} />
                    </button>
                    {openMenuId === row.id && (
                      <div className="absolute right-4 mt-1 w-32 bg-white border border-slate-200 rounded shadow-lg z-50 py-1 flex flex-col text-left">
                        <button
                          onClick={() => {
                            setOpenMenuId(null)
                            onRowClick(row)
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          View Details
                        </button>
                        {onDuplicateClick && (
                          <button
                            onClick={() => {
                              setOpenMenuId(null)
                              onDuplicateClick(row)
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                          >
                            Duplicate
                          </button>
                        )}
                        {onArchiveClick && (
                          <button
                            onClick={() => {
                              setOpenMenuId(null)
                              onArchiveClick(row)
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-55 font-medium cursor-pointer"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50">
        <span className="text-[11px] text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * itemsPerPage, sortedData.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {sortedData.length}
          </span>{" "}
          entries
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 min-h-0"
          >
            <Icon name="chevron-left" size={14} />
          </Button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-6 h-6 rounded text-[11px] font-semibold ${
                currentPage === idx + 1
                  ? "bg-blue-700 text-white"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <Button
            variant="ghost"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 min-h-0"
          >
            <Icon name="chevron-right" size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Form Drawer Component ───────────────────────────────────────────────────
interface FormDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  fields: {
    key: string
    label: string
    type: "text" | "number" | "select" | "date"
    options?: string[]
    required?: boolean
    section: string
  }[]
  initialData?: any
  onSubmit: (data: any) => void
}

export function FormDrawer({
  isOpen,
  onClose,
  title,
  fields,
  initialData,
  onSubmit,
}: FormDrawerProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [collapsedSections, setCollapsedSections] =
    useState<Record<string, boolean>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData.details || initialData || {})
    } else {
      setFormData({})
    }
    setErrors({})
  }, [initialData, isOpen])

  // Group fields by section
  const sections = Array.from(new Set(fields.map((f) => f.section)))

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }))
    }
  }

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSave = () => {
    // Basic field validation
    const tempErrors: Record<string, string> = {}
    fields.forEach((f) => {
      if (f.required && !formData[f.key]) {
        tempErrors[f.key] = `${f.label} is required`
      }
    })

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors)
      return
    }
    onSubmit(formData)
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Complete all details and submit."
    >
      <div className="flex flex-col gap-4 pb-14">
        {sections.map((section) => {
          const sectionFields = fields.filter((f) => f.section === section)
          const isCollapsed = collapsedSections[section] || false

          return (
            <div
              key={section}
              className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50"
            >
              <div
                onClick={() => toggleSection(section)}
                className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 select-none"
              >
                <span className="text-xs font-bold text-slate-800">
                  {section}
                </span>
                <Icon
                  name={isCollapsed ? "chevron-right" : "chevron-down"}
                  size={14}
                  className="text-slate-500"
                />
              </div>

              {!isCollapsed && (
                <div className="p-4 flex flex-col gap-3 bg-white">
                  {sectionFields.map((f) => (
                    <div key={f.key}>
                      {f.type === "select" ? (
                        <Select
                          label={f.label}
                          options={f.options || []}
                          value={formData[f.key] || ""}
                          onChange={(e) =>
                            handleFieldChange(f.key, e.target.value)
                          }
                          error={errors[f.key]}
                        />
                      ) : (
                        <Input
                          label={f.label}
                          type={f.type}
                          value={formData[f.key] || ""}
                          onChange={(e) =>
                            handleFieldChange(f.key, e.target.value)
                          }
                          error={errors[f.key]}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Drawer Sticky Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
        {title.includes("Customer") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Customer details saved as Draft in ROCKEYE.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Save Customer
            </Button>
          </>
        ) : title.includes("Enquiry") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Enquiry details saved as Draft in ROCKEYE.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Submit Enquiry
            </Button>
          </>
        ) : title.includes("Quotation") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Quotation details saved as Draft in ROCKEYE.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Quotation submitted for approval in ROCKEYE.")
                onClose()
              }}
            >
              Submit for Approval
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Save & Send to Customer
            </Button>
          </>
        ) : title.includes("Contract") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Contract details saved as Draft.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Contract submitted for approval workflow.")
                onClose()
              }}
            >
              Submit for Approval
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Contract approved.")
                onClose()
              }}
            >
              Approve
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Save Contract
            </Button>
          </>
        ) : title.includes("Sales Order") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Sales Order details saved as Draft in ROCKEYE.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Sales Order released to Production Planning.")
                onClose()
              }}
            >
              Release to Production
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Save Sales Order
            </Button>
          </>
        ) : title.includes("Supplier") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Supplier details saved as Draft in ROCKEYE.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Save Supplier
            </Button>
          </>
        ) : title.includes("Requisition") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Requisition details saved as Draft in ROCKEYE.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Submit for Approval
            </Button>
          </>
        ) : title.includes("Procurement Contract") ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert("Procurement Contract saved as Draft.")
                onClose()
              }}
            >
              Save Draft
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Submit for Approval
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => setFormData({})}>
              Reset
            </Button>
            <Button variant="primary" icon="check" onClick={handleSave}>
              Save & Submit
            </Button>
          </>
        )}
      </div>
    </Drawer>
  )
}

function TraceabilityFlowchart({
  activeCode,
  customer,
  enquiryCode,
  quotationCode,
  contractCode,
  salesOrderCode,
}: {
  activeCode: string
  customer?: string
  enquiryCode?: string
  quotationCode?: string
  contractCode?: string
  salesOrderCode?: string
}) {
  const steps = [
    {
      label: "Customer",
      code: customer || "HPCL",
      icon: "users",
      highlight: true,
    },
    {
      label: "Customer Enquiry",
      code: enquiryCode || "ENQ-2026-8821",
      icon: "file-text",
      highlight:
        activeCode.startsWith("ENQ-") ||
        activeCode.startsWith("QTN-") ||
        activeCode.startsWith("CON-") ||
        activeCode.startsWith("SO-"),
    },
    {
      label: "Quotation",
      code: quotationCode || "QTN-2026-9042",
      icon: "dollar-sign",
      highlight:
        activeCode.startsWith("QTN-") ||
        activeCode.startsWith("CON-") ||
        activeCode.startsWith("SO-"),
    },
    {
      label: "Sales Contract",
      code: contractCode || "CON-2026-004",
      icon: "book",
      highlight: activeCode.startsWith("CON-") || activeCode.startsWith("SO-"),
    },
    {
      label: "Sales Order",
      code: salesOrderCode || "SO-2026-904",
      icon: "shopping-cart",
      highlight: activeCode.startsWith("SO-"),
    },
    {
      label: "Production Planning",
      code: "Released to Plan",
      icon: "zap",
      highlight: activeCode.startsWith("SO-"),
    },
  ]

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon name="git-commit" size={12} className="text-slate-500" />
        ROCKEYE COMMERCIAL FLOW TRACEABILITY MAP
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-1">
        {steps.map((step, idx) => {
          const isActiveNode = activeCode === step.code
          return (
            <div
              key={idx}
              className="flex items-center gap-4 flex-1 min-w-[130px]"
            >
              <div
                className={`flex-1 p-3 rounded-lg border flex flex-col gap-1 transition-all ${
                  isActiveNode
                    ? "bg-blue-50 border-blue-300 shadow-sm"
                    : step.highlight
                      ? "bg-emerald-50/70 border-emerald-250 text-slate-800"
                      : "bg-white border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    {step.label}
                  </span>
                  {isActiveNode ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  ) : step.highlight ? (
                    <Icon
                      name="check-square"
                      size={11}
                      className="text-emerald-600"
                    />
                  ) : null}
                </div>
                <div
                  className={`text-xs font-bold ${
                    isActiveNode
                      ? "text-blue-800"
                      : step.highlight
                        ? "text-slate-800"
                        : "text-slate-400"
                  }`}
                >
                  {step.code}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block text-slate-300">
                  <Icon name="chevron-right" size={14} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DetailView({
  entity,
  fields,
  onClose,
  onEditClick,
  onApprovalStatusChange,
  db,
  onAcceptEnquiry,
  onRejectEnquiry,
  onAcceptQuotation,
  onModifyQuotation,
  onRejectQuotation,
}: DetailViewProps & {
  db?: any
  onAcceptEnquiry?: (entity: any) => void
  onRejectEnquiry?: (entity: any) => void
  onAcceptQuotation?: (entity: any) => void
  onModifyQuotation?: (entity: any) => void
  onRejectQuotation?: (entity: any) => void
}) {
  // Tab states
  const isCustomer = entity.code?.startsWith("CUST-")
  const tabs = isCustomer
    ? ["Details", "Enquiries", "Quotations", "Sales Orders", "Notes"]
    : ["Details", "Notes"]

  const [activeTab, setActiveTab] = useState("Details")
  const [commentInput, setCommentInput] = useState("")
  const [comments, setComments] = useState<any[]>(entity.comments || [])
  const [attachments, setAttachments] = useState<any[]>(
    entity.attachments || [],
  )

  const customerName = entity.name || entity.details?.name || ""

  const getAssociatedRecords = (trxKey: string) => {
    if (!db) return []
    const commercialMod = db.find((m: any) => m.key === "commercial")
    const transaction = commercialMod?.transactions?.find((t: any) => t.key === trxKey)
    const data = transaction?.defaultData || []
    return data.filter(
      (item: any) =>
        item.details?.customer === customerName ||
        item.details?.name === customerName
    )
  }

  const enquiries = getAssociatedRecords("enquiry")
  const quotations = getAssociatedRecords("quotation")
  const salesOrdersList = getAssociatedRecords("salesorder")

  const handleAddComment = () => {
    if (!commentInput.trim()) return
    const newComment = {
      id: Math.random().toString(),
      author: "Demo User",
      avatar: "DU",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      text: commentInput,
    }
    setComments([newComment, ...comments])
    setCommentInput("")
  }

  // Group fields by section
  const sections: Record<string, typeof fields> = {}
  fields.forEach((f) => {
    const sec = (f as any).section || "General Information"
    if (!sections[sec]) sections[sec] = []
    sections[sec].push(f)
  })

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 select-none">
        <div className="p-5 border-b border-slate-100 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Record Registry
          </span>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            {entity.code}
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold truncate">
            {entity.name ||
              (entity as any).details?.name ||
              (entity as any).details?.customer ||
              "System Record"}
          </span>
        </div>

        {/* Navigation Tabs List */}
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{tab}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* RIGHT WORKSPACE AREA */}
      <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
        {/* Main Work Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Header Card (Clean Text Title + Subtitle) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-row items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {entity.code}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {entity.name ||
                  (entity as any).details?.name ||
                  (entity as any).details?.customer ||
                  (entity as any).details?.supplier ||
                  "System General Item"}
              </p>
            </div>

            {entity.code?.startsWith("ENQ-") && (entity.workflowStep !== "Accepted" && entity.workflowStep !== "Rejected") && (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  icon="check"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5"
                  onClick={() => onAcceptEnquiry && onAcceptEnquiry(entity)}
                >
                  Accept & Quote
                </Button>
                <Button
                  variant="danger"
                  icon="x"
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5"
                  onClick={() => onRejectEnquiry && onRejectEnquiry(entity)}
                >
                  Reject
                </Button>
              </div>
            )}

            {entity.code?.startsWith("QTN-") && (entity.status !== "Approved" && entity.status !== "Rejected" && entity.workflowStep !== "Approved") && (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  icon="check"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5"
                  onClick={() => onAcceptQuotation && onAcceptQuotation(entity)}
                >
                  Accept & Create SO
                </Button>
                <Button
                  variant="secondary"
                  icon="edit"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-750 font-bold px-3 py-1.5"
                  onClick={() => onModifyQuotation && onModifyQuotation(entity)}
                >
                  Modify (New Version)
                </Button>
                <Button
                  variant="danger"
                  icon="x"
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5"
                  onClick={() => onRejectQuotation && onRejectQuotation(entity)}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1">
            {activeTab === "Details" && (
              <div className="flex flex-col gap-6">
                {Object.entries(sections).map(([sectionName, secFields]) => (
                  <div
                    key={sectionName}
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:border-blue-100/50"
                  >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                      <div className="w-1.5 h-6 rounded-full bg-blue-600 shadow-sm shadow-blue-600/30" />
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {sectionName}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                      {secFields.map((f) => {
                        const val =
                          entity.details?.[f.key] ??
                          (entity as any)[f.key] ??
                          "—"
                        return (
                          <div
                            key={f.key}
                            className="bg-slate-50/40 hover:bg-slate-50 rounded-xl p-3 border border-slate-100/70 flex flex-col gap-0.5 transition-all"
                          >
                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                              {f.label}
                            </span>
                            <span className="font-bold text-slate-800 text-[13px] tracking-tight leading-tight whitespace-normal break-words">
                              {typeof val === "number"
                                ? val.toLocaleString()
                                : val}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Enquiries" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Enquiry Code</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Required</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Quantity (MT)</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Target Delivery</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {enquiries.map((enq: any) => (
                      <tr key={enq.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-semibold text-blue-600 font-mono">{enq.code}</td>
                        <td className="px-4 py-2.5">{enq.details?.product}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{enq.details?.quantity}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{enq.details?.targetDate}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-500">{enq.workflowStep || enq.status}</td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400 italic">No associated enquiries found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Quotations" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Quotation Code</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Quantity (MT)</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {quotations.map((qtn: any) => (
                      <tr key={qtn.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-semibold text-blue-600 font-mono">{qtn.code}</td>
                        <td className="px-4 py-2.5">{qtn.details?.product}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{qtn.details?.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-mono">₹{qtn.details?.unitPrice?.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-500">{qtn.status}</td>
                      </tr>
                    ))}
                    {quotations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400 italic">No associated quotations found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Sales Orders" && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Sales Order Code</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Quantity (MT)</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Delivery Date</th>
                      <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {salesOrdersList.map((so: any) => (
                      <tr key={so.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-semibold text-blue-600 font-mono">{so.code}</td>
                        <td className="px-4 py-2.5">{so.details?.product}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{so.details?.quantity}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{so.details?.requestedDeliveryDate || so.details?.startDate}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-500">{so.workflowStep || so.status}</td>
                      </tr>
                    ))}
                    {salesOrdersList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400 italic">No associated sales orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add operational notes or comments..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none bg-white"
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddComment}
                    className="px-3.5 py-1 min-h-0 text-xs"
                  >
                    Add Note
                  </Button>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-xs shadow-sm"
                    >
                      <div className="font-medium text-slate-800">{c.text}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {c.timestamp} · {c.author}
                      </div>
                    </div>
                  ))}
                  {entity.activities?.map((act: any) => (
                    <div
                      key={act.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-xs flex gap-2 shadow-sm"
                    >
                      <span className="text-blue-500 font-bold">ℹ</span>
                      <div>
                        <div className="text-slate-600">{act.description}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {act.timestamp} · User: {act.user}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
