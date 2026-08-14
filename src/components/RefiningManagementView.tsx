import { useState } from "react"
import { Icon } from "./DesignSystem"
import { ModuleConfig } from "../types"

interface Step {
  name: string
  inputProduct: string
  inputQty: number
  outputProduct: string
  outputQty: number
  targetInputQty?: number
  targetOutputQty?: number
}

interface RefiningManagementViewProps {
  db: ModuleConfig[]
  setDb: React.Dispatch<React.SetStateAction<ModuleConfig[]>>
}

// Default BOM ratios for refining steps (in percentage of step input quantity)
const stepBOMDefinitions: Record<string, { material: string; ratio: number }[]> = {
  Degumming: [
    { material: "Phosphoric Acid (85% purity)", ratio: 0.002 }, // 0.2%
    { material: "Process Steam", ratio: 0.05 }, // 5%
  ],
  Neutralization: [
    { material: "Caustic Soda (NaOH 50%)", ratio: 0.0015 }, // 0.15%
    { material: "Soft Water", ratio: 0.02 }, // 2%
  ],
  Bleaching: [
    { material: "Activated Bleaching Earth", ratio: 0.015 }, // 1.5%
    { material: "Citric Acid (50%)", ratio: 0.0005 }, // 0.05%
  ],
  Filtration: [
    { material: "Filter Paper / Cloth (Units)", ratio: 0.001 }, // 0.1% equivalent units
    { material: "Precoat Filter Aid", ratio: 0.002 }, // 0.2%
  ],
  Deodorization: [
    { material: "High Pressure Utility Steam", ratio: 0.08 }, // 8%
    { material: "Nitrogen Gas (Blanketing)", ratio: 0.001 }, // 0.1%
  ],
}

