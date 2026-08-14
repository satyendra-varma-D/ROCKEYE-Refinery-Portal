import React, { useState } from "react"
import { Icon } from "./DesignSystem"
import { ModuleConfig, MasterEntity } from "../types"

interface Step {
  name: string
  inputProduct: string
  inputQty: number
  outputProduct: string
  outputQty: number
}

interface ProcessTemplateViewProps {
  db: ModuleConfig[]
  setDb: React.Dispatch<React.SetStateAction<ModuleConfig[]>>
}

// Static definition of capacities and BOM rules per refining process step
const stepCapacityAndBOM: Record<string, {
  minCap: number
  maxCap: number
  bom: { material: string; ratio: number; unit: string }[]
}> = {
  Degumming: {
    minCap: 100,
    maxCap: 5000,
    bom: [
      { material: "Crude Palm Oil (CPO)", ratio: 1.0, unit: "MT" },
      { material: "Phosphoric Acid (85% purity)", ratio: 0.002, unit: "MT" },
      { material: "Process Steam", ratio: 0.05, unit: "MT" }
    ]
  },
  Neutralization: {
    minCap: 80,
    maxCap: 4500,
    bom: [
      { material: "Degummed Palm Oil", ratio: 1.0, unit: "MT" },
      { material: "Caustic Soda (NaOH 50% purity)", ratio: 0.0015, unit: "MT" },
      { material: "Soft Process Water", ratio: 0.02, unit: "MT" }
    ]
  },
  Bleaching: {
    minCap: 80,
    maxCap: 4500,
    bom: [
      { material: "Neutralized Palm Oil", ratio: 1.0, unit: "MT" },
      { material: "Activated Bleaching Earth", ratio: 0.015, unit: "MT" },
      { material: "Citric Acid (50% purity)", ratio: 0.0005, unit: "MT" }
    ]
  },
  Filtration: {
    minCap: 120,
    maxCap: 6000,
    bom: [
      { material: "Bleached Palm Oil", ratio: 1.0, unit: "MT" },
      { material: "Precoat Filter Aid", ratio: 0.002, unit: "MT" },
      { material: "Filter Cloths", ratio: 0.001, unit: "Units" }
    ]
  },
  Deodorization: {
    minCap: 70,
    maxCap: 4000,
    bom: [
      { material: "Filtered Palm Oil", ratio: 1.0, unit: "MT" },
      { material: "High Pressure Utility Steam", ratio: 0.08, unit: "MT" },
      { material: "Nitrogen Gas (Blanketing)", ratio: 0.001, unit: "MT" }
    ]
  }
}

