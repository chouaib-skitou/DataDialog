"use client"

import type React from "react"

interface Option {
  value: string
  label: string
}

interface MultipleChoiceProps {
  id: string
  label: string
  options: Option[]
  selectedValues: string[]
  onChange?: (selected: string[]) => void
  readOnly?: boolean
  allowMultiple?: boolean
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  id,
  label,
  options,
  selectedValues,
  onChange,
  readOnly = false,
  allowMultiple = true,
}) => {
  const handleSelectionChange = (optionValue: string) => {
    if (readOnly || !onChange) return

    let newSelectedValues: string[]
    if (allowMultiple) {
      if (selectedValues.includes(optionValue)) {
        newSelectedValues = selectedValues.filter((v) => v !== optionValue)
      } else {
        newSelectedValues = [...selectedValues, optionValue]
      }
    } else {
      newSelectedValues = selectedValues.includes(optionValue) ? [] : [optionValue]
    }
    onChange(newSelectedValues)
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-gray-50">
      <p className={`block text-sm font-medium ${readOnly ? "text-gray-500" : "text-gray-700"} mb-2`}>{label}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type={allowMultiple ? "checkbox" : "radio"}
              id={`${id}-${option.value}`}
              name={allowMultiple ? `${id}-${option.value}` : id}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleSelectionChange(option.value)}
              disabled={readOnly}
              className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${readOnly ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className={`ml-2 block text-sm ${readOnly ? "text-gray-500" : "text-gray-700"}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultipleChoice
