"use client"

import type React from "react"

interface ColorPickerProps {
  id: string
  label: string
  value: string
  onChange?: (color: string) => void
  readOnly?: boolean
}

const ColorPicker: React.FC<ColorPickerProps> = ({ id, label, value, onChange, readOnly = false }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !readOnly) {
      onChange(event.target.value)
    }
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-gray-50">
      <label htmlFor={id} className={`block text-sm font-medium ${readOnly ? "text-gray-500" : "text-gray-700"} mb-1`}>
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          id={id}
          value={value}
          onChange={handleChange}
          disabled={readOnly}
          className={`h-10 w-10 p-0 border-none rounded-md ${readOnly ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        />
        <span className="text-sm font-mono p-2 border border-gray-300 rounded-md bg-white">{value}</span>
      </div>
    </div>
  )
}

export default ColorPicker