export function RefiningManagementView({ db, setDb }: RefiningManagementViewProps) {
  const [selectedWeek, setSelectedWeek] = useState("Week 1")

  // Load templates from database context
  const productionModule = db.find((m) => m.key === "production")
  const processTemplates = productionModule?.masters.find((m) => m.key === "process-template")?.defaultData || []

  // Load production orders from database context dynamically
  const prodOrderTrx = productionModule?.transactions.find((t) => t.key === "prodorder")
  const prodOrders = prodOrderTrx?.defaultData || []

  // Load sales orders to look up customer names
  const commercialModule = db.find((m) => m.key === "commercial")
  const salesOrders = commercialModule?.transactions.find((t) => t.key === "salesorder")?.defaultData || []

  // Template Picker Dialog state
  const [pickingOrderId, setPickingOrderId] = useState<string | null>(null)
  const [tempTemplateId, setTempTemplateId] = useState<string>("")

  // Active execution state tracked locally in component
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0)
  const [activeStepStatus, setActiveStepStatus] = useState<"Setup" | "Processing" | "On Hold" | "Completed" | "Dispatch">("Setup")
  const [executionSteps, setExecutionSteps] = useState<any[]>([])

  // Form input quantities for BOM
  const [filledBOM, setFilledBOM] = useState<Record<string, number>>({})

  // Dispatch details state
  const [dispatchMode, setDispatchMode] = useState<"packaging" | "tank" | null>(null)
  const [selectedTankId, setSelectedTankId] = useState<string>("")
  const [dischargeQty, setDischargeQty] = useState<number>(0)

  // Find storage tanks for finished products
  const tankFarmModule = db.find((m) => m.key === "tankfarm")
  const tankMaster = tankFarmModule?.masters.find((t) => t.key === "tank")
  const finishedProductTanks = tankMaster?.defaultData.filter(
    (tank) => tank.details?.tankTag === "Finished Product Tank"
  ) || []

  // Finance and Settlement Data
  const financeModule = db.find((m) => m.key === "finance")
  const paymentsReceived = financeModule?.transactions.find((t) => t.key === "paymentreceived")?.defaultData || []

  const activeOrder = prodOrders.find((o) => o.id === activeOrderId)
  const activeStep = executionSteps[activeStepIdx]
  const selectedTank = finishedProductTanks.find((t) => t.id === selectedTankId)

  // Helper to resolve linked sales order details
  const getLinkedSalesOrder = (salesOrderRef: string) => {
    return salesOrders.find((so) => so.code === salesOrderRef)
  }

  // Settlement Calculation Helper
  const getSettlementStatus = () => {
    if (!activeOrder?.details?.salesOrderRef) return null
    const linkedSo = getLinkedSalesOrder(activeOrder.details.salesOrderRef)
    if (!linkedSo) return null

    const totalRequired = Number(linkedSo.details?.totalAmount || 0)
    const paymentTerms = linkedSo.details?.paymentTerms || ""
    
    // Sum of cleared payments
    const payments = paymentsReceived.filter((p) => p.details?.salesOrderRef === linkedSo.code && p.status === "Cleared")
    const totalPaid = payments.reduce((acc, p) => acc + Number(p.details?.amount || 0), 0)

    // Determine required advance based on terms
    let requiredPercentage = 0
    if (paymentTerms === "100% Advance") requiredPercentage = 100
    else if (paymentTerms === "30% Advance + 70% DP") requiredPercentage = 30
    else if (paymentTerms === "LC at Sight" || paymentTerms === "CAD (Cash Against Documents)") requiredPercentage = 0 // Assuming letters of credit or CAD are verified outside

    const requiredAdvanceAmount = (totalRequired * requiredPercentage) / 100
    const isClearedForDispatch = totalPaid >= requiredAdvanceAmount || requiredPercentage === 0

    return {
      totalRequired,
      totalPaid,
      requiredAdvanceAmount,
      isClearedForDispatch,
      paymentTerms
    }
  }

  // Start execution sequence
  const handleStartExecution = (orderId: string) => {
    setPickingOrderId(orderId)
    setTempTemplateId(processTemplates[0]?.id || "")
  }

  // Confirm template and build execution steps sequence
  const handleConfirmTemplate = () => {
    if (!pickingOrderId) return
    const orderToExecute = prodOrders.find((o) => o.id === pickingOrderId)
    const selectedTmpl = processTemplates.find((t) => t.id === tempTemplateId)
    if (!orderToExecute || !selectedTmpl) return

    // Clone steps from template details
    const templateSteps = selectedTmpl.details?.steps || []
    
    // Scale feedstock sequence inputs
    let currentInput = Number(orderToExecute.details?.quantity || 100)
    const clonedSteps = templateSteps.map((step: Step) => {
      const conversionRatio = step.outputQty / (step.inputQty || 1)
      const inputVal = currentInput
      const outputVal = currentInput * conversionRatio
      currentInput = outputVal
      return {
        ...step,
        targetInputQty: inputVal,
        targetOutputQty: outputVal
      }
    })

    // Update active execution state
    setExecutionSteps(clonedSteps)
    setActiveStepIdx(0)
    setActiveStepStatus("Setup")

    // Prepopulate BOM for step 0
    const firstStepName = clonedSteps[0]?.name || ""
    const defaultBOM = stepBOMDefinitions[firstStepName] || []
    const initialBOM: Record<string, number> = {}
    defaultBOM.forEach((item) => {
      initialBOM[item.material] = Number((clonedSteps[0].targetInputQty * item.ratio).toFixed(3))
    })
    setFilledBOM(initialBOM)

    // Mark production order as executing (Processing) in global db
    setDb((prevDb) =>
      prevDb.map((mod) => {
        if (mod.key !== "production") return mod
        return {
          ...mod,
          transactions: mod.transactions.map((trx) => {
            if (trx.key !== "prodorder") return trx
            return {
              ...trx,
              defaultData: trx.defaultData.map((po) => {
                if (po.id !== pickingOrderId) return po
                return {
                  ...po,
                  status: "Processing"
                }
              })
            }
          })
        }
      })
    )

    setActiveOrderId(pickingOrderId)
    setPickingOrderId(null)
  }

  // Trigger processing state
  const handleFeedMaterials = () => {
    setActiveStepStatus("Processing")
  }

  // Hold process toggle
  const handleHoldToggle = () => {
    if (activeStepStatus === "Processing") {
      setActiveStepStatus("On Hold")
      setDb((prevDb) =>
        prevDb.map((mod) => {
          if (mod.key !== "production") return mod
          return {
            ...mod,
            transactions: mod.transactions.map((trx) => {
              if (trx.key !== "prodorder") return trx
              return {
                ...trx,
                defaultData: trx.defaultData.map((po) => {
                  if (po.id !== activeOrderId) return po
                  return { ...po, status: "Hold" }
                })
              }
            })
          }
        })
      )
    } else if (activeStepStatus === "On Hold") {
      setActiveStepStatus("Processing")
      setDb((prevDb) =>
        prevDb.map((mod) => {
          if (mod.key !== "production") return mod
          return {
            ...mod,
            transactions: mod.transactions.map((trx) => {
              if (trx.key !== "prodorder") return trx
              return {
                ...trx,
                defaultData: trx.defaultData.map((po) => {
                  if (po.id !== activeOrderId) return po
                  return { ...po, status: "Processing" }
                })
              }
            })
          }
        })
      )
    }
  }

  // Complete active step
  const handleCompleteStep = () => {
    setActiveStepStatus("Completed")
  }

  // Move to next step or transition to post-refining dispatch options
  const handleProceedNext = () => {
    if (!activeOrder) return
    const nextIdx = activeStepIdx + 1
    if (nextIdx >= executionSteps.length) {
      // Transition to dispatch options
      setActiveStepStatus("Dispatch")
      setDispatchMode(null)
      const finalStepOutput = executionSteps[executionSteps.length - 1]?.targetOutputQty || activeOrder.details?.quantity || 100
      setDischargeQty(Number(finalStepOutput.toFixed(1)))
      setSelectedTankId(finishedProductTanks[0]?.id || "")
    } else {
      // Setup next step
      setActiveStepIdx(nextIdx)
      setActiveStepStatus("Setup")

      // Prepopulate BOM for next step
      const nextStepName = executionSteps[nextIdx]?.name || ""
      const defaultBOM = stepBOMDefinitions[nextStepName] || []
      const nextBOM: Record<string, number> = {}
      defaultBOM.forEach((item) => {
        nextBOM[item.material] = Number((executionSteps[nextIdx].targetInputQty * item.ratio).toFixed(3))
      })
      setFilledBOM(nextBOM)
    }
  }

  // Finalize dispatch and update database
  const handleFinalizeDispatch = () => {
    if (!activeOrder) return

    const settlement = getSettlementStatus()

    if (dispatchMode === "packaging" && settlement && !settlement.isClearedForDispatch) {
      alert(`Dispatch Blocked! Payment Settlement Pending.\n\nThe customer has not met the requirements for the agreed payment terms (${settlement.paymentTerms}).\n\nRequired Amount: $${settlement.requiredAdvanceAmount.toLocaleString()}\nTotal Paid: $${settlement.totalPaid.toLocaleString()}\n\nPlease contact the Finance team to clear the outstanding balance before dispatching the final product.`)
      return
    }

    if (dispatchMode === "tank") {
      if (!selectedTankId) {
        alert("Please select a Storage Tank.")
        return
      }

      if (dischargeQty <= 0) {
        alert("Please specify a valid discharge quantity.")
        return
      }

      if (selectedTank) {
        const capacity = Number(selectedTank.details?.capacity || 0)
        const currentVol = Number(selectedTank.details?.currentVolume || 0)
        const spaceRemaining = capacity - currentVol

        if (dischargeQty > spaceRemaining) {
          alert(`Insufficient space in ${selectedTank.details?.tankName}. Available space: ${spaceRemaining.toFixed(1)} MT.`)
          return
        }

        // Dynamically increment tank volume, update production order, and linked sales order in global state (setDb)
        setDb((prevDb) =>
          prevDb.map((mod) => {
            if (mod.key === "tankfarm") {
              return {
                ...mod,
                masters: mod.masters.map((master) => {
                  if (master.key !== "tank") return master
                  return {
                    ...master,
                    defaultData: master.defaultData.map((tank) => {
                      if (tank.id !== selectedTankId) return tank
                      return {
                        ...tank,
                        details: {
                          ...tank.details,
                          currentVolume: Number((currentVol + dischargeQty).toFixed(1))
                        }
                      }
                    })
                  }
                })
              }
            }

            if (mod.key === "production") {
              return {
                ...mod,
                transactions: mod.transactions.map((trx) => {
                  if (trx.key !== "prodorder") return trx
                  return {
                    ...trx,
                    defaultData: trx.defaultData.map((po) => {
                      if (po.id !== activeOrderId) return po
                      return {
                        ...po,
                        status: "Executed",
                        workflowStep: "Completed & Stored"
                      }
                    })
                  }
                })
              }
            }

            if (mod.key === "commercial" && activeOrder.details?.salesOrderRef) {
              return {
                ...mod,
                transactions: mod.transactions.map((trx) => {
                  if (trx.key !== "salesorder") return trx
                  return {
                    ...trx,
                    defaultData: trx.defaultData.map((so) => {
                      if (so.code !== activeOrder.details.salesOrderRef) return so
                      return {
                        ...so,
                        status: "Executed",
                        workflowStep: "Completed & Stored"
                      }
                    })
                  }
                })
              }
            }

            return mod
          })
        )
        alert(`Discharged ${dischargeQty} MT refined product to ${selectedTank.details?.tankName}. Tank inventory and orders updated successfully.`)
      }
    } else {
      // Discharged to packaging: Update production order status and sales order to Executed
      setDb((prevDb) =>
        prevDb.map((mod) => {
          if (mod.key === "production") {
            return {
              ...mod,
              transactions: mod.transactions.map((trx) => {
                if (trx.key !== "prodorder") return trx
                return {
                  ...trx,
                  defaultData: trx.defaultData.map((po) => {
                    if (po.id !== activeOrderId) return po
                    return {
                      ...po,
                      status: "Executed",
                      workflowStep: "Completed & Packaging"
                    }
                  })
                }
              })
            }
          }

          if (mod.key === "commercial" && activeOrder.details?.salesOrderRef) {
            return {
              ...mod,
              transactions: mod.transactions.map((trx) => {
                if (trx.key !== "salesorder") return trx
                return {
                  ...trx,
                  defaultData: trx.defaultData.map((so) => {
                    if (so.code !== activeOrder.details.salesOrderRef) return so
                    return {
                      ...so,
                      status: "Executed",
                      workflowStep: "Completed & Packaged"
                    }
                  })
                }
              })
            }
          }

          return mod
        })
      )
      alert(`Refined batch of ${dischargeQty} MT successfully routed directly to packaging queue. Mapped orders updated.`)
    }

    setActiveOrderId(null)
  }

  // Filter orders by active week
  const filteredOrders = prodOrders.filter((order) => {
    const plannedWeek = order.details?.plannedWeek || "Week 1"
    return plannedWeek === selectedWeek
  })

  return (
    <div className="p-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Refining Process Management</h2>
          <p className="text-sm text-slate-500">Execute planned production orders week-wise step-by-step.</p>
        </div>

        {!activeOrderId && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600">Select Week</label>
            <select
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              <option>Week 1</option>
              <option>Week 2</option>
              <option>Week 3</option>
              <option>Week 4</option>
            </select>
          </div>
        )}
      </div>

      {activeOrderId && activeOrder ? (
        // STEP-BY-STEP EXECUTION INTERACTIVE WIZARD
        <div className="grid grid-cols-4 gap-6 items-start">
          
          {/* LEFT PANEL: Steps Checklist / Stepper */}
          <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700">Refining Sequence</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">PO: {activeOrder.code}</p>
            </div>
            
            <div className="flex flex-col gap-4 relative">
              {executionSteps.map((step: any, idx: number) => {
                const isCompleted = idx < activeStepIdx || activeStepStatus === "Dispatch"
                const isActive = idx === activeStepIdx && activeStepStatus !== "Dispatch"

                let statusBadgeColor = "text-slate-400 bg-slate-50 border-slate-200"
                let statusText = "Pending"
                if (isCompleted) {
                  statusBadgeColor = "text-emerald-700 bg-emerald-50 border-emerald-250 font-bold"
                  statusText = "Completed"
                } else if (isActive) {
                  if (activeStepStatus === "Processing") {
                    statusBadgeColor = "text-blue-700 bg-blue-50 border-blue-250 font-bold animate-pulse"
                    statusText = "Processing"
                  } else if (activeStepStatus === "On Hold") {
                    statusBadgeColor = "text-red-700 bg-red-50 border-red-250 font-bold"
                    statusText = "On Hold"
                  } else {
                    statusBadgeColor = "text-blue-755 bg-blue-55/50 border-blue-200"
                    statusText = "Setup Input"
                  }
                }

                return (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-blue-700 text-white border-blue-700 shadow-sm" : isCompleted ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-400 border-slate-200"
                      }`}>
                        {idx + 1}
                      </div>
                      {idx < executionSteps.length - 1 && (
                        <div className={`w-0.5 h-10 ${isCompleted ? "bg-emerald-500" : "bg-slate-200"}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{step.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">In: {step.inputProduct}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[8px] px-1 rounded border font-semibold ${statusBadgeColor}`}>
                          {statusText}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Dispatch step addition */}
              <div className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                    activeStepStatus === "Dispatch" ? "bg-blue-700 text-white border-blue-700 shadow-sm" : "bg-white text-slate-400 border-slate-200"
                  }`}>
                    ★
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800">Dispatch Yield</div>
                  <div className="text-[9px] text-slate-400">Packaging or Storage Tank</div>
                  <div className="mt-1">
                    <span className={`text-[8px] px-1 rounded border font-semibold ${
                      activeStepStatus === "Dispatch" ? "text-blue-700 bg-blue-50 border-blue-250 font-bold" : "text-slate-400 bg-slate-50 border-slate-200"
                    }`}>
                      {activeStepStatus === "Dispatch" ? "Active Setup" : "Awaiting Stages"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Active workspace console panel */}
          <div className="col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            
            {activeStepStatus === "Dispatch" ? (
              // POST-REFINING DISPATCH OPTIONS
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[9px] text-blue-700 font-bold uppercase tracking-wider">Refining batch successful</span>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    Stage 6: Dispatch Refined Yield
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Refined product yield is complete. Select how to allocate the final refined batch output.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDispatchMode("packaging")}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-2 cursor-pointer ${
                      dispatchMode === "packaging"
                        ? "border-blue-500 bg-blue-50/10 text-blue-800"
                        : "border-slate-150 hover:bg-slate-50 text-slate-650"
                    }`}
                  >
                    <Icon name="package" size={20} className={dispatchMode === "packaging" ? "text-blue-650" : "text-slate-400"} />
                    <span className="text-xs font-bold">Move to Packaging Unit</span>
                    <span className="text-[10px] text-slate-450">Send yield directly to lines for filling, bottling, and retail packaging.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDispatchMode("tank")}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-2 cursor-pointer ${
                      dispatchMode === "tank"
                        ? "border-blue-500 bg-blue-50/10 text-blue-800"
                        : "border-slate-150 hover:bg-slate-50 text-slate-650"
                    }`}
                  >
                    <Icon name="database" size={20} className={dispatchMode === "tank" ? "text-blue-655" : "text-slate-400"} />
                    <span className="text-xs font-bold">Store in the Tank</span>
                    <span className="text-[10px] text-slate-455">Discharge yield into finished product tanks for bulk holding.</span>
                  </button>
                </div>

                {dispatchMode === "tank" && (
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col gap-4 animate-[slide-down_0.2s_ease-out]">
                    <h4 className="text-xs font-bold text-slate-750 flex items-center gap-1">
                      <Icon name="database" size={13} className="text-slate-500" />
                      Select Finished Product Tank
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400">Storage Tank</label>
                        <select
                          className="border border-slate-200 rounded p-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
                          value={selectedTankId}
                          onChange={(e) => setSelectedTankId(e.target.value)}
                        >
                          <option value="">Select tank...</option>
                          {finishedProductTanks.map((tank) => (
                            <option key={tank.id} value={tank.id}>
                              {tank.details?.tankName} ({tank.details?.assignedProduct})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-400">Discharge Quantity (MT)</label>
                        <div className="relative">
                          <input
                            type="number"
                            className="w-full border border-slate-200 rounded p-1.5 text-xs font-mono pr-12 focus:outline-none focus:border-blue-600"
                            value={dischargeQty}
                            onChange={(e) => setDischargeQty(Number(e.target.value))}
                          />
                          <span className="absolute right-3 top-1.5 text-[10px] text-slate-400 font-bold">MT</span>
                        </div>
                      </div>
                    </div>

                    {selectedTank && (
                      <div className="border-t border-slate-200 pt-3 flex flex-col gap-1.5 text-[11px] text-slate-600">
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <strong className="text-slate-800">{selectedTank.details?.capacity} MT</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Stock:</span>
                          <strong className="text-blue-600">{selectedTank.details?.currentVolume} MT</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining Space:</span>
                          <strong className="text-slate-800">{(selectedTank.details?.capacity - selectedTank.details?.currentVolume).toFixed(1)} MT</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {dispatchMode === "packaging" && (
                  <div className="bg-slate-50 border border-slate-155 p-4 rounded-xl flex flex-col gap-3 animate-[slide-down_0.2s_ease-out]">
                    <h4 className="text-xs font-bold text-slate-750 flex items-center gap-1">
                      <Icon name="package" size={13} className="text-slate-500" />
                      Configure Packaging Line Routing
                    </h4>
                    
                    {(() => {
                      const settlement = getSettlementStatus();
                      if (settlement) {
                        return (
                          <div className={`p-3 rounded border text-[11px] font-medium flex flex-col gap-1.5 mt-1 ${settlement.isClearedForDispatch ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <div className="flex items-center gap-1.5 font-bold text-xs border-b border-black/5 pb-1">
                              <Icon name={settlement.isClearedForDispatch ? "check-circle" : "alert-triangle"} size={13} />
                              {settlement.isClearedForDispatch ? "Cleared for Dispatch" : "Dispatch Blocked - Payment Settlement Pending"}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div><span className="opacity-75">Terms:</span> <strong className="font-mono">{settlement.paymentTerms}</strong></div>
                              <div><span className="opacity-75">Total Value:</span> <strong className="font-mono">${settlement.totalRequired.toLocaleString()}</strong></div>
                              <div><span className="opacity-75">Required Before Dispatch:</span> <strong className="font-mono">${settlement.requiredAdvanceAmount.toLocaleString()}</strong></div>
                              <div><span className="opacity-75">Total Cleared Payment:</span> <strong className="font-mono">${settlement.totalPaid.toLocaleString()}</strong></div>
                            </div>
                          </div>
                        )
                      }
                      return null;
                    })()}

                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[10px] font-bold text-slate-400">Discharge Qty to Packaging (MT)</label>
                      <div className="relative w-48">
                        <input
                          type="number"
                          className="w-full border border-slate-200 rounded p-1.5 text-xs font-mono pr-12 focus:outline-none focus:border-blue-600"
                          value={dischargeQty}
                          onChange={(e) => setDischargeQty(Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1.5 text-[10px] text-slate-400 font-bold">MT</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveOrderId(null)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-650 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalizeDispatch}
                    disabled={!dispatchMode}
                    className={`px-4 py-1.5 font-bold rounded-lg text-xs flex items-center gap-1.5 ${
                      dispatchMode 
                        ? "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer shadow-xs" 
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                  >
                    <Icon name="check-circle" size={13} />
                    Confirm Dispatch Allocation
                  </button>
                </div>
              </div>
            ) : (
              // GENERAL SEQUENCE STEPS
              <>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[9px] text-blue-700 font-bold uppercase tracking-wider">Active refining node</span>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      Step {activeStepIdx + 1}: {activeStep?.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {activeStepStatus === "Processing" && (
                      <button
                        onClick={handleHoldToggle}
                        className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Icon name="x" size={12} />
                        Hold Unit
                      </button>
                    )}
                    {activeStepStatus === "On Hold" && (
                      <button
                        onClick={handleHoldToggle}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded shadow-xs cursor-pointer flex items-center gap-1 animate-bounce"
                      >
                        <Icon name="check-circle" size={12} />
                        Resume Unit
                      </button>
                    )}
                    {activeStepStatus === "Processing" && (
                      <button
                        onClick={handleCompleteStep}
                        className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold cursor-pointer"
                      >
                        Complete Step
                      </button>
                    )}
                  </div>
                </div>

                {activeStepStatus === "Setup" && (
                  // SETUP BOM STEP
                  <div className="flex flex-col gap-5">
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-750">Step Feedstock Specifications</h4>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                        <div>
                          <span className="text-slate-400">Target Input:</span>{" "}
                          <strong className="text-slate-800 font-mono">{activeStep?.targetInputQty.toFixed(1)} MT</strong> of {activeStep?.inputProduct}
                        </div>
                        <div>
                          <span className="text-slate-400">Projected Output Yield:</span>{" "}
                          <strong className="text-slate-800 font-mono">{activeStep?.targetOutputQty.toFixed(1)} MT</strong> of {activeStep?.outputProduct}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-slate-805">Step Bill of Materials (BOM) Requirements</h4>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-lg justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-800">{activeStep?.inputProduct}</span>
                            <span className="text-[10px] text-slate-400">Main Feedstock (100% Volume)</span>
                          </div>
                          <div className="w-48 text-right font-mono font-bold text-slate-800 text-xs pr-2">
                            {activeStep?.targetInputQty.toFixed(1)} MT
                          </div>
                        </div>

                        {(stepBOMDefinitions[activeStep?.name] || []).map((bomItem, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-lg justify-between">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800">{bomItem.material}</span>
                              <span className="text-[10px] text-slate-400">Additive Ratio: {(bomItem.ratio * 100).toFixed(2)}%</span>
                            </div>
                            <div className="w-48 relative">
                              <input
                                type="number"
                                className="w-full border border-slate-200 rounded p-1.5 text-xs text-right font-mono pr-12 focus:outline-none focus:border-blue-600"
                                value={filledBOM[bomItem.material] ?? 0}
                                onChange={(e) => setFilledBOM({ ...filledBOM, [bomItem.material]: Number(e.target.value) })}
                              />
                              <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">MT</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                      <button
                        onClick={() => setActiveOrderId(null)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-650 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Abort Execution
                      </button>
                      <button
                        onClick={handleFeedMaterials}
                        className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Icon name="zap" size={13} />
                        Feed & Start Processing Unit
                      </button>
                    </div>
                  </div>
                )}

                {activeStepStatus === "Processing" && (
                  // PROCESSING
                  <div className="flex flex-col items-center justify-center py-12 gap-5 text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center">
                      <Icon name="zap" className="text-blue-600" size={24} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-slate-800">Unit Processing Feedstock...</h4>
                      <p className="text-[11px] text-slate-500 max-w-sm">
                        The refining unit is active. Feedstock inputs and chemicals have been locked into the system. All other stages are locked.
                      </p>
                    </div>
                    <div className="w-64 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full animate-[pulse_1.5s_infinite]" style={{ width: "65%" }} />
                    </div>
                  </div>
                )}

                {activeStepStatus === "On Hold" && (
                  // ON HOLD
                  <div className="flex flex-col items-center justify-center py-12 gap-5 text-center bg-red-50/20 border border-red-100 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <Icon name="x" className="text-red-600" size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-slate-800">Batch Processing On Hold</h4>
                      <p className="text-[11px] text-red-550 max-w-sm">
                        Unit operations are suspended. Further processing is blocked until the hold is resolved and batch operations are resumed.
                      </p>
                    </div>
                  </div>
                )}

                {activeStepStatus === "Completed" && (
                  // COMPLETED
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Icon name="check-circle" size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-850">Stage Complete</h4>
                      <p className="text-[11px] text-slate-400">Step outputs generated successfully.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-750">Yield Output Summary</h4>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-xs font-medium">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[10px] uppercase">Input fed</span>
                          <strong className="text-slate-800 font-mono">{activeStep?.targetInputQty.toFixed(1)} MT</strong>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[10px] uppercase">Output produced</span>
                          <strong className="text-emerald-700 font-mono">{activeStep?.targetOutputQty.toFixed(1)} MT</strong>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[10px] uppercase">Refining loss</span>
                          <strong className="text-red-600 font-mono">{(activeStep?.targetInputQty - activeStep?.targetOutputQty).toFixed(1)} MT</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        onClick={handleProceedNext}
                        className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Proceed to Next Step
                        <Icon name="chevron-right" size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      ) : (
        // PRODUCTION ORDERS DYNAMIC TABLE LISTING
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Production Order</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Sales Order</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Quantity (MT)</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Planned Week</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Delivery Date</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-24">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.map((order) => {
                const salesOrderRef = order.details?.salesOrderRef || ""
                const linkedSo = getLinkedSalesOrder(salesOrderRef)
                
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-4 py-3 font-semibold text-blue-600 font-mono">
                      {order.code}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-500 font-mono">
                      {salesOrderRef ? salesOrderRef : <span className="text-slate-400 italic">N/A</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {linkedSo ? linkedSo.details?.customer || linkedSo.name : <span className="text-slate-400 italic">Internal Stock</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{order.details?.product}</td>
                    <td className="px-4 py-3 text-slate-700 text-center font-mono">{order.details?.quantity}</td>
                    <td className="px-4 py-3 text-slate-750 text-center">{order.details?.plannedWeek || selectedWeek}</td>
                    <td className="px-4 py-3 text-slate-700 text-center font-mono">{order.details?.startDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === "Executed" 
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "Processing" 
                            ? "bg-blue-50 text-blue-700 animate-pulse"
                            : order.status === "Hold"
                              ? "bg-red-50 text-red-750"
                              : "bg-amber-50 text-amber-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {order.status === "Executed" ? (
                        <span className="text-[10px] font-bold text-slate-400 select-none mr-2">Completed</span>
                      ) : order.status === "Processing" || order.status === "Hold" ? (
                        <button
                          className="inline-flex items-center px-2.5 py-1 bg-[#1d4ed8] hover:bg-blue-800 text-white text-[11px] font-bold rounded shadow-sm transition-colors cursor-pointer select-none"
                          onClick={() => setActiveOrderId(order.id)}
                        >
                          Resume
                        </button>
                      ) : (
                        <button
                          className="inline-flex items-center px-2.5 py-1 bg-[#1d4ed8] hover:bg-blue-800 text-white text-[11px] font-bold rounded shadow-sm transition-colors cursor-pointer select-none"
                          onClick={() => handleStartExecution(order.id)}
                        >
                          Execute
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No planned production orders found for {selectedWeek}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TEMPLATE PICKER MODAL DIALOG */}
      {pickingOrderId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-[fade-in_0.2s_ease-out]">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-w-sm w-full flex flex-col gap-4 animate-[slide-up_0.25s_ease-out]">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Select Refining Process Template</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Choose which refining configuration template to follow for Production Order {prodOrders.find(o => o.id === pickingOrderId)?.code}.</p>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Process Template</label>
              <select
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                value={tempTemplateId}
                onChange={(e) => setTempTemplateId(e.target.value)}
              >
                {processTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.details?.templateName} (v{t.details?.version})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPickingOrderId(null)}
                className="px-3 py-1.5 border border-slate-205 text-slate-655 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTemplate}
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                Start Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