export function ProcessTemplateView({ db, setDb }: ProcessTemplateViewProps) {
  // Find process templates module data
  const productionModule = db.find((m) => m.key === "production")
  const templateConfig = productionModule?.masters.find((t) => t.key === "process-template")
  const templates: MasterEntity[] = templateConfig?.defaultData || []

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "")
  const [activeStepName, setActiveStepName] = useState<string>("Degumming")
  
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Edit / Create Form States
  const [formTemplateName, setFormTemplateName] = useState("")
  const [formFinishedProduct, setFormFinishedProduct] = useState("RBD Palm Olein (CP10)")
  const [formVersion, setFormVersion] = useState("1.0")
  const [formSteps, setFormSteps] = useState<Step[]>([])

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)
  const steps: Step[] = selectedTemplate?.details?.steps || []

  // Initialize edit form
  const handleStartEdit = () => {
    if (!selectedTemplate) return
    setFormTemplateName(selectedTemplate.details?.templateName || "")
    setFormFinishedProduct(selectedTemplate.details?.finishedProduct || "RBD Palm Olein (CP10)")
    setFormVersion(selectedTemplate.details?.version || "1.0")
    setFormSteps(selectedTemplate.details?.steps ? [...selectedTemplate.details.steps] : [])
    setIsEditing(true)
    setIsCreating(false)
  }

  // Initialize create form
  const handleStartCreate = () => {
    setFormTemplateName("")
    setFormFinishedProduct("RBD Palm Olein (CP10)")
    setFormVersion("1.0")
    setFormSteps([
      { name: "Degumming", inputProduct: "Crude Palm Oil (CPO)", inputQty: 1000, outputProduct: "Degummed Palm Oil", outputQty: 990 },
      { name: "Neutralization", inputProduct: "Degummed Palm Oil", inputQty: 990, outputProduct: "Neutralized Palm Oil", outputQty: 975 },
      { name: "Bleaching", inputProduct: "Neutralized Palm Oil", inputQty: 975, outputProduct: "Bleached Palm Oil", outputQty: 965 },
      { name: "Filtration", inputProduct: "Bleached Palm Oil", inputQty: 965, outputProduct: "Filtered Palm Oil", outputQty: 960 },
      { name: "Deodorization", inputProduct: "Filtered Palm Oil", inputQty: 960, outputProduct: "RBD Palm Olein (CP10)", outputQty: 950 }
    ])
    setIsCreating(true)
    setIsEditing(false)
  }

  // Handle saving edits or new template
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTemplateName.trim()) {
      alert("Please provide a Template Name.")
      return
    }

    if (isCreating) {
      const newTemplateId = `pt-${Date.now()}`
      const newTemplateCode = `PT-${Math.floor(100 + Math.random() * 900)}`
      const newTemplate: MasterEntity = {
        id: newTemplateId,
        code: newTemplateCode,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: "Admin",
        auditTrail: [{ timestamp: "Just now", user: "Admin", action: "Created Process Template" }],
        activities: [{ id: "1", timestamp: "Just now", user: "Admin", description: `Template ${newTemplateCode} initialized`, type: "info" }],
        comments: [],
        attachments: [],
        details: {
          templateName: formTemplateName,
          finishedProduct: formFinishedProduct,
          version: formVersion,
          steps: formSteps
        }
      }

      setDb((prevDb) =>
        prevDb.map((mod) => {
          if (mod.key !== "production") return mod
          return {
            ...mod,
            masters: mod.masters.map((master) => {
              if (master.key !== "process-template") return master
              return {
                ...master,
                defaultData: [...master.defaultData, newTemplate]
              }
            })
          }
        })
      )
      setSelectedTemplateId(newTemplateId)
      setIsCreating(false)
    } else if (isEditing && selectedTemplateId) {
      setDb((prevDb) =>
        prevDb.map((mod) => {
          if (mod.key !== "production") return mod
          return {
            ...mod,
            masters: mod.masters.map((master) => {
              if (master.key !== "process-template") return master
              return {
                ...master,
                defaultData: master.defaultData.map((tmpl) => {
                  if (tmpl.id !== selectedTemplateId) return tmpl
                  return {
                    ...tmpl,
                    details: {
                      ...tmpl.details,
                      templateName: formTemplateName,
                      finishedProduct: formFinishedProduct,
                      version: formVersion,
                      steps: formSteps
                    }
                  }
                })
              }
            })
          }
        })
      )
      setIsEditing(false)
    }
  }

  // Handle adding a dynamic step to form
  const addStep = () => {
    const lastStep = formSteps[formSteps.length - 1]
    const nextInputProduct = lastStep ? lastStep.outputProduct : "Crude Palm Oil (CPO)"
    const nextInputQty = lastStep ? lastStep.outputQty : 1000
    setFormSteps([
      ...formSteps,
      {
        name: "",
        inputProduct: nextInputProduct,
        inputQty: nextInputQty,
        outputProduct: "",
        outputQty: Math.round(nextInputQty * 0.98)
      }
    ])
  }

  // Handle deleting a step from form
  const removeStep = (index: number) => {
    setFormSteps(formSteps.filter((_, idx) => idx !== index))
  }

  // Handle step attribute changes and maintain sequential connection
  const handleStepChange = (index: number, field: keyof Step, value: any) => {
    const updated = [...formSteps]
    updated[index] = { ...updated[index], [field]: value }

    if (field === "outputProduct" && updated[index + 1]) {
      updated[index + 1].inputProduct = value
    }
    if (field === "outputQty" && updated[index + 1]) {
      updated[index + 1].inputQty = Number(value)
    }

    setFormSteps(updated)
  }

  // Extract active step BOM details (fallback to empty if not mapped)
  const currentStepDetails = stepCapacityAndBOM[activeStepName] || {
    minCap: 100,
    maxCap: 3000,
    bom: [
      { material: "Feedstock Raw Material", ratio: 1.0, unit: "MT" }
    ]
  }

  return (
    <div className="flex flex-col gap-6">
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Icon name="box" className="text-blue-600" size={20} />
            Refining Process Templates
          </h1>
          <p className="text-[11px] text-slate-400">
            Define refining process flowcharts, stage BOM specifications, and refinery capacity planning.
          </p>
        </div>
        {!isEditing && !isCreating && (
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-xs cursor-pointer select-none"
          >
            <Icon name="plus" size={14} />
            Create Template
          </button>
        )}
      </div>

      {isEditing || isCreating ? (
        // EDIT / CREATE FORM CONTAINER
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-800">
              {isCreating ? "Create Refining Process Template" : `Edit Template: ${formTemplateName}`}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setIsCreating(false)
                }}
                className="px-3 py-1.5 border border-slate-200 text-slate-650 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Save Template
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Template Name</label>
              <input
                type="text"
                className="border border-slate-200 rounded-lg p-2 text-xs focus:border-blue-600 focus:outline-none"
                placeholder="e.g. Standard RBD Palm Olein Process"
                value={formTemplateName}
                onChange={(e) => setFormTemplateName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Target Finished Product</label>
              <select
                className="border border-slate-200 rounded-lg p-2 text-xs focus:border-blue-600 focus:outline-none"
                value={formFinishedProduct}
                onChange={(e) => setFormFinishedProduct(e.target.value)}
              >
                <option value="RBD Palm Olein (CP10)">RBD Palm Olein (CP10)</option>
                <option value="RBD Palm Stearin">RBD Palm Stearin</option>
                <option value="PFAD">PFAD</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Version</label>
              <input
                type="text"
                className="border border-slate-200 rounded-lg p-2 text-xs focus:border-blue-600 focus:outline-none"
                placeholder="1.0"
                value={formVersion}
                onChange={(e) => setFormVersion(e.target.value)}
              />
            </div>
          </div>

          {/* Dynamic Sequence Steps List */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700">Refining Steps Sequence</span>
              <button
                type="button"
                onClick={addStep}
                className="text-xs font-bold text-blue-700 flex items-center gap-1 hover:text-blue-800 cursor-pointer"
              >
                <Icon name="plus" size={12} />
                Add Step
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {formSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50/50 p-4 border border-slate-150 rounded-xl relative group">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  
                  <div className="grid grid-cols-5 gap-3 flex-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Step Name</label>
                      <input
                        type="text"
                        className="border border-slate-200 rounded p-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
                        placeholder="e.g. Degumming"
                        value={step.name}
                        onChange={(e) => handleStepChange(idx, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Input Feed Product</label>
                      <input
                        type="text"
                        className="border border-slate-200 rounded p-1.5 text-xs bg-slate-100 text-slate-550 cursor-not-allowed focus:outline-none"
                        value={step.inputProduct}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Default Input Qty (MT)</label>
                      <input
                        type="number"
                        className="border border-slate-200 rounded p-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
                        value={step.inputQty}
                        onChange={(e) => handleStepChange(idx, "inputQty", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Output Yield Product</label>
                      <input
                        type="text"
                        className="border border-slate-200 rounded p-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
                        placeholder="e.g. Degummed Palm Oil"
                        value={step.outputProduct}
                        onChange={(e) => handleStepChange(idx, "outputProduct", e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Default Output Qty (MT)</label>
                      <input
                        type="number"
                        className="border border-slate-200 rounded p-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
                        value={step.outputQty}
                        onChange={(e) => handleStepChange(idx, "outputQty", Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer self-end mb-1"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              ))}

              {formSteps.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic w-full">
                  No refining steps defined. Click "Add Step" to configure the process.
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        // DASHBOARD VIEW
        <div className="grid grid-cols-4 gap-6 items-start">
          {/* Templates Sidebar list */}
          <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-750 flex items-center gap-1.5">
              <Icon name="grid" size={14} className="text-slate-400" />
              Process Templates
            </h3>
            <div className="flex flex-col gap-2">
              {templates.map((tmpl) => {
                const isActive = tmpl.id === selectedTemplateId
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id)
                      const firstStep = tmpl.details?.steps?.[0]?.name || "Degumming"
                      setActiveStepName(firstStep)
                    }}
                    className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#eff6ff] border-blue-200 text-blue-800"
                        : "border-slate-100 hover:bg-slate-50 text-slate-650"
                    }`}
                  >
                    <div className="text-xs font-bold truncate">
                      {tmpl.details?.templateName}
                    </div>
                    <div className="text-[10px] text-slate-455 mt-1 flex justify-between">
                      <span>{tmpl.details?.steps?.length || 0} Steps</span>
                      <span>v{tmpl.details?.version}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Template Flow and Step Details */}
          <div className="col-span-3 flex flex-col gap-6">
            {selectedTemplate ? (
              <>
                {/* Template Info & Action row */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      {selectedTemplate.details?.templateName}
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Code: {selectedTemplate.code} | Version: {selectedTemplate.details?.version} | Created: {selectedTemplate.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStartEdit}
                      className="px-3 py-1.5 border border-slate-205 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="edit" size={13} />
                      Edit Template
                    </button>
                  </div>
                </div>

                {/* Pipeline Flow Visualization */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                    <Icon name="activity" size={15} className="text-blue-600" />
                    Process Flowchart & Sequencing (Click step to analyze BOM & capacity limits)
                  </h3>

                  {/* Horizontal visual sequence list */}
                  <div className="flex items-center gap-2 overflow-x-auto py-4 px-2">
                    {steps.map((step, idx) => {
                      const isLast = idx === steps.length - 1
                      const isStepActive = activeStepName === step.name
                      const loss = step.inputQty - step.outputQty
                      
                      return (
                        <React.Fragment key={idx}>
                          {/* Step card */}
                          <div className="flex flex-col items-center flex-shrink-0 group">
                            {/* Clickable Node element */}
                            <button
                              type="button"
                              onClick={() => setActiveStepName(step.name)}
                              className={`w-28 cursor-pointer bg-gradient-to-br from-white to-slate-50 border hover:border-blue-500 hover:shadow-md transition-all rounded-xl p-3 flex flex-col items-center text-center relative focus:outline-none ${
                                isStepActive 
                                  ? "border-blue-600 ring-2 ring-blue-100 scale-102 shadow-sm font-semibold" 
                                  : "border-slate-200"
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center mb-1 ${
                                isStepActive ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-655"
                              }`}>
                                {idx + 1}
                              </div>
                              <span className="text-[10px] font-bold text-slate-800 truncate w-full">
                                {step.name}
                              </span>
                              <span className="text-[8px] text-slate-400 mt-1 truncate w-full">
                                In: {step.inputProduct}
                              </span>
                              <span className="text-[8px] text-slate-400 truncate w-full">
                                Out: {step.outputProduct}
                              </span>
                            </button>
                          </div>

                          {/* Link Arrow */}
                          {!isLast && (
                            <div className="flex flex-col items-center flex-shrink-0 mx-1">
                              <Icon name="chevron-right" className="text-slate-300" size={20} />
                            </div>
                          )}
                        </React.Fragment>
                      )
                    })}

                    {steps.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs italic w-full">
                        No steps defined for this template. Click "Edit Template" to add stages.
                      </div>
                    )}
                  </div>
                </div>

                {/* Step BOM & Capacity Specifications Dashboard */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm grid grid-cols-3 gap-6">
                  
                  {/* Left Column: Capacity parameters */}
                  <div className="col-span-1 flex flex-col gap-4 pr-6 border-r border-slate-100 justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
                        <Icon name="settings" size={14} className="text-slate-400" />
                        Unit Capacity Specifications
                      </h4>
                      
                      <div className="flex flex-col gap-3 text-xs">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Active Unit:</span>
                          <strong className="text-slate-800">{activeStepName} Unit</strong>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t border-slate-50">
                          <span className="text-slate-500">Min Capacity Limit:</span>
                          <strong className="text-blue-700 font-mono">{currentStepDetails.minCap} MT/Day</strong>
                        </div>
                        <div className="flex justify-between items-center py-1 border-t border-slate-50">
                          <span className="text-slate-500">Max Capacity Limit:</span>
                          <strong className="text-red-750 font-mono">{currentStepDetails.maxCap} MT/Day</strong>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl flex flex-col gap-1 mt-4">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Unit Optimization</span>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                        Operators use these thresholds to prevent refining blockages or insufficient chemical dosage feedrates.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Step specific BOM Materials with Min & Max scaled values */}
                  <div className="col-span-2 flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Icon name="database" size={14} className="text-slate-400" />
                      Required Step Bill of Materials (BOM) Limits
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                            <th className="py-2 pr-4">BOM Component / Consumable</th>
                            <th className="py-2 px-4 text-center">Dosage ratio</th>
                            <th className="py-2 px-4 text-right">Min Load Feedrate</th>
                            <th className="py-2 pl-4 text-right">Max Load Feedrate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          {currentStepDetails.bom.map((bomItem, index) => {
                            const minVal = currentStepDetails.minCap * bomItem.ratio
                            const maxVal = currentStepDetails.maxCap * bomItem.ratio
                            
                            return (
                              <tr key={index}>
                                <td className="py-2.5 pr-4 font-bold text-slate-800">{bomItem.material}</td>
                                <td className="py-2.5 px-4 text-center text-slate-450 font-mono text-[10px]">
                                  {(bomItem.ratio * 100).toFixed(2)}%
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono text-blue-700">
                                  {minVal.toFixed(2)} {bomItem.unit}
                                </td>
                                <td className="py-2.5 pl-4 text-right font-mono text-red-650 font-bold">
                                  {maxVal.toFixed(2)} {bomItem.unit}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-205 rounded-xl p-8 text-center text-slate-400 italic text-xs">
                Please select a process template from the sidebar or click "Create Template".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
