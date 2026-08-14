export type ModuleKey = "commercial" | "procurement" | "tankfarm" | "prodplanning" | "production" | "quality" | "warehouse" | "productrelease" | "finance" | "maintenance" | "utilities" | "assets"

export interface AuditTrailEntry {
  timestamp: string
  user: string
  action: string
  field?: string
  oldValue?: string
  newValue?: string
}

export interface ActivityLogEntry {
  id: string
  timestamp: string
  user: string
  description: string
  type: "info" | "success" | "warning" | "error"
}

export interface CommentEntry {
  id: string
  user: string
  avatar: string
  timestamp: string
  message: string
}

export interface AttachmentEntry {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
  url?: string
}

export interface BaseEntity {
  id: string
  code: string
  status: string
  createdAt: string
  createdBy: string
  auditTrail: AuditTrailEntry[]
  activities: ActivityLogEntry[]
  comments: CommentEntry[]
  attachments: AttachmentEntry[]
  name?: string
  type?: string
}

export interface MasterEntity
  extends BaseEntity {
  // Dynamic details key-value pair for custom attributes
  name?: string
  type?: string
  details: Record<string, any>
}

export interface TransactionEntity extends BaseEntity {
  date?: string
  workflowStep?: string
  approvalHistory?: {
    step: string
    approver: string
    status: "approved" | "pending" | "rejected"
    timestamp?: string
    comments?: string
  }[]
  details: Record<string, any>
}

export interface ModuleConfig {
  key: ModuleKey
  label: string
  icon: string
  masters?: {
    key: string
    label: string
    fields: {
      key: string
      label: string
      type: "text" | "number" | "select" | "date"
      options?: string[]
      required?: boolean
      section: string
    }[]
    defaultData: MasterEntity[]
  }[]
  transactions?: {
    key: string
    label: string
    fields: {
      key: string
      label: string
      type: "text" | "number" | "select" | "date"
      options?: string[]
      required?: boolean
      section: string
    }[]
    defaultData: TransactionEntity[]
  }[]
}
