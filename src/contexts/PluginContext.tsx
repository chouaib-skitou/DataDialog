"use client"

import React from "react"

export interface PluginComponentProps<T = any> {
  data?: T
  onSubmit?: (data: T) => void
  readOnly?: boolean
}

export interface PluginRegistration {
  version: string
  FormComponent: React.ComponentType<PluginComponentProps>
  ViewComponent: React.ComponentType<PluginComponentProps>
}

export interface PluginRegistry {
  [schemaName: string]: PluginRegistration
}

export const PluginContext = React.createContext<PluginRegistry | undefined>(undefined)

export const usePlugins = () => {
  const context = React.useContext(PluginContext)
  if (context === undefined) {
    throw new Error("usePlugins must be used within a PluginProvider")
  }
  return context
}
