import { useState, useRef } from "react"
import { Button, Icon } from "./DesignSystem"

// ── Types ──────────────────────────────────────────────────────────────────────
type WorkflowStatus =
  | "yet_to_come"
  | "checked_in"
  | "quality_under_process"
  | "quality_hold"
  | "quality_rejected"
  | "checked_out_after_rejection"
  | "quality_approved"
  | "tank_allocated"
  | "grn_generated"
  | "checked_out_after_acceptance"

interface DeliveryPlan {
  id: string
  code: string
  vendor: string
  product: string
  productType?: "liquid" | "solid"
  quantity: number
  expectedDate: string
  poRef: string
  driverName: string
  driverPhone: string
  vehicleNumber: string
  status: WorkflowStatus
  gateEntry?: {
    vehicleNo: string
    grossWeight: number
    tareWeight: number
    netWeight: number
    entryTime: string
  }
  sampling?: {
    sampleId: string
    time: string
  }
  qualityResults?: {
    ffa: number
    mi: number
    color: number
    iv: number
    dobi: number
    decision: "approved" | "rejected" | "hold"
    remarks: string
    documentName?: string
  }
  tankAllocation?: { tankId: string; tankName: string; availableCapacity: number }
  warehouseAllocation?: { warehouseId: string; warehouseName: string }
  grn?: { grnNo: string; date: string; receivedQty: number }
  checkOut?: { time: string }
}

interface Tank {
  id: string
  name: string
  product: string
  capacity: number
  current: number
}

