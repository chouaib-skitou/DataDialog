"use client"

import type React from "react"
import { useState } from "react"
import type { PluginComponentProps } from "@/contexts/PluginContext"

interface StageData {
  companyName: string
  internshipTitle: string
  missionDescription: string
  startDate: string
  endDate: string
  supervisorName: string
  weeklyHours?: number
  remuneration?: number
  requiredSkills: string[]
  applicationDeadline?: string
}

const StageSchemaForm: React.FC<PluginComponentProps<StageData>> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<StageData>({
    companyName: "",
    internshipTitle: "",
    missionDescription: "",
    startDate: "",
    endDate: "",
    supervisorName: "",
    requiredSkills: [""],
  })

  const handleChange = (field: keyof StageData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillChange = (index: number, value: string) => {
    const skills = [...formData.requiredSkills]
    skills[index] = value
    setFormData((prev) => ({ ...prev, requiredSkills: skills }))
  }

  const addSkillField = () => {
    setFormData((prev) => ({ ...prev, requiredSkills: [...prev.requiredSkills, ""] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div>
        <label className="block font-medium">Nom de l’entreprise *</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          className="mt-1 block w-full p-1.5 border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Compétences requises</label>
        {formData.requiredSkills.map((skill, idx) => (
          <input
            key={idx}
            type="text"
            value={skill}
            onChange={(e) => handleSkillChange(idx, e.target.value)}
            className="mt-1 block w-full p-1.5 border rounded-md mb-2"
          />
        ))}
        <button type="button" onClick={addSkillField} className="text-indigo-600 text-xs">
          + Ajouter compétence
        </button>
      </div>
      {onSubmit && (
        <button type="submit" className="mt-3 w-full bg-green-600 text-white px-3 py-1.5 rounded-md text-sm">
          Enregistrer
        </button>
      )}
    </form>
  )
}

export default StageSchemaForm
