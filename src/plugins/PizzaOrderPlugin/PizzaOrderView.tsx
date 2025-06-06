import type React from "react"
import type { PluginComponentProps } from "@/contexts/PluginContext"

interface PizzaOrderData {
  pizzaType: string
  size: string
  quantity: number
}

const PizzaOrderView: React.FC<PluginComponentProps<PizzaOrderData>> = ({ data }) => {
  if (!data) return null

  return (
    <div className="p-3 border rounded-md bg-white shadow-sm text-sm">
      <h3 className="font-semibold">
        Commande : {data.quantity}x {data.pizzaType} ({data.size})
      </h3>
    </div>
  )
}

export default PizzaOrderView
