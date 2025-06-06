"use client"

import type React from "react"

interface CheckboxProps {
  id: string
  label: string
  isChecked: boolean
  onChange?: (checked: boolean) => void
  readOnly?: boolean
}

const UICheckbox: React.FC<CheckboxProps> = ({ id, label, isChecked, onChange, readOnly = false }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !readOnly) {
      onChange(event.target.checked)
    }
  }

  return (
    <div className="flex items-center my-2">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleChange}
        disabled={readOnly}
        className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${readOnly ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      />
      <label htmlFor={id} className={`ml-2 block text-sm ${readOnly ? "text-gray-500" : "text-gray-700"}`}>
        {label}
      </label>
    </div>
  )
}

export default UICheckbox
