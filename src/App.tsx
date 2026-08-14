import { ProcessTemplateView } from "./components/ProcessTemplateView"
import { RefiningManagementView } from "./components/RefiningManagementView"
import { InboundReceivingView } from "./components/InboundReceivingView"
import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { modulesData } from "./data/mockData"
import {
  Icon,
  Button,
  DataTable,
  FormDrawer,
  DetailView,
} from "./components/DesignSystem"
import { ProductionPlanningView } from "./components/ProductionPlanningView"
import { ModuleKey, MasterEntity, TransactionEntity } from "./types"

// Multi-colored Swirl Logo for ROCKEYE
export function RockeyeLogo({ className = "w-7 h-7" }: { className?: string }) {
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

// Production analytics data for standard Executive Dashboard
const productionFlowData = [
  { time: "00:00", crude: 12400, naphtha: 3200, diesel: 5100 },
  { time: "03:00", crude: 13100, naphtha: 3400, diesel: 5300 },
  { time: "06:00", crude: 14200, naphtha: 3800, diesel: 5900 },
  { time: "09:00", crude: 15800, naphtha: 4100, diesel: 6400 },
  { time: "12:00", crude: 16200, naphtha: 4300, diesel: 6700 },
  { time: "15:00", crude: 15600, naphtha: 4200, diesel: 6500 },
  { time: "18:00", crude: 14900, naphtha: 3900, diesel: 6200 },
  { time: "21:00", crude: 14100, naphtha: 3700, diesel: 5800 },
]

const tankInventoryData = [
  {
    name: "Crude Palm Oil T-101",
    value: 78,
    capacity: 500000,
    fill: "#2563eb",
  },
  { name: "Naphtha T-102", value: 54, capacity: 120000, fill: "#0284c7" },
  { name: "Diesel T-103", value: 88, capacity: 200000, fill: "#16a34a" },
  { name: "ATF T-104", value: 41, capacity: 80000, fill: "#ca8a04" },
  { name: "Fuel Oil T-105", value: 65, capacity: 150000, fill: "#dc2626" },
]

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [db, setDb] = useState(modulesData)

  // Expanded state for each module category in accordion sidebar
  const [expandedModules, setExpandedModules] =
    useState<Record<string, boolean>>({
      commercial: true,
      procurement: false,

      tankfarm: false,
      assets: false,
      maintenance: false,
      utilities: false,
    })

  // Navigation state mapping directly to active Entity types
  const [currentView, setCurrentView] = useState<"dashboard" | "entity">(
    "dashboard",
  )
  const [activeModuleKey, setActiveModuleKey] =
    useState<ModuleKey>("commercial")
  const [activeEntityCategory, setActiveEntityCategory] =
    useState<"masters" | "transactions">("masters")
  const [activeEntityKey, setActiveEntityKey] = useState<string>("customer")

  // Search, columns, filters and selections states (lifted up from table toolbar)
  const [search, setSearch] = useState("")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("")
  const [activeColumns, setActiveColumns] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Toolbar popup menu states
  const [filterMenu, setFilterMenu] = useState(false)
  const [showChooser, setShowChooser] = useState(false)

  // Detail View & Drawer States
  const [viewingEntity, setViewingEntity] =
    useState<MasterEntity | TransactionEntity | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingEntity, setEditingEntity] = useState<any>(null)
  const [customFormOverride, setCustomFormOverride] = useState<any>(null)

  // AI Copilot Popup Panel
  const [aiPopup, setAiPopup] = useState(false)
  const [aiMessage, setAiMessage] = useState("")
  const [aiLog, setAiLog] = useState<{
    sender: "user" | "assistant"
    text: string
  }[]>([
    {
      sender: "assistant",
      text: "Welcome to ROCKEYE Intelligent Assistant. How can I assist you with refinery operations, approvals, or tank telemetry today?",
    },
  ])

  const handleAcceptEnquiry = (enq: any) => {
    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key === "commercial") {
          return {
            ...mod,
            transactions: mod.transactions?.map((t) => {
              if (t.key === "enquiry") {
                return {
                  ...t,
                  defaultData: t.defaultData.map((item) => {
                    if (item.id === enq.id) {
                      return {
                        ...item,
                        status: "Approved",
                        workflowStep: "Accepted",
                      }
                    }
                    return item
                  }),
                }
              }
              return t
            }),
          }
        }
        return mod
      })
    })

    setViewingEntity((prev: any) => {
      if (prev && prev.id === enq.id) {
        return { ...prev, status: "Approved", workflowStep: "Accepted" }
      }
      return prev
    })

    // Open Quotation form with prefilled fields
    setCustomFormOverride({
      activeKey: "quotation",
      title: "Create Quotation for Enquiry: " + enq.code,
      fields:
        db
          .flatMap((m) => m.transactions || [])
          .find((t) => t.key === "quotation")?.fields || [],
      initialData: {
        quotationDate: new Date().toISOString().split("T")[0],
        customer: enq.details?.customer || enq.name || "",
        enquiryRef: enq.code,
        salesExecutive: enq.details?.salesExecutive || "Arjun Kumar",
        businessUnit: enq.details?.businessUnit || "Refined Fuels",
        currency: enq.details?.currency || "USD",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        priority: enq.details?.priority || "High",
        product: enq.details?.product || "",
        productGrade: enq.details?.productGrade || "",
        quantity: enq.details?.quantity || 0,
        uom: enq.details?.uom || "MT",
        packagingType: enq.details?.packagingType || "Bulk Vessel",
        destinationPort: enq.details?.destinationPort || "Port Klang (MY)",
        incoterm: enq.details?.incoterm || "FOB",
        unitPrice: enq.details?.expectedPrice || 850,
        discount: 0,
        tax: 0,
        deliveryLocation: enq.details?.destinationPort || "",
        targetDate: enq.details?.targetDate || "",
        paymentTerms: "LC at Sight",
      },
    })
    setFormMode("create")
    setIsFormOpen(true)
  }

  const handleRejectEnquiry = (enq: any) => {
    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key === "commercial") {
          return {
            ...mod,
            transactions: mod.transactions?.map((t) => {
              if (t.key === "enquiry") {
                return {
                  ...t,
                  defaultData: t.defaultData.map((item) => {
                    if (item.id === enq.id) {
                      return {
                        ...item,
                        status: "Rejected",
                        workflowStep: "Rejected",
                      }
                    }
                    return item
                  }),
                }
              }
              return t
            }),
          }
        }
        return mod
      })
    })

    setViewingEntity((prev: any) => {
      if (prev && prev.id === enq.id) {
        return { ...prev, status: "Rejected", workflowStep: "Rejected" }
      }
      return prev
    })

    alert(`Enquiry ${enq.code} has been marked as Rejected.`)
  }

  const handleAcceptQuotation = (qtn: any) => {
    // 1. Update Quotation status to Approved
    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key === "commercial") {
          return {
            ...mod,
            transactions: mod.transactions?.map((t) => {
              if (t.key === "quotation") {
                return {
                  ...t,
                  defaultData: t.defaultData.map((item) => {
                    if (item.id === qtn.id) {
                      return {
                        ...item,
                        status: "Approved",
                        workflowStep: "Approved",
                      }
                    }
                    return item
                  }),
                }
              }
              return t
            }),
          }
        }
        return mod
      })
    })

    setViewingEntity((prev: any) => {
      if (prev && prev.id === qtn.id) {
        return { ...prev, status: "Approved", workflowStep: "Approved" }
      }
      return prev
    })

    // 2. Open Sales Order form with prefilled fields
    setCustomFormOverride({
      activeKey: "salesorder",
      title: "Create Sales Order for Quotation: " + qtn.code,
      fields:
        db
          .flatMap((m) => m.transactions || [])
          .find((t) => t.key === "salesorder")?.fields || [],
      initialData: {
        salesOrderNo: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        salesOrderDate: new Date().toISOString().split("T")[0],
        customer: qtn.details?.customer || "",
        quotationRef: qtn.code,
        product: qtn.details?.product || "",
        quantity: qtn.details?.quantity || 0,
        packagingType: qtn.details?.packagingType || "Bulk Vessel",
        destinationPort: qtn.details?.destinationPort || "Nhava Sheva (IN)",
        incoterm: qtn.details?.incoterm || "FOB",
        loadingPort: qtn.details?.loadingPort || "Port Klang (MY)",
        currency: qtn.details?.currency || "USD",
        unitPrice: qtn.details?.unitPrice || 0,
        totalAmount: (qtn.details?.quantity || 0) * (qtn.details?.unitPrice || 0),
        paymentTerms: qtn.details?.paymentTerms || "LC at Sight",
        requestedDeliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "Open"
      },
    })
    setFormMode("create")
    setIsFormOpen(true)
  }

  const handleModifyQuotation = (qtn: any) => {
    // Open edit form drawer for quotation
    setEditingEntity(qtn)
    setFormMode("edit")
    setIsFormOpen(true)
  }

  const handleRejectQuotation = (qtn: any) => {
    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key === "commercial") {
          return {
            ...mod,
            transactions: mod.transactions?.map((t) => {
              if (t.key === "quotation") {
                return {
                  ...t,
                  defaultData: t.defaultData.map((item) => {
                    if (item.id === qtn.id) {
                      return {
                        ...item,
                        status: "Rejected",
                        workflowStep: "Rejected",
                      }
                    }
                    return item
                  }),
                }
              }
              return t
            }),
          }
        }
        return mod
      })
    })

    setViewingEntity((prev: any) => {
      if (prev && prev.id === qtn.id) {
        return { ...prev, status: "Rejected", workflowStep: "Rejected" }
      }
      return prev
    })

    alert(`Quotation ${qtn.code} has been marked as Rejected.`)
  }

  const currentModule = db.find((m) => m.key === activeModuleKey) || db[0]
  const activeMaster = currentModule.masters?.find(
    (m) => m.key === activeEntityKey,
  )
  const activeTransaction = currentModule.transactions?.find(
    (t) => t.key === activeEntityKey,
  )

  // Dynamic fallback builder to support all Daily Business Capabilities
  const getDynamicEntityConfig = () => {
    if (activeEntityKey === "deliveryplanning") {
      const dpFields = [
        { key: "vendor", label: "Vendor Name", type: "select", options: ["Seri Maju Trading Sdn. Bhd.", "Sime Darby Oils Trading"], required: true, section: "Delivery Planning Info" },
        { key: "warehouse", label: "Warehouse", type: "select", options: ["Bulk Storage Tank Farm A", "Bulk Storage Tank Farm B", "Dry Warehouse C"], required: true, section: "Delivery Planning Info" },
        { key: "poRef", label: "PO Reference Code", type: "text", required: true, section: "PO Selection" },
        { key: "driverName", label: "Driver Name", type: "text", required: true, section: "Driver Details" },
        { key: "driverPhone", label: "Driver Contact number", type: "text", required: true, section: "Driver Details" },
        { key: "vehicleNumber", label: "Vehicle Number", type: "text", required: true, section: "Driver Details" },
        { key: "expectedDeliveryDate", label: "Expected Delivery Date", type: "date", required: true, section: "Driver Details" },
        { key: "remarks", label: "Remarks", type: "text", required: false, section: "Other Details" },
        { key: "notes", label: "Notes", type: "text", required: false, section: "Other Details" },
        { key: "status", label: "Status", type: "select", options: ["Scheduled", "In-Transit", "Arrived", "Cancelled"], required: true, section: "Other Details" }
      ];
      const dpDefaultData = [
        {
          id: "dp-1",
          code: "DPL-2026-9901",
          name: "Delivery Planning #1",
          status: "Scheduled",
          createdAt: "2026-08-12",
          createdBy: "Arjun Kumar",
          auditTrail: [],
          activities: [],
          comments: [],
          attachments: [],
          details: {
            vendor: "Seri Maju Trading Sdn. Bhd.",
            warehouse: "Bulk Storage Tank Farm A",
            poRef: "HOM-PO-10219",
            driverName: "Raju Kumar",
            driverPhone: "+60-12-345-6789",
            vehicleNumber: "WAA 1234 A",
            expectedDeliveryDate: "2026-08-20",
            remarks: "Deliver CPO by tank truck.",
            notes: "",
            status: "Scheduled"
          }
        }
      ];
      return { key: activeEntityKey, label: "Delivery Planning", fields: dpFields, defaultData: dpDefaultData };
    }

    if (activeEntityCategory === "masters" && activeMaster) return activeMaster
    if (activeEntityCategory === "transactions" && activeTransaction)
      return activeTransaction

    const labelsMap: Record<string, string> = {
      customer: "Customer",
      enquiry: "Customer Enquiry",
      quotation: "Quotation",
      salescontract: "Sales Contract",
      salesorder: "Sales Order",
      supplier: "Supplier",
      purchaserequisition: "Purchase Requisition",
      procurementcontract: "Procurement Contract",
      po: "Purchase Order",
      inbounddelivery: "Inbound Delivery",
      deliveryplanning: "Delivery Planning",

      gateentry: "Gate Operations (Entry/Exit)",
      qualityinspection: "Quality Inspection",
      goodsreceipt: "Goods Receipt",
      tank: "Tanks",
      tankallocation: "Tank Allocation",
      tankoperations: "Tank Operations",
      tanktransfer: "Tank Transfer",
      batchtraceability: "Batch Traceability",
      prodplan: "Production Planning",
      mrp: "Material Requirement Planning",
      prodorder: "Production Order",
      prodsched: "Production Scheduling",
      prodexec: "Production Execution Management",
      refining: "Refining Process Management",
      fractionation: "Fractionation Management",
      batchmanagement: "Batch Management",
      yieldmanagement: "Yield Management",
      incomingquality: "Incoming Quality",
      inprocessquality: "In-Process Quality",
      finishedquality: "Finished Product Quality",
      nonconformance: "Non-Conformance Log",
      warehouseinventory: "Warehouse Inventory",
      materialstorage: "Material Storage",
      materialmovement: "Material Movement",
      physicalinventory: "Physical Inventory Registry",
      productavail: "Finished Product Availability",
      productalloc: "Product Allocation",
      producthandover: "Product Handover",
      customerinvoice: "Customer Invoice",
      prodcost: "Production Costing",
      finintegration: "Financial Integration Ledger",
      asset: "Asset Registry",
      maintrequest: "Maintenance Request",
      maintplanning: "Maintenance Planning",
      workorder: "Work Order Registry",
      utilityops: "Utility Operations Log",
      utilitysupply: "Utility Supply",
      utilityperformance: "Utility Performance Summary",
    }

    const label = labelsMap[activeEntityKey] || "Enterprise Registry"
    const codePrefix = activeEntityKey.substring(0, 4).toUpperCase()

    const fields: {
      key: string
      label: string
      type: "text" | "number" | "select" | "date"
      options?: string[]
      required?: boolean
      section: string
    }[] = [
      {
        key: "name",
        label: "Item Name / Description",
        type: "text",
        section: "General Information",
      },
      {
        key: "status",
        label: "Operational Status",
        type: "select",
        options: ["Active", "Draft", "Closed", "Under Review"],
        section: "General Information",
      },
      {
        key: "refNo",
        label: "Reference Number",
        type: "text",
        section: "Operational Parameters",
      },
      {
        key: "assignedTo",
        label: "Responsible Officer",
        type: "text",
        section: "Operational Parameters",
      },
    ]

    const defaultData = [
      {
        id: `dyn-${activeEntityKey}-1`,
        code: `${codePrefix}-2026-081`,
        name: `${label} Record #1`,
        status: "Active",
        createdAt: "2026-08-12",
        createdBy: "Arjun Kumar",
        auditTrail: [
          {
            timestamp: "2026-08-12 09:00",
            user: "System Agent",
            action: "Record Initialized",
          },
        ],
        activities: [
          {
            id: "1",
            timestamp: "2026-08-12 09:05",
            user: "Arjun Kumar",
            description: `Continuous recording initiated for ${label}`,
            type: "info",
          },
        ],
        comments: [],
        attachments: [],
        details: {
          name: `${label} Record #1`,
          status: "Active",
          refNo: `${codePrefix}-REF-992`,
          assignedTo: "Arjun Kumar",
        },
      },
    ]

    return { key: activeEntityKey, label, fields, defaultData }
  }

  const activeEntityConfig = getDynamicEntityConfig()
  const baseEntityFields = activeEntityConfig.fields || []
  const activeEntityFields =
    activeEntityKey === "supplier"
      ? [
          ...baseEntityFields,
          { key: "performanceTag", label: "Performance", type: "text" as const, section: "Performance" },
          { key: "ordersGiven", label: "Orders Given", type: "number" as const, section: "Performance" },
          { key: "ordersReceived", label: "Orders Received", type: "number" as const, section: "Performance" },
          { key: "onTimeDeliveries", label: "On-Time Deliveries", type: "number" as const, section: "Performance" },
        ]
      : baseEntityFields
  const activeEntityData = activeEntityConfig.defaultData || []
  const activeEntityLabel = activeEntityConfig.label || "Record"

  // Initialize columns state whenever entity type changes
    useEffect(() => {
      if (activeEntityConfig) {
        if (activeEntityKey === "customer") {
          setActiveColumns(["name", "companyCode", "customerType", "country", "status"])
        } else if (activeEntityKey === "supplier") {
          setActiveColumns(["name", "shortName", "typeOfBusiness", "country", "email", "mobileNo", "performanceTag", "ordersGiven", "ordersReceived", "onTimeDeliveries"])
        } else if (activeEntityKey === "po") {
          setActiveColumns(["poNo", "supplier", "product", "quantity", "unitPrice", "totalAmount", "deliveryDate"])
        } else if (activeEntityKey === "deliveryplanning") {
          setActiveColumns(["vendor", "warehouse", "poRef", "driverName", "vehicleNumber", "expectedDeliveryDate", "status"])
        } else {
          setActiveColumns(activeEntityConfig.fields.map((c) => c.key))
        }
      }
      setSearch("")
      setSelectedStatusFilter("")
      setSelectedIds([])
    }, [activeEntityKey, activeEntityCategory])

  const toggleModuleExpand = (key: string) => {
    setExpandedModules((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAiSend = () => {
    if (!aiMessage.trim()) return
    const userMsg = aiMessage
    setAiLog((prev) => [...prev, { sender: "user", text: userMsg }])
    setAiMessage("")
    setTimeout(() => {
      setAiLog((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: `ROCKEYE Engine validation complete. Based on current system state, the operations parameter for "${userMsg}" complies with standard refinery tolerances.`,
        },
      ])
    }, 600)
  }

  // CRUD handlers
  const handleFormSubmit = (fieldsData: any) => {
    if (customFormOverride) {
      const targetKey = customFormOverride.activeKey // 'quotation'
      const newRecord = {
        id: Math.random().toString(),
        code: `QTN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split("T")[0],
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: "Arjun Kumar",
        auditTrail: [
          {
            timestamp: "Just now",
            user: "Arjun Kumar",
            action: `Created from Enquiry ${customFormOverride.initialData.enquiryRef}`,
          },
        ],
        activities: [
          {
            id: "1",
            timestamp: "Just now",
            user: "Arjun Kumar",
            description: `Generated quote from enquiry ${customFormOverride.initialData.enquiryRef}`,
            type: "info",
          },
        ],
        comments: [],
        attachments: [],
        details: fieldsData,
      }

      setDb((prevDb) => {
        return prevDb.map((mod) => {
          if (mod.key !== "commercial") return mod
          return {
            ...mod,
            transactions: mod.transactions.map((trx) => {
              if (trx.key === targetKey) {
                return { ...trx, defaultData: [newRecord, ...trx.defaultData] }
              }
              if (trx.key === "enquiry") {
                return {
                  ...trx,
                  defaultData: trx.defaultData.map((d) =>
                    d.code === customFormOverride.initialData.enquiryRef
                      ? {
                          ...d,
                          status: "Approved",
                          details: { ...d.details, quotationStatus: "Quoted" },
                        }
                      : d,
                  ),
                }
              }
              return trx
            }),
          }
        })
      })

      setIsFormOpen(false)
      setCustomFormOverride(null)
      setViewingEntity(null)
      alert(`Quotation ${newRecord.code} generated successfully!`)
      return
    }

    const isMaster = activeEntityCategory === "masters"

    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key !== activeModuleKey) return mod

        if (isMaster) {
          const updatedMasters = mod.masters.map((mst) => {
            if (mst.key !== activeEntityKey) return mst
            if (formMode === "edit") {
              return {
                ...mst,
                defaultData: mst.defaultData.map((d) =>
                  d.id === editingEntity.id
                    ? { ...d, details: fieldsData, status: "Active" }
                    : d,
                ),
              }
            } else {
              const newRecord: MasterEntity = {
                id: Math.random().toString(),
                code: `${mst.key.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                name:
                  fieldsData.name ||
                  fieldsData[Object.keys(fieldsData)[0]] ||
                  "New Master Record",
                type: fieldsData.type || "Standard",
                status: "Active",
                createdAt: new Date().toISOString().split("T")[0],
                createdBy: "Arjun Kumar",
                auditTrail: [
                  {
                    timestamp: "Just now",
                    user: "Arjun Kumar",
                    action: "Record Created via Form Drawer",
                  },
                ],
                activities: [
                  {
                    id: "1",
                    timestamp: "Just now",
                    user: "Arjun Kumar",
                    description: "Created Master record in ROCKEYE",
                    type: "info",
                  },
                ],
                comments: [],
                attachments: [],
                details: fieldsData,
              }
              return { ...mst, defaultData: [newRecord, ...mst.defaultData] }
            }
          })
          return { ...mod, masters: updatedMasters }
        } else {
          const updatedTransactions = mod.transactions.map((trx) => {
            if (trx.key !== activeEntityKey) return trx
            if (formMode === "edit") {
              return {
                ...trx,
                defaultData: trx.defaultData.map((d) =>
                  d.id === editingEntity.id
                    ? { ...d, details: fieldsData, status: "Pending Review" }
                    : d,
                ),
              }
            } else {
              const newRecord: TransactionEntity = {
                id: Math.random().toString(),
                code: `${trx.key.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                date: new Date().toISOString().split("T")[0],
                status: "Awaiting Approvals",
                workflowStep: "Initial Review",
                createdAt: new Date().toISOString().split("T")[0],
                createdBy: "Arjun Kumar",
                auditTrail: [
                  {
                    timestamp: "Just now",
                    user: "Arjun Kumar",
                    action: "Transaction Created in ROCKEYE",
                  },
                ],
                activities: [
                  {
                    id: "1",
                    timestamp: "Just now",
                    user: "Arjun Kumar",
                    description:
                      "Initialized transaction and routing to workflow approval steps",
                    type: "info",
                  },
                ],
                comments: [],
                attachments: [],
                approvalHistory: [
                  {
                    step: "Manager Approval",
                    approver: "Arjun Kumar (Plant Manager)",
                    status: "pending",
                  },
                ],
                details: fieldsData,
              }
              return { ...trx, defaultData: [newRecord, ...trx.defaultData] }
            }
          })
          return { ...mod, transactions: updatedTransactions }
        }
      })
    })

    setIsFormOpen(false)
    setViewingEntity(null)
  }

  const handleBulkDelete = (ids: string[]) => {
    const isMaster = activeEntityCategory === "masters"

    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key !== activeModuleKey) return mod
        if (isMaster) {
          return {
            ...mod,
            masters: mod.masters.map((mst) => {
              if (mst.key !== activeEntityKey) return mst
              return {
                ...mst,
                defaultData: mst.defaultData.filter((d) => !ids.includes(d.id)),
              }
            }),
          }
        } else {
          return {
            ...mod,
            transactions: mod.transactions.map((trx) => {
              if (trx.key !== activeEntityKey) return trx
              return {
                ...trx,
                defaultData: trx.defaultData.filter((d) => !ids.includes(d.id)),
              }
            }),
          }
        }
      })
    })
    alert(`Successfully deleted ${ids.length} records in ROCKEYE.`)
  }

  const handleWorkflowApproval = (decision: "approved" | "rejected") => {
    if (!viewingEntity) return
    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key !== activeModuleKey) return mod
        return {
          ...mod,
          transactions: mod.transactions.map((trx) => {
            if (trx.key !== activeEntityKey) return trx
            return {
              ...trx,
              defaultData: trx.defaultData.map((d) => {
                if (d.id !== viewingEntity.id) return d
                const updatedHistory = d.approvalHistory.map((step) => {
                  if (step.status === "pending") {
                    return {
                      ...step,
                      status:
                        decision === "approved"
                          ? "approved" as const
                          : "rejected" as const,
                      timestamp: "Just now",
                      comments: `Status updated to ${decision}.`,
                    }
                  }
                  return step
                })
                return {
                  ...d,
                  status: decision === "approved" ? "Approved" : "Rejected",
                  workflowStep: "Completed",
                  approvalHistory: updatedHistory,
                }
              }),
            }
          }),
        }
      })
    })
    setViewingEntity(null)
    alert(`ROCKEYE Transaction decision recorded: ${decision}`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      {/* Off-White Sidebar Panel */}
      <aside
        className="flex flex-col h-screen flex-shrink-0 transition-all duration-300 bg-[#fbfcfd] border-r border-slate-200"
        style={{ width: collapsed ? 64 : 260 }}
      >
        {/* Logo brand heading */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-white select-none">
          <RockeyeLogo />
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-800 tracking-tight">
                ROCKEYE
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1 py-0.5 rounded border border-slate-200 uppercase">
                Ops
              </span>
            </div>
          )}
        </div>

        {/* Sidebar categories accordion */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
          {/* Main Dashboard Link */}
          <button
            onClick={() => {
              setCurrentView("dashboard")
              setViewingEntity(null)
            }}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-all w-full select-none cursor-pointer ${
              currentView === "dashboard"
                ? "bg-[#eff6ff] text-blue-700 font-bold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon name="grid" size={16} />
            {!collapsed && <span>Dashboard</span>}
          </button>

          {/* Module lists */}
          {!collapsed &&
            db.map((mod) => {
              const isExpanded = expandedModules[mod.key] || false
              return (
                <div key={mod.key} className="flex flex-col gap-0.5 mt-1.5">
                  <button
                    onClick={() => toggleModuleExpand(mod.key)}
                    className="flex items-center justify-between px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold select-none cursor-pointer text-left w-full"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        name={mod.icon}
                        size={15}
                        className="text-slate-500"
                      />
                      <span>{mod.label}</span>
                    </div>
                    <Icon
                      name={isExpanded ? "chevron-down" : "chevron-right"}
                      size={12}
                      className="text-slate-400"
                    />
                  </button>

                  {isExpanded && (
                    <div className="flex flex-col mt-0.5 ml-3 gap-0.5 border-l border-slate-200 pl-3.5">
                      {(() => {
                        const subItemsMap: Record<string, {
                          key: string
                          label: string
                          category: "masters" | "transactions"
                        }[]> = {
                          commercial: [
                            {
                              key: "customer",
                              label: "Customer",
                              category: "masters",
                            },
                            {
                              key: "enquiry",
                              label: "Customer Enquiry",
                              category: "transactions",
                            },
                            {
                              key: "quotation",
                              label: "Quotation",
                              category: "transactions",
                            },
                            {
                              key: "salesorder",
                              label: "Sales Order",
                              category: "transactions",
                            },
                          ],
                          procurement: [
                            {
                              key: "supplier",
                              label: "Supplier",
                              category: "masters",
                            },
                            {
                              key: "po",
                              label: "Purchase Order",
                              category: "transactions",
                            },
                            {
                              key: "deliveryplanning",
                              label: "Delivery Planning",
                              category: "transactions",
                            },
                            {
                              key: "gateentry",
                              label: "Gate Operations (Entry/Exit)",
                              category: "transactions",
                            },
                            {
                              key: "qualityinspection",
                              label: "Quality Inspection",
                              category: "transactions",
                            },
                            {
                              key: "goodsreceipt",
                              label: "Goods Receipt",
                              category: "transactions",
                            },
                            {
                              key: "inboundreceiving",
                              label: "Inbound Receiving Workflow",
                              category: "transactions",
                            },
                          ],
                          tankfarm: [
                            {
                              key: "products",
                              label: "Products",
                              category: "masters",
                            },
                            {
                              key: "tank",
                              label: "Tanks",
                              category: "masters",
                            },
                          ],
                          production: [
                            {
                              key: "prodplan",
                              label: "Production Planning",
                              category: "transactions",
                            },
                            {
                              key: "refining",
                              label: "Refining Management",
                              category: "transactions",
                            },
                            {
                              key: "process-template",
                              label: "Process Templates",
                              category: "masters",
                            },
                          ],
                          quality: [
                            {
                              key: "incomingquality",
                              label: "Incoming Quality",
                              category: "transactions",
                            },
                            {
                              key: "inprocessquality",
                              label: "In-Process Quality",
                              category: "transactions",
                            },
                            {
                              key: "finishedquality",
                              label: "Finished Product Quality",
                              category: "transactions",
                            },
                            {
                              key: "nonconformance",
                              label: "Non-Conformance",
                              category: "transactions",
                            },
                          ],
                          warehouse: [
                            {
                              key: "warehouseinventory",
                              label: "Warehouse Inventory",
                              category: "transactions",
                            },
                            {
                              key: "materialstorage",
                              label: "Material Storage",
                              category: "transactions",
                            },
                            {
                              key: "materialmovement",
                              label: "Material Movement",
                              category: "transactions",
                            },
                            {
                              key: "physicalinventory",
                              label: "Physical Inventory",
                              category: "transactions",
                            },
                          ],
                          productrelease: [
                            {
                              key: "productavail",
                              label: "Finished Product Availability",
                              category: "transactions",
                            },
                            {
                              key: "productalloc",
                              label: "Product Allocation",
                              category: "transactions",
                            },
                            {
                              key: "producthandover",
                              label: "Product Handover",
                              category: "transactions",
                            },
                          ],
                          finance: [
                            {
                              key: "paymentterm",
                              label: "Payment Terms",
                              category: "masters",
                            },
                            {
                              key: "paymentreceived",
                              label: "Payments Received",
                              category: "transactions",
                            },
                            {
                              key: "paymentmade",
                              label: "Payments Made",
                              category: "transactions",
                            },
                          ],
                          assets: [
                            {
                              key: "asset",
                              label: "Assets",
                              category: "masters",
                            },
                          ],
                          maintenance: [
                            {
                              key: "maintrequest",
                              label: "Maintenance Requests",
                              category: "transactions",
                            },
                            {
                              key: "workorder",
                              label: "Work Orders",
                              category: "transactions",
                            },
                          ],
                          utilities: [
                            {
                              key: "employee",
                              label: "Employee Roster",
                              category: "masters",
                            },
                            {
                              key: "shiftplan",
                              label: "Shift Allocations",
                              category: "transactions",
                            },
                            {
                              key: "utilitylogs",
                              label: "Utility Usage Logs",
                              category: "transactions",
                            },
                          ],
                        }

                        const subItems = subItemsMap[mod.key] || []

                        return subItems.map((item) => {
                          const isActive =
                            currentView === "entity" &&
                            activeEntityKey === item.key &&
                            activeModuleKey === mod.key
                          return (
                            <button
                              key={item.key}
                              onClick={() => {
                                setCurrentView("entity")
                                setActiveModuleKey(mod.key)
                                setActiveEntityCategory(item.category)
                                setActiveEntityKey(item.key)
                                setViewingEntity(null)
                              }}
                              className={`text-left text-xs py-1.5 px-2.5 rounded-md transition-colors select-none cursor-pointer flex items-center gap-2 ${
                                isActive
                                  ? "bg-[#eff6ff] text-blue-700 font-bold"
                                  : "text-slate-650 hover:text-slate-900 hover:bg-slate-100/70"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? "bg-blue-600" : "bg-slate-300"
                                }`}
                              />
                              <span className="truncate">{item.label}</span>
                            </button>
                          )
                        })
                      })()}
                    </div>
                  )}
                </div>
              )
            })}
        </nav>

        {/* User Card */}
        <div className="px-4 py-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs">
              JD
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  John Doe
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  john.doe@company.com
                </div>
              </div>
            )}
            <Icon name="chevron-down" size={12} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Workspace Panels */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Global Top Header Bar */}
        <header className="h-14 flex items-center px-6 gap-4 bg-white border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <Icon name="chevron-left" size={16} />
          </button>

          {/* breadcrumb path */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold flex-shrink-0">
            <span>ROCKEYE</span>
            <Icon name="chevron-right" size={12} />
            <span className="text-slate-800">{currentModule.label}</span>
            {currentView === "entity" && (
              <>
                <Icon name="chevron-right" size={12} />
                <span className="text-slate-800 font-bold">
                  {activeEntityLabel}
                </span>
              </>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            {currentView === "entity" && !viewingEntity && (
              <div className="flex items-center flex-wrap gap-2.5">
                {/* Search box with quick shortcut style */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 pointer-events-none">
                    <Icon name="search" size={13} />
                  </span>
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1 border border-slate-200 rounded-lg text-xs w-40 outline-none focus:border-blue-600 bg-slate-50/50"
                  />
                </div>

                {/* Status filter dropdown */}
                <div className="relative">
                  <Button
                    icon="filter"
                    onClick={() => setFilterMenu(!filterMenu)}
                    className="bg-white hover:bg-slate-55 border border-slate-200 text-slate-655 text-xs px-2.5 py-1 min-h-0"
                  >
                    Filter
                    {selectedStatusFilter && (
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full ml-1" />
                    )}
                  </Button>
                  {filterMenu && (
                    <div className="absolute right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg p-2 shadow-lg flex flex-col gap-1 w-40">
                      <span className="text-[9px] font-bold text-slate-400 px-2 py-1">
                        FILTER STATUS
                      </span>
                      {[
                        "Active",
                        "Operational",
                        "Approved",
                        "Pending Review",
                        "Awaiting Approvals",
                      ].map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setSelectedStatusFilter(
                              selectedStatusFilter === st ? "" : st,
                            )
                            setFilterMenu(false)
                          }}
                          className={`text-xs px-2 py-1 rounded-md text-left ${
                            selectedStatusFilter === st
                              ? "bg-blue-50 text-blue-700 font-bold"
                              : "hover:bg-slate-55 text-slate-600"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Columns selector checklist */}
                <div className="relative">
                  <Button
                    icon="settings"
                    onClick={() => setShowChooser(!showChooser)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 min-h-0"
                  >
                    Columns
                  </Button>
                  {showChooser && (
                    <div className="absolute right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg p-3 shadow-lg flex flex-col gap-1.5 w-44">
                      <span className="text-[9px] font-bold text-slate-400 pb-1.5 border-b mb-1">
                        SELECT COLUMNS
                      </span>
                      {activeEntityFields.map((c) => (
                        <label
                          key={c.key}
                          className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={activeColumns.includes(c.key)}
                            onChange={() => {
                              if (activeColumns.includes(c.key)) {
                                setActiveColumns(
                                  activeColumns.filter((x) => x !== c.key),
                                )
                              } else {
                                setActiveColumns([...activeColumns, c.key])
                              }
                            }}
                            className="rounded border-slate-300"
                          />
                          {c.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions buttons */}
                <Button
                  icon="refresh-cw"
                  className="px-2.5 py-1 min-h-0"
                  onClick={() => {
                    setSearch("")
                    setSelectedStatusFilter("")
                    setSelectedIds([])
                  }}
                >
                  Refresh
                </Button>

                {/* Plus create button matching screenshot */}
                <button
                  onClick={() => {
                    setEditingEntity(null)
                    setFormMode("create")
                    setIsFormOpen(true)
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#1d4ed8] text-white hover:bg-blue-800 transition-colors cursor-pointer select-none"
                >
                  <Icon name="plus" size={12} />
                  Add
                </button>
              </div>
            )}

            {currentView === "entity" && viewingEntity && (
              <div className="flex items-center gap-2">
                {/* Specific actions depending on active entity type */}
                {activeEntityKey === "customer" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      icon="upload"
                      onClick={() =>
                        alert(
                          "Document uploaded successfully to ROCKEYE safe server!",
                        )
                      }
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Upload Document
                    </Button>
                  </>
                ) : activeEntityKey === "enquiry" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit Enquiry
                    </Button>
                    <Button
                      icon="plus"
                      onClick={() => {
                        setCustomFormOverride({
                          activeKey: "quotation",
                          title: "Respond to Enquiry: " + viewingEntity.code,
                          fields:
                            db
                              .flatMap((m) => m.transactions || [])
                              .find((t) => t.key === "quotation")?.fields || [],
                          initialData: {
                            quotationDate: new Date()
                              .toISOString()
                              .split("T")[0],
                            customer:
                              viewingEntity.details?.customer ||
                              viewingEntity.name ||
                              "",
                            enquiryRef: viewingEntity.code,
                            salesExecutive:
                              viewingEntity.details?.salesExecutive ||
                              "Arjun Kumar",
                            businessUnit:
                              viewingEntity.details?.businessUnit ||
                              "Refined Fuels",
                            currency: viewingEntity.details?.currency || "INR",
                            expiryDate: new Date(
                              Date.now() + 7 * 24 * 60 * 60 * 1000,
                            )
                              .toISOString()
                              .split("T")[0],
                            priority: viewingEntity.details?.priority || "High",
                            product: viewingEntity.details?.product || "",
                            productGrade:
                              viewingEntity.details?.productGrade || "",
                            quantity: viewingEntity.details?.quantity || 0,
                            uom: viewingEntity.details?.uom || "MT",
                            packagingType:
                              viewingEntity.details?.packagingType || "Bulk",
                            unitPrice:
                              viewingEntity.details?.expectedPrice || 60000,
                            discount: 0,
                            tax: 18,
                            deliveryLocation:
                              viewingEntity.details?.deliveryLocation || "",
                            targetDate: viewingEntity.details?.targetDate || "",
                          },
                        })
                        setFormMode("create")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Respond & Quote
                    </Button>
                  </>
                ) : activeEntityKey === "supplier" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      icon="upload"
                      onClick={() =>
                        alert(
                          "Document uploaded successfully to ROCKEYE safe server!",
                        )
                      }
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Upload Document
                    </Button>
                  </>
                ) : activeEntityKey === "deliveryplanning" ||
                  activeEntityKey === "inbounddelivery" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit Plan
                    </Button>
                    <Button
                      variant="secondary"
                      icon="check"
                      onClick={() => alert("Delivery plan confirmed.")}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Confirm
                    </Button>
                  </>
                ) : activeEntityKey === "gateentry" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit Entry
                    </Button>
                    <Button
                      icon="plus"
                      onClick={() => alert("QC Inspection prefilled form.")}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Create QC
                    </Button>
                  </>
                ) : activeEntityKey === "qualityinspection" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      icon="check"
                      onClick={() => alert("Quality accepted.")}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Accept & Discharge
                    </Button>
                    <Button
                      variant="danger"
                      icon="x"
                      onClick={() => alert("Batch rejected.")}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Reject
                    </Button>
                  </>
                ) : activeEntityKey === "goodsreceipt" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      icon="printer"
                      onClick={() => alert("Printing GRN...")}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Print GRN
                    </Button>
                  </>
                ) : activeEntityKey === "vehiclecheckout" ? (
                  <>
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      icon="check"
                      onClick={() => alert("Vehicle cleared for exit.")}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Clear Exit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      icon="edit"
                      onClick={() => {
                        setEditingEntity(viewingEntity)
                        setFormMode("edit")
                        setIsFormOpen(true)
                      }}
                      className="px-2.5 py-1 min-h-0 text-xs"
                    >
                      Edit
                    </Button>
                  </>
                )}
                {/* Close detail view icon button */}
                <Button
                  variant="ghost"
                  icon="x"
                  onClick={() => setViewingEntity(null)}
                  className="px-2 py-1 min-h-0"
                />
              </div>
            )}
          </div>
        </header>

        {/* Page Content Panel */}
        <main className="flex-1 overflow-hidden p-6 bg-slate-50 flex flex-col">
          {currentView === "dashboard" ? (
            // Executive Dashboard Panel
            <div className="flex-1 overflow-y-auto"><div className="flex flex-col gap-6">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <RockeyeLogo className="w-6 h-6" />
                    ROCKEYE Operations Center
                  </h1>
                  <p className="text-[11px] text-slate-400">
                    Live operational telemetry & yield analytics summary.
                  </p>
                </div>
              </div>

              {/* KPI metrics grid */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    label: "Production Flow Today",
                    value: "16,241",
                    unit: "BPD",
                    icon: "gauge",
                    color: "#2563eb",
                  },
                  {
                    label: "Refinery operating load",
                    value: "94.7%",
                    unit: "Cap",
                    icon: "zap",
                    color: "#16a34a",
                  },
                  {
                    label: "Total Volume Stored",
                    value: "382,410",
                    unit: "KL",
                    icon: "database",
                    color: "#0284c7",
                  },
                  {
                    label: "Pending Approvals Queue",
                    value: "4",
                    unit: "Tasks",
                    icon: "calendar",
                    color: "#ca8a04",
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
                <div className="col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-slate-800">
                    Production Flows & Product Yields (BPD)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={productionFlowData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                        />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="crude"
                          stroke="#2563eb"
                          fill="#2563eb"
                          fillOpacity={0.05}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="diesel"
                          stroke="#16a34a"
                          fill="#16a34a"
                          fillOpacity={0.03}
                          strokeWidth={1.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-slate-800">
                    Inventory & Bulk Storage Summary
                  </h3>
                  <div className="flex flex-col gap-3">
                    {tankInventoryData.map((t, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-slate-700">
                          <span>{t.name}</span>
                          <span className="font-bold font-mono text-[11px]">
                            {t.value}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${t.value}%`,
                              backgroundColor: t.fill,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div></div>
          ) : activeEntityKey === "prodplan" ? (
            <ProductionPlanningView db={db} setDb={setDb} />
          ) : activeEntityKey === "refining" ? (
            <RefiningManagementView db={db} setDb={setDb} />
          ) : activeEntityKey === "process-template" ? (
            <ProcessTemplateView db={db} setDb={setDb} />
          ) : (
            // Entity CRUD Layout
            <div className="flex flex-col h-full">
              {/* LISTING VIEW CONTAINER */}
              {viewingEntity ? (
                <div>
                  <div className="mb-4">
                    <Button
                      icon="chevron-left"
                      onClick={() => setViewingEntity(null)}
                    >
                      Back to {activeEntityLabel} Listing
                    </Button>
                  </div>
                  <DetailView
                    entity={viewingEntity}
                    fields={activeEntityFields}
                    onClose={() => setViewingEntity(null)}
                    onEditClick={() => {
                      setEditingEntity(viewingEntity)
                      setFormMode("edit")
                      setIsFormOpen(true)
                    }}
                    onApprovalStatusChange={
                      activeEntityCategory === "transactions"
                        ? handleWorkflowApproval
                        : undefined
                    }
                    db={db}
                    onAcceptEnquiry={handleAcceptEnquiry}
                    onRejectEnquiry={handleRejectEnquiry}
                    onAcceptQuotation={handleAcceptQuotation}
                    onModifyQuotation={handleModifyQuotation}
                    onRejectQuotation={handleRejectQuotation}
                  />
                </div>
              ) : activeEntityKey === "inboundreceiving" ? (
                <InboundReceivingView />
              ) : (
                <DataTable
                  title={activeEntityLabel}
                  columns={activeEntityFields}
                  data={activeEntityData}
                  onRowClick={(row) => setViewingEntity(row)}
                  onCreateClick={() => {
                    setEditingEntity(null)
                    setFormMode("create")
                    setIsFormOpen(true)
                  }}
                  onBulkDelete={handleBulkDelete}
                  onImportClick={() =>
                    alert("Template Import Wizard launched.")
                  }
                  onDuplicateClick={(row) => {
                    setEditingEntity(row)
                    setFormMode("create")
                    setIsFormOpen(true)
                  }}
                  onArchiveClick={(row) => alert(`Archived item ${row.code}`)}
                  // Feed states down to render matching filtered rows
                  search={search}
                  setSearch={setSearch}
                  selectedStatusFilter={selectedStatusFilter}
                  setSelectedStatusFilter={setSelectedStatusFilter}
                  activeColumns={activeColumns}
                  setActiveColumns={setActiveColumns}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Side Form Drawer Component */}
      <FormDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setCustomFormOverride(null)
        }}
        title={
          customFormOverride
            ? customFormOverride.title
            : `${
                formMode === "create" ? "Create" : "Edit"
              } ${activeEntityLabel} Record`
        }
        fields={
          customFormOverride ? customFormOverride.fields : activeEntityFields
        }
        initialData={
          customFormOverride ? customFormOverride.initialData : editingEntity
        }
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
