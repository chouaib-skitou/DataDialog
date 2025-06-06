import type React from "react"
import type { PluginComponentProps } from "@/contexts/PluginContext"

interface StageData {
  companyName: string
  internshipTitle: string
  requiredSkills: string[]
}

const StageSchemaView: React.FC<PluginComponentProps<StageData>> = ({ data }) => {
  if (!data) return null

  return (
    <div className="p-3 border rounded-md bg-white shadow-sm space-y-2 text-sm">
      <h3 className="font-semibold">{data.internshipTitle}</h3>
      <p>
        <strong>Entreprise :</strong> {data.companyName}
      </p>
      {data.requiredSkills?.length > 0 && (
        <div>
          <strong>Compétences :</strong>
          <ul className="list-disc pl-5">
            {data.requiredSkills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default StageSchemaView
