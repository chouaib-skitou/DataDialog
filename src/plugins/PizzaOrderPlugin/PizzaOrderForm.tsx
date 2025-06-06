"use client"

import type React from "react"
import { useState } from "react"
import type { PluginComponentProps } from "@/contexts/PluginContext"

interface PizzaOrderData {
  pizzaType: string
  size: string
  quantity: number
}

const PizzaOrderForm: React.FC<PluginComponentProps<PizzaOrderData>> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PizzaOrderData>({
    pizzaType: "Margherita",
    size: "Moyenne",
    quantity: 1,
  })

  const handleChange = (field: keyof PizzaOrderData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div>
        <label className="block font-medium">Type de Pizza *</label>
        <select
          value={formData.pizzaType}
          onChange={(e) => handleChange("pizzaType", e.target.value)}
          className="mt-1 block w-full p-1.5 border rounded-md"
        >
          <option>Margherita</option>
          <option>Pepperoni</option>
          <option>Vegetariana</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-medium">Taille *</label>
          <select
            value={formData.size}
            onChange={(e) => handleChange("size", e.target.value)}
            className="mt-1 block w-full p-1.5 border rounded-md"
          >
            <option>Petite</option>
            <option>Moyenne</option>
            <option>Grande</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Quantité *</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value, 10) || 1)}
            className="mt-1 block w-full p-1.5 border rounded-md"
          />
        </div>
      </div>
      {onSubmit && (
        <button type="submit" className="mt-3 w-full bg-green-600 text-white px-3 py-1.5 rounded-md text-sm">
          Enregistrer
        </button>
      )}
    </form>
  )
}

export default PizzaOrderForm
