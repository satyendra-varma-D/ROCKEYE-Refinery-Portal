import React, { useState, useEffect } from "react"
import { Icon } from "./DesignSystem"
import { ModuleConfig } from "../types"

interface ProductionPlanningViewProps {
  db: ModuleConfig[]
  setDb: React.Dispatch<React.SetStateAction<ModuleConfig[]>>
}

export function ProductionPlanningView({
  db,
  setDb,
}: ProductionPlanningViewProps) {
  const [planningTab, setPlanningTab] = useState<"monthly" | "weekly">(
    "monthly",
  )

  // Default allocations
  const [allocations, setAllocations] = useState<Record<string, string>>({
    "so-1": "Week 1",
    "so-2": "Week 2",
    "so-3": "Week 3",
    "so-4": "Week 4",
  })

  const [weeklyAllocations, setWeeklyAllocations] =
    useState<Record<string, string>>({
      "so-1": "Monday",
      "so-2": "Wednesday",
      "so-3": "Thursday",
      "so-4": "Friday",
    })

  // Fetch sales orders dynamically
  const salesOrders =
    db
      .find((m) => m.key === "commercial")
      ?.transactions.find((t) => t.key === "salesorder")?.defaultData || []

  const updateSalesOrderPlanningStatus = (
    orderId: string,
    week: string,
    day: string,
  ) => {
    setDb((prevDb) => {
      const commercialMod = prevDb.find((m) => m.key === "commercial")
      const salesOrderTrx = commercialMod?.transactions.find((t) => t.key === "salesorder")
      const targetSo = salesOrderTrx?.defaultData.find((so) => so.id === orderId)
      if (!targetSo) return prevDb

      return prevDb.map((mod) => {
        if (mod.key === "commercial") {
          return {
            ...mod,
            transactions: mod.transactions.map((trx) => {
              if (trx.key !== "salesorder") return trx
              return {
                ...trx,
                defaultData: trx.defaultData.map((so) => {
                  if (so.id !== orderId) return so
                  let statusText = "Awaiting Schedule"
                  if (week !== "Unscheduled") {
                    statusText = `Planned for June - ${week}`
                    if (day !== "Unscheduled") {
                      statusText = `Planned for June - ${week} (${day})`
                    }
                  }
                  return {
                    ...so,
                    workflowStep: statusText,
                  }
                }),
              }
            }),
          }
        }

        if (mod.key === "production") {
          return {
            ...mod,
            transactions: mod.transactions.map((trx) => {
              if (trx.key !== "prodorder") return trx

              const existingProdOrderIdx = trx.defaultData.findIndex(
                (po) => po.details?.salesOrderRef === targetSo.code,
              )

              let updatedDefaultData = [...trx.defaultData]

              if (day === "Unscheduled") {
                if (existingProdOrderIdx !== -1) {
                  updatedDefaultData.splice(existingProdOrderIdx, 1)
                }
              } else {
                if (existingProdOrderIdx !== -1) {
                  updatedDefaultData[existingProdOrderIdx] = {
                    ...updatedDefaultData[existingProdOrderIdx],
                    status: "Planned",
                    workflowStep: "Ready to Run",
                    details: {
                      ...updatedDefaultData[existingProdOrderIdx].details,
                      plannedWeek: week,
                      scheduledDay: day,
                    },
                  }
                } else {
                  const newPoId = `po-ord-${Date.now()}`
                  const newPoCode = `PRD-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`
                  updatedDefaultData.push({
                    id: newPoId,
                    code: newPoCode,
                    date: new Date().toISOString().split("T")[0],
                    status: "Planned",
                    workflowStep: "Ready to Run",
                    createdAt: new Date().toISOString().split("T")[0],
                    createdBy: "Production Planner",
                    auditTrail: [
                      {
                        timestamp: new Date()
                          .toISOString()
                          .replace("T", " ")
                          .slice(0, 16),
                        user: "System",
                        action: "Generated from Production Plan Allocation",
                      },
                    ],
                    activities: [],
                    comments: [],
                    attachments: [],
                    details: {
                      salesOrderRef: targetSo.code,
                      product: targetSo.details?.product || targetSo.name || "",
                      quantity: targetSo.details?.quantity || 100,
                      startDate:
                        targetSo.details?.requestedDeliveryDate ||
                        new Date().toISOString().split("T")[0],
                      plannedWeek: week,
                      scheduledDay: day,
                    },
                  })
                }
              }

              return {
                ...trx,
                defaultData: updatedDefaultData,
              }
            }),
          }
        }

        return mod
      })
    })
  }

  useEffect(() => {
    // Perform initial sync of default allocations
    Object.keys(allocations).forEach((id) => {
      updateSalesOrderPlanningStatus(
        id,
        allocations[id],
        weeklyAllocations[id] || "Unscheduled",
      )
    })
  }, [])

  // Calculate current CPO storage stock
  const cpoTanks =
    db.find((m) => m.key === "tankfarm")?.masters.find((t) => t.key === "tank")
      ?.defaultData || []
  const currentCpoStock = cpoTanks.reduce((acc, t) => {
    if (t.details?.tankTag === "Crude Palm Oil Tank") {
      return acc + Number(t.details?.currentVolume || 0)
    }
    return acc
  }, 0)

  // Compute raw material requirement based on currently allocated orders
  const scheduledOrders = salesOrders.filter(
    (so) => allocations[so.id] && allocations[so.id] !== "Unscheduled",
  )
  const totalScheduledQty = scheduledOrders.reduce(
    (acc, so) => acc + Number(so.details?.quantity || 0),
    0,
  )

  // Palm oil recipes
  const cpoRequired = totalScheduledQty * 1.05 // 5% refining/loss factor
  const bleachingEarthRequired = totalScheduledQty * 0.015 // 1.5% dosage
  const phosphoricAcidRequired = totalScheduledQty * 0.002 // 0.2% dosage

  const CPO_STOCK = currentCpoStock
  const BE_STOCK = 12.0
  const PA_STOCK = 2.5

  const cpoDeficit = Math.max(0, cpoRequired - CPO_STOCK)
  const beDeficit = Math.max(0, bleachingEarthRequired - BE_STOCK)
  const paDeficit = Math.max(0, phosphoricAcidRequired - PA_STOCK)

  const handleGeneratePO = () => {
    if (cpoDeficit <= 0 && beDeficit <= 0 && paDeficit <= 0) {
      alert(
        "No deficit detected. Raw material stocks are sufficient for the current plan.",
      )
      return
    }
    setDb((prevDb) => {
      return prevDb.map((mod) => {
        if (mod.key !== "procurement") return mod
        return {
          ...mod,
          transactions: mod.transactions.map((trx) => {
            if (trx.key !== "po") return trx
            const newPos = []

            if (cpoDeficit > 0) {
              newPos.push({
                id: `po-cpo-${Date.now()}`,
                code: `PO-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
                date: new Date().toISOString().split("T")[0],
                status: "Draft",
                workflowStep: "Awaiting Verification",
                createdAt: new Date().toISOString().split("T")[0],
                createdBy: "Production Planner",
                auditTrail: [
                  {
                    timestamp: "Just now",
                    user: "System",
                    action: "Generated from Production Planning MRP Deficit",
                  },
                ],
                activities: [
                  {
                    id: "1",
                    timestamp: "Just now",
                    user: "System",
                    description: "Generated from Production Planning deficit",
                    type: "info" as const,
                  },
                ],
                comments: [
                  {
                    id: "1",
                    user: "System",
                    avatar: "SYS",
                    timestamp: "Just now",
                    message: `PO automatically generated for deficit of ${cpoDeficit.toFixed(1)} MT Crude Palm Oil.`,
                  },
                ],
                attachments: [],
                details: {
                  supplier: "Sime Darby Oils Trading",
                  product: "Crude Palm Oil (CPO)",
                  quantity: Math.ceil(cpoDeficit),
                  unitPrice: 82000,
                  deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                },
              })
            }

            if (beDeficit > 0) {
              newPos.push({
                id: `po-be-${Date.now() + 1}`,
                code: `PO-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
                date: new Date().toISOString().split("T")[0],
                status: "Draft",
                workflowStep: "Awaiting Verification",
                createdAt: new Date().toISOString().split("T")[0],
                createdBy: "Production Planner",
                auditTrail: [
                  {
                    timestamp: "Just now",
                    user: "System",
                    action: "Generated from Production Planning BE Deficit",
                  },
                ],
                activities: [
                  {
                    id: "1",
                    timestamp: "Just now",
                    user: "System",
                    description: "Generated from Production Planning deficit",
                    type: "info" as const,
                  },
                ],
                comments: [
                  {
                    id: "1",
                    user: "System",
                    avatar: "SYS",
                    timestamp: "Just now",
                    message: `PO automatically generated for deficit of ${beDeficit.toFixed(1)} MT Bleaching Earth.`,
                  },
                ],
                attachments: [],
                details: {
                  supplier: "Sime Darby Oils Trading",
                  product: "Bleaching Earth",
                  quantity: Math.ceil(beDeficit),
                  unitPrice: 35000,
                  deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                },
              })
            }

            if (paDeficit > 0) {
              newPos.push({
                id: `po-pa-${Date.now() + 2}`,
                code: `PO-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
                date: new Date().toISOString().split("T")[0],
                status: "Draft",
                workflowStep: "Awaiting Verification",
                createdAt: new Date().toISOString().split("T")[0],
                createdBy: "Production Planner",
                auditTrail: [
                  {
                    timestamp: "Just now",
                    user: "System",
                    action: "Generated from Production Planning PA Deficit",
                  },
                ],
                activities: [
                  {
                    id: "1",
                    timestamp: "Just now",
                    user: "System",
                    description: "Generated from Production Planning deficit",
                    type: "info" as const,
                  },
                ],
                comments: [
                  {
                    id: "1",
                    user: "System",
                    avatar: "SYS",
                    timestamp: "Just now",
                    message: `PO automatically generated for deficit of ${paDeficit.toFixed(1)} MT Phosphoric Acid.`,
                  },
                ],
                attachments: [],
                details: {
                  supplier: "Sime Darby Oils Trading",
                  product: "Refinery Chemicals",
                  quantity: Math.ceil(paDeficit),
                  unitPrice: 120000,
                  deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                },
              })
            }

            return {
              ...trx,
              defaultData: [...newPos, ...trx.defaultData],
            }
          }),
        }
      })
    })

    alert(
      `Draft Purchase Order(s) successfully generated for the calculated deficits. Go to Procurement -> Purchase Order to submit for approval.`,
    )
  }

  const handleDiscardPlan = () => {
    const resetAllocations = { ...allocations }
    salesOrders.forEach((so) => {
      resetAllocations[so.id] = "Unscheduled"
      updateSalesOrderPlanningStatus(so.id, "Unscheduled", "Unscheduled")
    })
    setAllocations(resetAllocations)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
      {/* Header bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Production Planning & MRP Dashboard
          </h2>
          <p className="text-[10px] text-slate-400">
            Map active sales orders to production schedules and generate raw
            material purchase orders.
          </p>
        </div>
        <div className="flex bg-slate-200 p-0.5 rounded-lg">
          <button
            onClick={() => setPlanningTab("monthly")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              planningTab === "monthly"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Monthly Week-wise Planning
          </button>
          <button
            onClick={() => setPlanningTab("weekly")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              planningTab === "weekly"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Weekly Day-wise Execution
          </button>
        </div>
      </div>

      {planningTab === "monthly" ? (
        <div className="grid grid-cols-3 divide-x divide-slate-200 flex-1">
          {/* Left panel: Active Sales Orders list */}
          <div className="col-span-1 p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="shopping-cart" size={14} className="text-slate-500" />
              Active Sales Orders
            </h3>
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1">
              {salesOrders.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-8">
                  No open sales orders found.
                </div>
              ) : (
                salesOrders.map((so) => {
                  const assignedWeek = allocations[so.id] || "Unscheduled"
                  return (
                    <div
                      key={so.id}
                      className="p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {so.code}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            assignedWeek === "Unscheduled"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                          }`}
                        >
                          {assignedWeek}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <div>
                          <strong>Customer:</strong> {so.details?.customer}
                        </div>
                        <div>
                          <strong>Product:</strong> {so.details?.product}
                        </div>
                        <div>
                          <strong>Qty:</strong> {so.details?.quantity} MT
                        </div>
                        <div>
                          <strong>Req. Date:</strong>{" "}
                          {so.details?.requestedDeliveryDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 pt-1.5 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Assign Week:
                        </span>
                        <select
                          value={assignedWeek}
                          onChange={(e) => {
                            const newWeek = e.target.value
                            setAllocations((prev) => ({
                              ...prev,
                              [so.id]: newWeek,
                            }))
                            updateSalesOrderPlanningStatus(
                              so.id,
                              newWeek,
                              weeklyAllocations[so.id] || "Unscheduled",
                            )
                          }}
                          className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none focus:border-blue-600"
                        >
                          <option value="Unscheduled">Unscheduled</option>
                          <option value="Week 1">Week 1</option>
                          <option value="Week 2">Week 2</option>
                          <option value="Week 3">Week 3</option>
                          <option value="Week 4">Week 4</option>
                        </select>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Middle/Right: Week grid and MRP */}
          <div className="col-span-2 p-5 flex flex-col gap-6 bg-slate-50/50">
            {/* 4 Weeks calendar view */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Icon name="calendar" size={14} className="text-slate-500" />
                Monthly Schedule Grid
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {["Week 1", "Week 2", "Week 3", "Week 4"].map((week) => {
                  const weekOrders = salesOrders.filter(
                    (so) => allocations[so.id] === week,
                  )
                  const weekQty = weekOrders.reduce(
                    (acc, so) => acc + Number(so.details?.quantity || 0),
                    0,
                  )
                  return (
                    <div
                      key={week}
                      className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col min-h-[140px] shadow-xs"
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2">
                        <span className="text-xs font-bold text-slate-800">
                          {week}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-blue-600">
                          {weekQty} MT
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[100px]">
                        {weekOrders.length === 0 ? (
                          <span className="text-[10px] text-slate-400 text-center my-auto italic">
                            No scheduled runs
                          </span>
                        ) : (
                          weekOrders.map((so) => (
                            <div
                              key={so.id}
                              className="text-[9px] bg-slate-50 border border-slate-150 p-1 rounded font-medium text-slate-600 flex justify-between"
                            >
                              <span className="truncate max-w-[70px]">
                                {so.code}
                              </span>
                              <span className="font-mono">
                                {so.details?.quantity} MT
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* MRP Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4 mt-auto">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Icon name="zap" size={15} className="text-amber-500" />
                Material Requirements Planning (MRP Output)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                      <th className="py-2 pr-4">Raw Material Product</th>
                      <th className="py-2 px-4">Dosage / Formula</th>
                      <th className="py-2 px-4 text-right">Required Qty</th>
                      <th className="py-2 px-4 text-right">
                        Current Stock (We Have)
                      </th>
                      <th className="py-2 px-4 text-right">
                        Deficit (To Procure)
                      </th>
                      <th className="py-2 pl-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr>
                      <td className="py-2.5 pr-4 font-bold text-slate-800">
                        Crude Palm Oil (CPO)
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        Refinery Feedstock (105%)
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">
                        {cpoRequired.toFixed(1)} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-blue-600">
                        {CPO_STOCK.toFixed(1)} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-red-600 font-bold">
                        {cpoDeficit > 0
                          ? `${cpoDeficit.toFixed(1)} MT`
                          : "0.0 MT"}
                      </td>
                      <td className="py-2.5 pl-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cpoDeficit > 0
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          }`}
                        >
                          {cpoDeficit > 0 ? "Shortfall" : "Sufficient"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-bold text-slate-800">
                        Bleaching Earth
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        Bleaching agent (1.5%)
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">
                        {bleachingEarthRequired.toFixed(1)} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-blue-600">
                        {BE_STOCK.toFixed(1)} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-red-600 font-bold">
                        {beDeficit > 0
                          ? `${beDeficit.toFixed(1)} MT`
                          : "0.0 MT"}
                      </td>
                      <td className="py-2.5 pl-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            beDeficit > 0
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          }`}
                        >
                          {beDeficit > 0 ? "Shortfall" : "Sufficient"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-bold text-slate-800">
                        Phosphoric Acid
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        Degumming agent (0.2%)
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">
                        {phosphoricAcidRequired.toFixed(1)} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-blue-600">
                        {PA_STOCK.toFixed(1)} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-red-600 font-bold">
                        {paDeficit > 0
                          ? `${paDeficit.toFixed(1)} MT`
                          : "0.0 MT"}
                      </td>
                      <td className="py-2.5 pl-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            paDeficit > 0
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          }`}
                        >
                          {paDeficit > 0 ? "Shortfall" : "Sufficient"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons Panel */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                {cpoDeficit > 0 || beDeficit > 0 || paDeficit > 0 ? (
                  <button
                    onClick={handleGeneratePO}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Icon name="shopping-cart" size={14} />
                    Generate Purchase Order(s) for Shortfall
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <Icon name="check-circle" size={14} />
                    All Stocks Sufficient
                  </div>
                )}
                <button
                  onClick={handleDiscardPlan}
                  className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Discard Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Weekly planning execution day-wise mapping */
        <div className="grid grid-cols-3 divide-x divide-slate-200 flex-1">
          {/* Left panel: Active Sales Orders list */}
          <div className="col-span-1 p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="shopping-cart" size={14} className="text-slate-500" />
              Active Week-1 Scheduled Orders
            </h3>
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1">
              {salesOrders.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-8">
                  No scheduled orders.
                </div>
              ) : (
                salesOrders.map((so) => {
                  const assignedDay = weeklyAllocations[so.id] || "Unscheduled"
                  return (
                    <div
                      key={so.id}
                      className="p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {so.code}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            assignedDay === "Unscheduled"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                          }`}
                        >
                          {assignedDay}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <div>
                          <strong>Customer:</strong> {so.details?.customer}
                        </div>
                        <div>
                          <strong>Product:</strong> {so.details?.product}
                        </div>
                        <div>
                          <strong>Qty:</strong> {so.details?.quantity} MT
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 pt-1.5 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Assign Execution Day:
                        </span>
                        <select
                          value={assignedDay}
                          onChange={(e) => {
                            const newDay = e.target.value
                            setWeeklyAllocations((prev) => ({
                              ...prev,
                              [so.id]: newDay,
                            }))
                            updateSalesOrderPlanningStatus(
                              so.id,
                              allocations[so.id] || "Unscheduled",
                              newDay,
                            )
                          }}
                          className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none focus:border-blue-600"
                        >
                          <option value="Unscheduled">Unscheduled</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right panel: Day-wise Grid */}
          <div className="col-span-2 p-5 flex flex-col gap-4 bg-slate-50/50 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Icon name="calendar" size={14} className="text-slate-500" />
              Weekly Execution Day-wise Grid
            </h3>

            <div className="flex flex-col gap-3">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => {
                const dayOrders = salesOrders.filter(
                  (so) => weeklyAllocations[so.id] === day,
                )
                const dayQty = dayOrders.reduce(
                  (acc, so) => acc + Number(so.details?.quantity || 0),
                  0,
                )
                return (
                  <div
                    key={day}
                    className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-xs"
                  >
                    <div className="w-24">
                      <span className="text-xs font-bold text-slate-800">
                        {day}
                      </span>
                    </div>
                    <div className="flex-1 flex gap-2 overflow-x-auto px-4">
                      {dayOrders.length === 0 ? (
                        <span className="text-[10px] text-slate-400 italic">
                          No scheduled runs
                        </span>
                      ) : (
                        dayOrders.map((so) => (
                          <div
                            key={so.id}
                            className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-1 rounded font-medium text-slate-700 flex items-center gap-1.5"
                          >
                            <span className="font-mono">{so.code}</span>
                            <span className="text-slate-400">|</span>
                            <span>{so.details?.quantity} MT</span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-xs font-mono font-bold text-blue-700">
                        {dayQty} MT
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
