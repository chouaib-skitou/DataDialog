"use client"

import { useState, useEffect } from "react"
import type { StructuredPart, CoreSchema } from "../shared/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StructuredPartEditorProps {
  part: StructuredPart
  schema: CoreSchema
  onChange: (data: any) => void
}

export function StructuredPartEditor({ part, schema, onChange }: StructuredPartEditorProps) {
  const [data, setData] = useState(part.data || {})

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const updateField = (key: string, value: any) => {
    setData({ ...data, [key]: value })
  }

  const renderField = (key: string, property: any) => {
    const value = data[key]

    switch (property.type) {
      case "text":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{property.label}</Label>
            <Input
              id={key}
              value={value || ""}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={property.description}
            />
          </div>
        )

      case "checkbox":
        return (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox id={key} checked={value || false} onCheckedChange={(checked) => updateField(key, checked)} />
            <Label htmlFor={key}>{property.label}</Label>
          </div>
        )

      case "binary":
        return (
          <div key={key} className="space-y-2">
            <Label>{property.label}</Label>
            <div className="flex gap-2">
              <Button variant={value === true ? "default" : "outline"} size="sm" onClick={() => updateField(key, true)}>
                Oui
              </Button>
              <Button
                variant={value === false ? "default" : "outline"}
                size="sm"
                onClick={() => updateField(key, false)}
              >
                Non
              </Button>
            </div>
          </div>
        )

      case "multiple-choice":
        const options = property.options?.choices || []
        return (
          <div key={key} className="space-y-2">
            <Label>{property.label}</Label>
            <Select value={value || ""} onValueChange={(val) => updateField(key, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "color":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{property.label}</Label>
            <div className="flex gap-2">
              <Input
                id={key}
                type="color"
                value={value || "#000000"}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={value || ""}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        )

      case "number":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{property.label}</Label>
            <Input
              id={key}
              type="number"
              value={value || ""}
              onChange={(e) => updateField(key, Number.parseInt(e.target.value) || 0)}
            />
          </div>
        )

      default:
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{property.label}</Label>
            <Textarea
              id={key}
              value={value || ""}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={property.description}
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(schema.definition.properties).map(([key, property]) => renderField(key, property))}
    </div>
  )
}
