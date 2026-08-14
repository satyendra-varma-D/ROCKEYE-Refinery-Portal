import { useState } from "react"
import { Button, Icon } from "./DesignSystem"

// ── Types ──────────────────────────────────────────────────────────────────────
type WorkflowStatus =
  | "scheduled"
  | "gate_entry"
  | "sampling"
  | "quality_approved"
  | "quality_rejected"
  | "quality_hold"
  | "tank_allocated"
  | "grn_generated"

interface DeliveryPlan {
  id: string
  code: string
  vendor: string
  product: string
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
    sampleId: string
  }
  qualityResults?: {
    ffa: number
    mi: number
    color: number
    iv: number
    dobi: number
    decision: "approved" | "rejected" | "hold"
    remarks: string
  }
  tankAllocation?: { tankId: string; tankName: string; availableCapacity: number }
  grn?: { grnNo: string; date: string; receivedQty: number }
}

interface Tank {
  id: string
  name: string
  product: string
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

const initialPlans: DeliveryPlan[] = [
  {
    id: "dp-1",
    code: "DPL-2026-9901",
    vendor: "Sime Darby Oils Trading",
    product: "Crude Palm Oil (CPO)",
    quantity: 25,
    expectedDate: "2026-08-14",
    poRef: "HOM-PO-10219",
    driverName: "Raju Kumar",
    driverPhone: "+60-12-345-6789",
    vehicleNumber: "WAA 1234 A",
    status: "scheduled",
  },
  {
    id: "dp-2",
    code: "DPL-2026-9902",
    vendor: "IOI Oleochemical Industries",
    product: "Crude Palm Oil (CPO)",
    quantity: 30,
    expectedDate: "2026-08-13",
    poRef: "HOM-PO-10218",
    driverName: "Ahmad Fauzi",
    driverPhone: "+60-16-789-0012",
    vehicleNumber: "WBB 5678 B",
    status: "quality_approved",
    gateEntry: {
      vehicleNo: "WBB 5678 B",
      grossWeight: 48.2,
      tareWeight: 18.2,
      netWeight: 30.0,
      entryTime: "2026-08-13 09:30",
      sampleId: "SMP-2026-9043",
    },
    qualityResults: {
      ffa: 3.8,
      mi: 0.18,
      color: 2.1,
      iv: 52.4,
      dobi: 2.7,
      decision: "approved",
      remarks: "All parameters within acceptable range.",
    },
  },
  {
    id: "dp-3",
    code: "DPL-2026-9900",
    vendor: "Seri Maju Trading Sdn. Bhd.",
    product: "Crude Palm Oil (CPO)",
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
      sampleId: "SMP-2026-9042",
    },
    qualityResults: {
      ffa: 4.2,
      mi: 0.15,
      color: 1.9,
      iv: 51.8,
      dobi: 2.9,
      decision: "approved",
      remarks: "Batch meets standard specifications.",
    },
    tankAllocation: { tankId: "T101", tankName: "Tank T-101", availableCapacity: 320 },
    grn: { grnNo: "GRN-2026-0812", date: "2026-08-12", receivedQty: 19.8 },
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function getStepIndex(status: WorkflowStatus): number {
  const map: Record<WorkflowStatus, number> = {
    scheduled: 0,
    gate_entry: 1,
    sampling: 2,
    quality_approved: 2,
    quality_rejected: 2,
    quality_hold: 2,
    tank_allocated: 3,
    grn_generated: 4,
  }
  return map[status]
}

function statusMeta(status: WorkflowStatus) {
  const map: Record<WorkflowStatus, { label: string; color: string; dot: string }> = {
    scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
    gate_entry: { label: "Vehicle Arrived", color: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
    sampling: { label: "Sampling", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    quality_approved: { label: "Quality Approved", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    quality_rejected: { label: "Quality Rejected", color: "bg-red-50 text-red-700", dot: "bg-red-500" },
    quality_hold: { label: "On Hold", color: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
    tank_allocated: { label: "Tank Allocated", color: "bg-teal-50 text-teal-700", dot: "bg-teal-500" },
    grn_generated: { label: "GRN Generated", color: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  }
  return map[status]
}

const STEPS = ["Delivery Plan", "Gate Entry", "Quality Test", "Tank Allocation", "GRN"]

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

  // Tank
  const [selectedTank, setSelectedTank] = useState<string | null>(null)

  const selected = plans.find((p) => p.id === selectedId) || null
  const step = selected ? getStepIndex(selected.status) : 0

  const updatePlan = (id: string, patch: Partial<DeliveryPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  // ── Actions ──
  const allowVehicleIn = () => {
    if (!selected) return
    const gross = parseFloat(gateForm.grossWeight)
    const tare = parseFloat(gateForm.tareWeight)
    if (!gross || !tare) return alert("Please enter gross and tare weights.")
    updatePlan(selected.id, {
      status: "sampling",
      gateEntry: {
        vehicleNo: selected.vehicleNumber,
        grossWeight: gross,
        tareWeight: tare,
        netWeight: parseFloat((gross - tare).toFixed(2)),
        entryTime: gateForm.entryTime,
        sampleId: `SMP-${Date.now().toString().slice(-6)}`,
      },
    })
    setGateForm({ grossWeight: "", tareWeight: "", entryTime: new Date().toLocaleString() })
  }

  const submitQC = () => {
    if (!selected || !qcDecision) return alert("Please select Approve / Reject / Hold.")
    const vals = { ffa: parseFloat(qcForm.ffa), mi: parseFloat(qcForm.mi), color: parseFloat(qcForm.color), iv: parseFloat(qcForm.iv), dobi: parseFloat(qcForm.dobi) }
    if (Object.values(vals).some(isNaN)) return alert("Please fill all quality parameters.")
    const newStatus: WorkflowStatus = qcDecision === "approved" ? "quality_approved" : qcDecision === "rejected" ? "quality_rejected" : "quality_hold"
    updatePlan(selected.id, {
      status: newStatus,
      qualityResults: { ...vals, decision: qcDecision, remarks: qcForm.remarks },
    })
    setQcSubmitted(false)
    setQcDecision(null)
    setQcForm({ ffa: "", mi: "", color: "", iv: "", dobi: "", remarks: "" })
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

  const availableTanksForProduct = allTanks.filter(
    (t) => t.product === selected?.product && t.capacity - t.current > 0
  )

  // ── Render ──
  return (
    <div className="flex h-full gap-4 min-h-0">
      {/* Left Panel: Delivery Plan List */}
      <div className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Inbound Deliveries</h3>
          <div className="grid grid-cols-3 gap-2 mb-1">
            {(["scheduled","gate_entry","sampling"] as WorkflowStatus[]).map((s) => (
              <div key={s} className="text-center">
                <div className="text-lg font-bold text-slate-800">{plans.filter((p) => p.status === s).length}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{statusMeta(s).label}</div>
              </div>
            ))}
          </div>
        </div>

        {plans.map((plan) => {
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
                <span className="text-[11px] font-bold text-slate-800">{plan.code}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${meta.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium truncate">{plan.vendor}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{plan.product} · {plan.quantity} MT</p>
              <p className="text-[10px] text-slate-400">Expected: {plan.expectedDate}</p>
            </button>
          )
        })}
      </div>

      {/* Right Panel: Workflow */}
      {selected ? (
        <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Step Progress */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-800">{selected.code} — {selected.vendor}</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusMeta(selected.status).color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta(selected.status).dot}`} />
                {statusMeta(selected.status).label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-5">{selected.product} · {selected.quantity} MT · PO: {selected.poRef}</p>

            {/* Stepper */}
            <div className="flex items-center">
              {STEPS.map((label, idx) => {
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
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 ${idx < step ? "bg-emerald-400" : "bg-slate-200"}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Step Content ── */}

          {/* Step 0: Delivery Plan Details + Gate Entry form */}
          {step === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
                Delivery Plan & Gate Entry
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: "Driver Name", value: selected.driverName },
                  { label: "Driver Phone", value: selected.driverPhone },
                  { label: "Vehicle Number", value: selected.vehicleNumber },
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
                <p className="text-xs font-bold text-slate-700 mb-3">Record Vehicle Entry & Weights</p>
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
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400">Sample will be collected automatically upon entry</p>
                  <Button variant="primary" onClick={allowVehicleIn} icon="check-circle">
                    Allow Vehicle In & Collect Sample
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Gate Entry done, show gate info */}
          {step === 1 && selected.gateEntry && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold">2</span>
                Gate Entry Recorded
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Vehicle No", value: selected.gateEntry.vehicleNo },
                  { label: "Gross Weight", value: `${selected.gateEntry.grossWeight} MT` },
                  { label: "Tare Weight", value: `${selected.gateEntry.tareWeight} MT` },
                  { label: "Net Weight", value: `${selected.gateEntry.netWeight} MT` },
                  { label: "Entry Time", value: selected.gateEntry.entryTime },
                  { label: "Sample ID", value: selected.gateEntry.sampleId },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] text-slate-400">{f.label}</p>
                    <p className="text-xs font-bold text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Quality Testing */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">3</span>
                Quality Sampling & Testing
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">Sample ID: <strong className="text-slate-700">{selected.gateEntry?.sampleId}</strong> · Product: {selected.product}</p>

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
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                    <div>
                      <p className="text-[10px] text-slate-500">Remarks</p>
                      <p className="text-xs font-medium text-slate-700">{selected.qualityResults.remarks || "—"}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      selected.qualityResults.decision === "approved" ? "bg-emerald-100 text-emerald-700"
                      : selected.qualityResults.decision === "rejected" ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                    }`}>
                      Decision: {selected.qualityResults.decision.charAt(0).toUpperCase() + selected.qualityResults.decision.slice(1)}
                    </span>
                  </div>
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
                  <div className="mb-4">
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">QC Remarks</label>
                    <textarea
                      value={qcForm.remarks}
                      onChange={(e) => setQcForm((f) => ({ ...f, remarks: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Enter quality remarks..."
                    />
                  </div>
                  {!qcSubmitted ? (
                    <div className="flex justify-end">
                      <Button variant="primary" onClick={() => setQcSubmitted(true)}>Submit Test Results</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-700 mr-auto">Select Decision:</p>
                      <button
                        onClick={() => { setQcDecision("approved"); submitQC() }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => { setQcDecision("hold"); submitQC() }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        ⏸ Hold
                      </button>
                      <button
                        onClick={() => { setQcDecision("rejected"); submitQC() }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Tank Allocation */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">4</span>
                Tank Allocation
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
                  <div className="flex justify-end">
                    <Button variant="primary" onClick={allocateTank} icon="check-circle" disabled={!selectedTank}>
                      Allocate Tank & Proceed
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4: GRN Generation */}
          {step === 4 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">5</span>
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
                      { label: "Allocated Tank", value: selected.tankAllocation?.tankName || "—" },
                      { label: "Supplier", value: selected.vendor },
                      { label: "Product", value: selected.product },
                      { label: "PO Reference", value: selected.poRef },
                      { label: "Sample ID", value: selected.gateEntry?.sampleId || "—" },
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
                      { label: "Quality Test Ref", value: selected.gateEntry?.sampleId || "—" },
                      { label: "QC Decision", value: selected.qualityResults?.decision === "approved" ? "✓ Approved" : "—" },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-[10px] text-slate-400">{f.label}</p>
                        <p className="text-xs font-semibold text-slate-800">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-slate-400">GRN will be auto-numbered and inventory will be updated.</p>
                    <Button variant="primary" onClick={generateGRN} icon="check-circle">
                      Generate GRN & Update Inventory
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Rejected / Hold notice */}
          {(selected.status === "quality_rejected" || selected.status === "quality_hold") && (
            <div className={`rounded-xl border p-4 ${selected.status === "quality_rejected" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
              <div className="flex items-start gap-3">
                <Icon name="alert-triangle" size={16} className={selected.status === "quality_rejected" ? "text-red-500 mt-0.5" : "text-orange-500 mt-0.5"} />
                <div>
                  <p className={`text-sm font-bold ${selected.status === "quality_rejected" ? "text-red-700" : "text-orange-700"}`}>
                    {selected.status === "quality_rejected" ? "Batch Rejected — Vehicle to be Returned" : "Batch On Hold — Awaiting Re-Test or Approval"}
                  </p>
                  <p className={`text-xs mt-0.5 ${selected.status === "quality_rejected" ? "text-red-500" : "text-orange-500"}`}>
                    Remarks: {selected.qualityResults?.remarks || "No remarks provided."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Icon name="package" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Select a delivery plan to view workflow</p>
          </div>
        </div>
      )}
    </div>
  )
}