interface Warehouse {
  id: string
  name: string
  capacity: number
  current: number
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const allTanks: Tank[] = [
  { id: "T101", name: "Tank T-101", product: "Crude Palm Oil (CPO)", capacity: 500, current: 180 },
  { id: "T102", name: "Tank T-102", product: "Crude Palm Oil (CPO)", capacity: 500, current: 420 },
  { id: "T104", name: "Tank T-104", product: "Crude Palm Oil (CPO)", capacity: 400, current: 0 },
  { id: "T103", name: "Tank T-103", product: "RBD Palm Olein", capacity: 300, current: 90 },
  { id: "T105", name: "Tank T-105", product: "RBD Palm Stearin", capacity: 200, current: 120 },
]

const allWarehouses: Warehouse[] = [
  { id: "WH-1", name: "Chemical Storage WH-1", capacity: 10000, current: 4500 },
  { id: "WH-2", name: "Spares & Consumables WH-2", capacity: 5000, current: 4000 },
]

const initialPlans: DeliveryPlan[] = [
  {
    id: "dp-1",
    code: "DPL-2026-9901",
    vendor: "Sime Darby Oils Trading",
    product: "Crude Palm Oil (CPO)",
    productType: "liquid",
    quantity: 25,
    expectedDate: "2026-08-14",
    poRef: "HOM-PO-10219",
    driverName: "Raju Kumar",
    driverPhone: "+60-12-345-6789",
    vehicleNumber: "WAA 1234 A",
    status: "yet_to_come",
  },
  {
    id: "dp-2",
    code: "DPL-2026-9902",
    vendor: "IOI Oleochemical Industries",
    product: "Crude Palm Oil (CPO)",
    productType: "liquid",
    quantity: 30,
    expectedDate: "2026-08-13",
    poRef: "HOM-PO-10218",
    driverName: "Ahmad Fauzi",
    driverPhone: "+60-16-789-0012",
    vehicleNumber: "WBB 5678 B",
    status: "quality_under_process",
    gateEntry: {
      vehicleNo: "WBB 5678 B",
      grossWeight: 48.2,
      tareWeight: 18.2,
      netWeight: 30.0,
      entryTime: "2026-08-13 09:30",
    },
    sampling: {
      sampleId: "SMP-2026-9043",
      time: "2026-08-13 09:45"
    }
  },
  {
    id: "dp-3",
    code: "DPL-2026-9900",
    vendor: "Seri Maju Trading Sdn. Bhd.",
    product: "Crude Palm Oil (CPO)",
    productType: "liquid",
    quantity: 20,
    expectedDate: "2026-08-12",
    poRef: "HOM-PO-10217",
    driverName: "Harpreet Singh",
    driverPhone: "+60-11-2234-5678",
    vehicleNumber: "WCC 9012 C",
    status: "grn_generated",
    gateEntry: {
      vehicleNo: "WCC 9012 C",
      grossWeight: 38.5,
      tareWeight: 18.5,
      netWeight: 20.0,
      entryTime: "2026-08-12 10:15",
    },
    sampling: {
      sampleId: "SMP-2026-9042",
      time: "2026-08-12 10:30"
    },
    qualityResults: {
      ffa: 4.2,
      mi: 0.15,
      color: 1.9,
      iv: 51.8,
      dobi: 2.9,
      decision: "approved",
      remarks: "Batch meets standard specifications.",
      documentName: "QC_Report_DPL-2026-9900.pdf",
    },
    tankAllocation: { tankId: "T101", tankName: "Tank T-101", availableCapacity: 320 },
    grn: { grnNo: "GRN-2026-0812", date: "2026-08-12", receivedQty: 19.8 },
  },
  {
    id: "dp-4",
    code: "DPL-2026-9903",
    vendor: "ChemCorp Inc",
    product: "Bleaching Earth",
    productType: "solid",
    quantity: 15,
    expectedDate: "2026-08-14",
    poRef: "HOM-PO-10220",
    driverName: "Sanjay",
    driverPhone: "+60-19-111-2222",
    vehicleNumber: "WDD 3344 D",
    status: "checked_in",
    gateEntry: {
      vehicleNo: "WDD 3344 D",
      grossWeight: 35.0,
      tareWeight: 20.0,
      netWeight: 15.0,
      entryTime: "2026-08-14 10:30",
    },
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function getStepIndex(status: WorkflowStatus, productType?: "liquid" | "solid"): number {
  if (productType === "solid") {
    const map: Record<WorkflowStatus, number> = {
      yet_to_come: 0,
      checked_in: 1,
      grn_generated: 2,
      checked_out_after_acceptance: 3,
      // Fallbacks if somehow invalid
      quality_under_process: 1, quality_hold: 1, quality_rejected: 1, checked_out_after_rejection: 1, quality_approved: 1, tank_allocated: 1
    }
    return map[status] || 0
  }

  const map: Record<WorkflowStatus, number> = {
    yet_to_come: 0,
    checked_in: 1,
    quality_under_process: 2,
    quality_hold: 2,
    quality_rejected: 3,
    checked_out_after_rejection: 4,
    quality_approved: 3,
    tank_allocated: 4,
    grn_generated: 5,
    checked_out_after_acceptance: 6,
  }
  return map[status] || 0
}

function statusMeta(status: WorkflowStatus) {
  const map: Record<WorkflowStatus, { label: string; color: string; dot: string; group: string }> = {
    yet_to_come: { label: "Yet to Come", color: "bg-slate-50 text-slate-600", dot: "bg-slate-400", group: "expected" },
    checked_in: { label: "Checked In", color: "bg-violet-50 text-violet-700", dot: "bg-violet-500", group: "active" },
    quality_under_process: { label: "Quality Under Process", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500", group: "active" },
    quality_approved: { label: "Quality Approved", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", group: "active" },
    quality_rejected: { label: "Quality Rejected", color: "bg-red-50 text-red-700", dot: "bg-red-500", group: "rejected" },
    quality_hold: { label: "On Hold", color: "bg-orange-50 text-orange-700", dot: "bg-orange-500", group: "hold" },
    tank_allocated: { label: "Pre-Discharged", color: "bg-teal-50 text-teal-700", dot: "bg-teal-500", group: "active" },
    grn_generated: { label: "GRN Generated", color: "bg-blue-50 text-blue-700", dot: "bg-blue-500", group: "active" },
    checked_out_after_rejection: { label: "Checked Out (Rejected)", color: "bg-slate-100 text-slate-500", dot: "bg-slate-400", group: "completed" },
    checked_out_after_acceptance: { label: "Checked Out (Accepted)", color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-600", group: "completed" },
  }
  return map[status]
}

const STEPS_ACCEPT = ["Expected", "Check In", "Quality", "Pre-Discharge", "GRN", "Check Out"]
const STEPS_REJECT = ["Expected", "Check In", "Quality", "Reject & Check Out"]
const STEPS_SOLID = ["Expected", "Check In", "GRN & WH", "Check Out"]

const QC_PARAMS = [
  { key: "ffa", label: "Free Fatty Acids (FFA %)", min: 0, max: 5.0, passMax: 5.0, unit: "%" },
  { key: "mi", label: "Moisture & Impurities (%)", min: 0, max: 0.3, passMax: 0.25, unit: "%" },
  { key: "color", label: "Color (Lovibond Red)", min: 0, max: 5, passMax: 3.0, unit: "R" },
  { key: "iv", label: "Iodine Value (IV)", min: 49, max: 56, passMin: 49, passMax: 56, unit: "" },
  { key: "dobi", label: "DOBI Value", min: 0, max: 5, passMin: 2.3, unit: "" },
]

function passCheck(key: string, val: number): boolean {
  if (key === "ffa") return val <= 5.0
  if (key === "mi") return val <= 0.25
  if (key === "color") return val <= 3.0
  if (key === "iv") return val >= 49 && val <= 56
  if (key === "dobi") return val >= 2.3
  return true
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function InboundReceivingView() {
  const [plans, setPlans] = useState<DeliveryPlan[]>(initialPlans)
  const [selectedId, setSelectedId] = useState<string | null>("dp-1")

  // Gate entry form
  const [gateForm, setGateForm] = useState({ grossWeight: "", tareWeight: "", entryTime: new Date().toLocaleString() })

  // Quality form
  const [qcForm, setQcForm] = useState({ ffa: "", mi: "", color: "", iv: "", dobi: "", remarks: "" })
  const [qcDecision, setQcDecision] = useState<"approved" | "rejected" | "hold" | null>(null)
  const [qcSubmitted, setQcSubmitted] = useState(false)
  const [uploadedDoc, setUploadedDoc] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Tank & Warehouse
  const [selectedTank, setSelectedTank] = useState<string | null>(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null)

  const selected = plans.find((p) => p.id === selectedId) || null
  const step = selected ? getStepIndex(selected.status, selected.productType) : 0
  
  const isSolidFlow = selected?.productType === "solid"
  const isRejectedFlow = selected && (selected.status === "quality_rejected" || selected.status === "checked_out_after_rejection")

  const currentSteps = isSolidFlow ? STEPS_SOLID : isRejectedFlow ? STEPS_REJECT : STEPS_ACCEPT

  const updatePlan = (id: string, patch: Partial<DeliveryPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  // ── Actions ──
  const checkInVehicle = () => {
    if (!selected) return
    const gross = parseFloat(gateForm.grossWeight) || 48.5
    const tare = parseFloat(gateForm.tareWeight) || 18.5
    
    updatePlan(selected.id, {
      status: "checked_in",
      gateEntry: {
        vehicleNo: selected.vehicleNumber,
        grossWeight: gross,
        tareWeight: tare,
        netWeight: parseFloat((gross - tare).toFixed(2)),
        entryTime: gateForm.entryTime,
      },
    })
    setGateForm({ grossWeight: "", tareWeight: "", entryTime: new Date().toLocaleString() })
  }

  const initiateSampling = () => {
    if (!selected) return
    updatePlan(selected.id, {
      status: "quality_under_process",
      sampling: {
        sampleId: `SMP-${Date.now().toString().slice(-6)}`,
        time: new Date().toLocaleString()
      }
    })
  }

  const submitQC = () => {
    if (!selected || !qcDecision) return alert("Please select Approve / Reject / Hold.")
    
    if (qcDecision !== "hold" && !uploadedDoc && !selected.qualityResults?.documentName) {
      return alert("Document upload is mandatory for Approval or Rejection.")
    }

    const vals = { 
      ffa: parseFloat(qcForm.ffa) || 0, 
      mi: parseFloat(qcForm.mi) || 0, 
      color: parseFloat(qcForm.color) || 0, 
      iv: parseFloat(qcForm.iv) || 0, 
      dobi: parseFloat(qcForm.dobi) || 0 
    }
    
    const newStatus: WorkflowStatus = qcDecision === "approved" ? "quality_approved" : qcDecision === "rejected" ? "quality_rejected" : "quality_hold"
    
    updatePlan(selected.id, {
      status: newStatus,
      qualityResults: { ...vals, decision: qcDecision, remarks: qcForm.remarks, documentName: uploadedDoc?.name || selected.qualityResults?.documentName },
    })
    setQcSubmitted(false)
    setQcDecision(null)
    setQcForm({ ffa: "", mi: "", color: "", iv: "", dobi: "", remarks: "" })
    setUploadedDoc(null)
  }

  const allocateTank = () => {
    if (!selected || !selectedTank) return
    const tank = allTanks.find((t) => t.id === selectedTank)!
    updatePlan(selected.id, {
      status: "tank_allocated",
      tankAllocation: { tankId: tank.id, tankName: tank.name, availableCapacity: tank.capacity - tank.current },
    })
    setSelectedTank(null)
  }

  const generateGRN = () => {
    if (!selected) return
    const netQty = selected.gateEntry?.netWeight || selected.quantity
    const grnNo = `GRN-${Date.now().toString().slice(-8)}`
    updatePlan(selected.id, {
      status: "grn_generated",
      grn: { grnNo, date: new Date().toISOString().split("T")[0], receivedQty: netQty },
    })
  }

  const generateSolidGRN = () => {
    if (!selected || !selectedWarehouse) return
    const warehouse = allWarehouses.find((w) => w.id === selectedWarehouse)!
    const netQty = selected.gateEntry?.netWeight || selected.quantity
    const grnNo = `GRN-${Date.now().toString().slice(-8)}`
    updatePlan(selected.id, {
      status: "grn_generated",
      warehouseAllocation: { warehouseId: warehouse.id, warehouseName: warehouse.name },
      grn: { grnNo, date: new Date().toISOString().split("T")[0], receivedQty: netQty },
    })
    setSelectedWarehouse(null)
  }

  const checkOutVehicle = () => {
    if (!selected) return
    const newStatus = selected.status === "quality_rejected" ? "checked_out_after_rejection" : "checked_out_after_acceptance"
    updatePlan(selected.id, {
      status: newStatus,
      checkOut: { time: new Date().toLocaleString() }
    })
  }

  const availableTanksForProduct = allTanks.filter(
    (t) => t.product === selected?.product && t.capacity - t.current > 0
  )

  // Groups for left panel list
  const activePlans = plans.filter(p => !["checked_out_after_acceptance", "checked_out_after_rejection"].includes(p.status))
  const completedPlans = plans.filter(p => ["checked_out_after_acceptance", "checked_out_after_rejection"].includes(p.status))

  // ── Render ──
  return (
    <div className="flex h-full gap-4 min-h-0">
      {/* Left Panel: Delivery Plan List */}
      <div className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Vehicle Status</h3>
          <div className="grid grid-cols-2 gap-2 mb-1">
            <div className="text-center bg-slate-50 rounded py-2 border border-slate-100">
              <div className="text-sm font-bold text-slate-800">{plans.filter(p => p.status === "yet_to_come").length}</div>
              <div className="text-[10px] text-slate-500 leading-tight">Yet to Come</div>
            </div>
            <div className="text-center bg-violet-50 rounded py-2 border border-violet-100">
              <div className="text-sm font-bold text-violet-800">{plans.filter(p => p.status === "checked_in").length}</div>
              <div className="text-[10px] text-violet-600 leading-tight">Checked In</div>
            </div>
            <div className="text-center bg-amber-50 rounded py-2 border border-amber-100">
              <div className="text-sm font-bold text-amber-800">{plans.filter(p => p.status === "quality_under_process").length}</div>
              <div className="text-[10px] text-amber-600 leading-tight">QC Process</div>
            </div>
            <div className="text-center bg-orange-50 rounded py-2 border border-orange-100">
              <div className="text-sm font-bold text-orange-800">{plans.filter(p => p.status === "quality_hold").length}</div>
              <div className="text-[10px] text-orange-600 leading-tight">Hold</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mt-2">Active Vehicles</h4>
          {activePlans.map((plan) => {
            const meta = statusMeta(plan.status)
            const isSelected = plan.id === selectedId
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedId(plan.id)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-800">{plan.vehicleNumber}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${meta.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium truncate">{plan.vendor}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{plan.product} · {plan.quantity} MT</p>
              </button>
            )
          })}

          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mt-4">Checked Out</h4>
          {completedPlans.map((plan) => {
            const meta = statusMeta(plan.status)
            const isSelected = plan.id === selectedId
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedId(plan.id)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all opacity-80 ${
                  isSelected
                    ? "border-slate-400 bg-slate-50 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-800">{plan.vehicleNumber}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${meta.color}`}>
                    <span className={`w-1 h-1 rounded-full ${meta.dot}`} />
                    {meta.label.replace("Checked Out (", "").replace(")", "")}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium truncate">{plan.vendor}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Panel: Workflow */}
      {selected ? (
        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2 pb-8">
          {/* Step Progress */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-800">{selected.vehicleNumber} — {selected.vendor}</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusMeta(selected.status).color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta(selected.status).dot}`} />
                {statusMeta(selected.status).label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-5">{selected.product} · {selected.quantity} MT · PO: {selected.poRef} · Driver: {selected.driverName}</p>

            {/* Stepper */}
            <div className="flex items-center">
              {currentSteps.map((label, idx) => {
                const done = idx < step
                const active = idx === step
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                        done ? "bg-emerald-500 border-emerald-500 text-white"
                        : active ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-200 text-slate-400"
                      }`}>
                        {done ? <Icon name="check" size={12} /> : idx + 1}
                      </div>
                      <span className={`text-[9px] font-semibold whitespace-nowrap ${active ? "text-blue-700" : done ? "text-emerald-600" : "text-slate-400"}`}>
                        {label}
                      </span>
                    </div>
                    {idx < currentSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 ${idx < step ? "bg-emerald-400" : "bg-slate-200"}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Step Content ── */}

          {/* Step 0: Yet to Come / Expected */}
          {step === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
                Expected Vehicle & Check In
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                {[
                  { label: "Vehicle Number", value: selected.vehicleNumber },
                  { label: "Driver Name", value: selected.driverName },
                  { label: "Driver Phone", value: selected.driverPhone },
                  { label: "Product", value: selected.product },
                  { label: "Planned Qty (MT)", value: `${selected.quantity} MT` },
                  { label: "Expected Date", value: selected.expectedDate },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] text-slate-400 font-medium">{f.label}</p>
                    <p className="text-xs font-semibold text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-700 mb-3">Record Vehicle Weights at Gate</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Gross Weight (MT) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={gateForm.grossWeight}
                      onChange={(e) => setGateForm((f) => ({ ...f, grossWeight: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      placeholder="e.g. 48.2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Tare Weight (MT) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={gateForm.tareWeight}
                      onChange={(e) => setGateForm((f) => ({ ...f, tareWeight: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      placeholder="e.g. 18.2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Net Weight (MT)</label>
                    <div className="w-full px-3 py-1.5 border border-slate-100 bg-slate-50 rounded-lg text-xs font-bold text-blue-700">
                      {gateForm.grossWeight && gateForm.tareWeight
                        ? `${(parseFloat(gateForm.grossWeight) - parseFloat(gateForm.tareWeight)).toFixed(2)} MT`
                        : "—"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-[10px] text-slate-400">Recording weights moves vehicle to 'Checked In' status</p>
                  <Button variant="primary" onClick={checkInVehicle} icon="check-circle">
                    Check In Vehicle
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Checked In -> Initiate Sampling (Liquid) or Warehouse GRN (Solid) */}
          {step === 1 && selected.gateEntry && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold">2</span>
                Vehicle Checked In
              </h3>
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                {[
                  { label: "Vehicle No", value: selected.gateEntry.vehicleNo },
                  { label: "Gross Weight", value: `${selected.gateEntry.grossWeight} MT` },
                  { label: "Tare Weight", value: `${selected.gateEntry.tareWeight} MT` },
                  { label: "Net Weight", value: `${selected.gateEntry.netWeight} MT` },
                  { label: "Entry Time", value: selected.gateEntry.entryTime },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] text-slate-400">{f.label}</p>
                    <p className="text-xs font-bold text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>

              {isSolidFlow ? (
                <div className="border-t border-slate-100 pt-5 mt-5">
                  <h4 className="text-xs font-bold text-slate-800 mb-3">Allocate Warehouse & Generate GRN</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                     {allWarehouses.map(w => {
                       const available = w.capacity - w.current
                       const canFit = available >= (selected.gateEntry?.netWeight || selected.quantity)
                       const isSelected = selectedWarehouse === w.id
                       return (
                         <button
                            key={w.id}
                            onClick={() => setSelectedWarehouse(isSelected ? null : w.id)}
                            disabled={!canFit}
                            className={`text-left rounded-xl border p-3 transition-all ${
                              isSelected ? "border-blue-500 bg-blue-50 shadow-md"
                              : canFit ? "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                              : "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-bold text-slate-800">{w.name}</p>
                              {!canFit && <span className="text-[9px] text-red-500 font-bold">Insufficient</span>}
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Capacity: {w.capacity} MT</span>
                              <span className="font-semibold text-slate-700">{available} MT free</span>
                            </div>
                          </button>
                       )
                     })}
                  </div>
                  <div className="flex justify-end mt-4">
                     <Button variant="primary" onClick={generateSolidGRN} icon="check-circle" disabled={!selectedWarehouse}>
                        Allocate & Generate GRN
                     </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                  <p className="text-[11px] text-slate-500">Vehicle is waiting for QA lab to collect sample.</p>
                  <Button variant="primary" onClick={initiateSampling} icon="flask-conical">
                    Initiate Sampling
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Quality Testing */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">3</span>
                Quality Under Process
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">Sample ID: <strong className="text-slate-700">{selected.sampling?.sampleId}</strong> · Collected At: {selected.sampling?.time}</p>

              {selected.qualityResults ? (
                /* Show Results */
                <div>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {QC_PARAMS.map((p) => {
                      const val = selected.qualityResults![p.key as keyof typeof selected.qualityResults] as number
                      const pass = passCheck(p.key, val)
                      return (
                        <div key={p.key} className={`rounded-lg p-3 border ${pass ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"}`}>
                          <p className="text-[9px] text-slate-500 font-medium leading-tight mb-1">{p.label}</p>
                          <p className={`text-base font-bold ${pass ? "text-emerald-700" : "text-red-600"}`}>{val}{p.unit}</p>
                          <span className={`text-[9px] font-bold ${pass ? "text-emerald-600" : "text-red-500"}`}>{pass ? "✓ Pass" : "✗ Fail"}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                    <div>
                      <p className="text-[10px] text-slate-500">Remarks</p>
                      <p className="text-xs font-medium text-slate-700">{selected.qualityResults.remarks || "—"}</p>
                    </div>
                    {selected.qualityResults.documentName && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <Icon name="file-text" size={14} className="text-blue-500" />
                        <span className="text-[11px] font-bold text-slate-700">{selected.qualityResults.documentName}</span>
                      </div>
                    )}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      selected.qualityResults.decision === "approved" ? "bg-emerald-100 text-emerald-700"
                      : selected.qualityResults.decision === "rejected" ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                    }`}>
                      Decision: {selected.qualityResults.decision.charAt(0).toUpperCase() + selected.qualityResults.decision.slice(1)}
                    </span>
                  </div>
                  
                  {selected.status === "quality_hold" && (
                     <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
                       <div>
                         <p className="text-sm font-bold text-orange-800">Batch On Hold</p>
                         <p className="text-[11px] text-orange-600">This vehicle is awaiting re-test or management approval. No further action can be taken right now.</p>
                       </div>
                       <Icon name="alert-circle" size={24} className="text-orange-500" />
                     </div>
                  )}
                </div>
              ) : (
                /* Enter Results Form */
                <div>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {QC_PARAMS.map((p) => {
                      const val = parseFloat(qcForm[p.key as keyof typeof qcForm] as string)
                      const hasVal = !isNaN(val)
                      const pass = hasVal ? passCheck(p.key, val) : null
                      return (
                        <div key={p.key}>
                          <label className="text-[10px] font-semibold text-slate-600 block mb-1">{p.label}</label>
                          <input
                            type="number"
                            step="0.01"
                            value={qcForm[p.key as keyof typeof qcForm]}
                            onChange={(e) => setQcForm((f) => ({ ...f, [p.key]: e.target.value }))}
                            className={`w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-blue-500 ${
                              pass === true ? "border-emerald-300 bg-emerald-50"
                              : pass === false ? "border-red-300 bg-red-50"
                              : "border-slate-200"
                            }`}
                            placeholder={`${p.unit}`}
                          />
                          {hasVal && (
                            <p className={`text-[9px] mt-0.5 font-bold ${pass ? "text-emerald-600" : "text-red-500"}`}>
                              {pass ? "✓ Pass" : "✗ Fail"}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">QC Remarks</label>
                      <textarea
                        value={qcForm.remarks}
                        onChange={(e) => setQcForm((f) => ({ ...f, remarks: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="Enter quality remarks..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">Upload QC Document <span className="text-red-500">*</span></label>
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedDoc(e.target.files[0])
                          }
                        }}
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-[58px] border border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        {uploadedDoc ? (
                          <>
                            <Icon name="file-text" size={16} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-700 truncate px-2">{uploadedDoc.name}</span>
                          </>
                        ) : (
                          <>
                            <Icon name="upload-cloud" size={16} className="text-slate-400" />
                            <span className="text-xs text-slate-500">Click to upload report</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {!qcSubmitted ? (
                    <div className="flex justify-end">
                      <Button variant="primary" onClick={() => setQcSubmitted(true)}>Submit Test Results</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs font-semibold text-slate-700 mr-auto">Select Decision:</p>
                      <button
                        onClick={() => { setQcDecision("approved"); submitQC() }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => { setQcDecision("hold"); submitQC() }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        ⏸ Hold
                      </button>
                      <button
                        onClick={() => { setQcDecision("rejected"); submitQC() }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3 (Accepted): Tank Allocation (Pre-Discharge) */}
          {step === 3 && selected.status === "quality_approved" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">4</span>
                Pre-Discharge (Tank Allocation)
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Select an available tank for <strong className="text-slate-700">{selected.product}</strong> · Net Qty: <strong className="text-slate-700">{selected.gateEntry?.netWeight} MT</strong>
              </p>

              {selected.tankAllocation ? (
                <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <Icon name="database" size={20} className="text-teal-600" />
                  <div>
                    <p className="text-xs font-bold text-teal-700">{selected.tankAllocation.tankName}</p>
                    <p className="text-[10px] text-teal-600">Allocated · Available Capacity: {selected.tankAllocation.availableCapacity} MT</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {availableTanksForProduct.map((tank) => {
                      const fillPct = Math.round((tank.current / tank.capacity) * 100)
                      const available = tank.capacity - tank.current
                      const canFit = available >= (selected.gateEntry?.netWeight || selected.quantity)
                      const isSelected = selectedTank === tank.id
                      return (
                        <button
                          key={tank.id}
                          onClick={() => setSelectedTank(isSelected ? null : tank.id)}
                          disabled={!canFit}
                          className={`text-left rounded-xl border p-3 transition-all ${
                            isSelected ? "border-blue-500 bg-blue-50 shadow-md"
                            : canFit ? "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                            : "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-slate-800">{tank.name}</p>
                            {!canFit && <span className="text-[9px] text-red-500 font-bold">Insufficient</span>}
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2">
                            <div
                              className={`h-1.5 rounded-full ${fillPct > 85 ? "bg-red-400" : fillPct > 60 ? "bg-amber-400" : "bg-emerald-400"}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{fillPct}% filled</span>
                            <span className="font-semibold text-slate-700">{available} MT free</span>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1">Capacity: {tank.capacity} MT</p>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-[10px] text-slate-400">Allocating a tank will mark Pre-Discharge as complete</p>
                    <Button variant="primary" onClick={allocateTank} icon="check-circle" disabled={!selectedTank}>
                      Allocate Tank
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4 (Liquid) or Step 2 (Solid): GRN Generation */}
          {((step === 4 && !isSolidFlow && selected.status === "tank_allocated") || (step === 2 && isSolidFlow && selected.status === "grn_generated")) && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                  {isSolidFlow ? "3" : "5"}
                </span>
                Goods Receipt Note (GRN)
              </h3>

              {selected.grn ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="check-circle" size={16} className="text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-700">GRN Generated Successfully</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "GRN Number", value: selected.grn.grnNo },
                      { label: "Date", value: selected.grn.date },
                      { label: "Received Qty", value: `${selected.grn.receivedQty} MT` },
                      { label: isSolidFlow ? "Allocated Warehouse" : "Allocated Tank", value: isSolidFlow ? selected.warehouseAllocation?.warehouseName || "—" : selected.tankAllocation?.tankName || "—" },
                      { label: "Supplier", value: selected.vendor },
                      { label: "Product", value: selected.product },
                      { label: "PO Reference", value: selected.poRef },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-[10px] text-slate-500">{f.label}</p>
                        <p className="text-xs font-bold text-slate-800">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-4 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    {[
                      { label: "Supplier", value: selected.vendor },
                      { label: "Product", value: selected.product },
                      { label: "Net Received Qty", value: `${selected.gateEntry?.netWeight} MT` },
                      { label: "Allocated Tank", value: selected.tankAllocation?.tankName || "—" },
                      { label: "PO Reference", value: selected.poRef },
                      { label: "Gate Entry Ref", value: selected.gateEntry ? "GE-" + selected.code : "—" },
                      { label: "Quality Document", value: selected.qualityResults?.documentName || "—" },
                      { label: "QC Decision", value: "✓ Approved" },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-[10px] text-slate-400 truncate">{f.label}</p>
                        <p className="text-xs font-semibold text-slate-800 truncate">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-slate-400">GRN will be auto-numbered and inventory will be updated.</p>
                    <Button variant="primary" onClick={generateGRN} icon="file-plus">
                      Generate GRN
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3/5: Check Out Flow */}
          {((step === 5 && !isSolidFlow && selected.status === "grn_generated") || 
            (step === 3 && isSolidFlow && selected.status === "grn_generated") || 
            (step === 3 && !isSolidFlow && selected.status === "quality_rejected")) && (
            <div className={`bg-white rounded-xl border shadow-sm p-5 ${selected.status === "quality_rejected" ? "border-red-200" : "border-slate-200"}`}>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  selected.status === "quality_rejected" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {selected.status === "quality_rejected" ? "4" : isSolidFlow ? "4" : "6"}
                </span>
                Vehicle Check Out
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">
                    {selected.status === "quality_rejected" 
                      ? "Vehicle was rejected due to quality failure. Record vehicle exit from the facility." 
                      : "Goods Receipt has been posted. Record vehicle exit from the facility."}
                  </p>
                  <p className="text-xs font-bold text-slate-800">{selected.vehicleNumber} — {selected.driverName}</p>
                </div>
                <button
                  onClick={checkOutVehicle}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  <Icon name="log-out" size={14} />
                  Check Out Vehicle
                </button>
              </div>
            </div>
          )}
          
          {/* Checked Out Message */}
          {["checked_out_after_acceptance", "checked_out_after_rejection"].includes(selected.status) && (
             <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center py-10 mt-4">
               <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-3">
                 <Icon name="log-out" size={24} />
               </div>
               <h3 className="text-sm font-bold text-slate-800 mb-1">Vehicle Checked Out</h3>
               <p className="text-[11px] text-slate-500">
                 This vehicle completed its workflow ({selected.status === "checked_out_after_rejection" ? "Rejected" : "Accepted"}) and left the facility at {selected.checkOut?.time}.
               </p>
             </div>
          )}

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Icon name="truck" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Select a vehicle to view workflow</p>
          </div>
        </div>
      )}
    </div>
  )
}
