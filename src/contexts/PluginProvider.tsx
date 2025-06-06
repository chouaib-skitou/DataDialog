"use client"

import type React from "react"
import { useState, useEffect, type PropsWithChildren } from "react"
import { PluginContext, type PluginRegistry } from "./PluginContext"
import schemaRegistry from "@/services/SchemaRegistry"
import Loader from "@/components/Shared/Loader"

// Static imports for the preview environment
import StageSchemaForm from "@/plugins/StageSchemaPlugin/StageSchemaForm"
import StageSchemaView from "@/plugins/StageSchemaPlugin/StageSchemaView"
import RoomBookingForm from "@/plugins/RoomBookingPlugin/RoomBookingForm"
import RoomBookingView from "@/plugins/RoomBookingPlugin/RoomBookingView"
import PizzaOrderForm from "@/plugins/PizzaOrderPlugin/PizzaOrderForm"
import PizzaOrderView from "@/plugins/PizzaOrderPlugin/PizzaOrderView"

const pluginComponentMap = {
  StageSchema: { FormComponent: StageSchemaForm, ViewComponent: StageSchemaView },
  RoomBookingSchema: { FormComponent: RoomBookingForm, ViewComponent: RoomBookingView },
  PizzaOrderSchema: { FormComponent: PizzaOrderForm, ViewComponent: PizzaOrderView },
}

export const PluginProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [registry, setRegistry] = useState<PluginRegistry>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const newRegistry: PluginRegistry = {}
    const extensionInfos = schemaRegistry.listExtensions()

    for (const extInfo of extensionInfos) {
      const components = pluginComponentMap[extInfo.name as keyof typeof pluginComponentMap]
      if (components) {
        newRegistry[extInfo.name] = {
          version: extInfo.version,
          ...components,
        }
      }
    }
    setRegistry(newRegistry)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  return <PluginContext.Provider value={registry}>{children}</PluginContext.Provider>
}
