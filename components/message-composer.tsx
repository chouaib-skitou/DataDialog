"use client"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { StructuredPart, SchemaDefinition, SchemaProperty } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Send, Trash2 } from "lucide-react"
import { getAllSchemas, getSchemaById } from "@/services/schema-service"

interface MessageComposerProps {
  onSend: (text?: string, structuredParts?: StructuredPart[]) => void
}

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [text, setText] = useState("")
  const [structuredParts, setStructuredParts] = useState<StructuredPart[]>([])
  const [availableSchemas, setAvailableSchemas] = useState<SchemaDefinition[]>([])
  const [selectedSchemaToAdd, setSelectedSchemaToAdd] = useState<string | undefined>()

  useEffect(() => {
    setAvailableSchemas(getAllSchemas())
  }, [])

  const handleAddStructuredPart = () => {
    if (!selectedSchemaToAdd) return
    const schema = getSchemaById(selectedSchemaToAdd)
    if (!schema) return

    const initialData: Record<string, any> = {}
    Object.entries(schema.properties).forEach(([key, propDef]) => {
      initialData[key] = propDef.defaultValue
    })

    setStructuredParts([...structuredParts, { id: uuidv4(), schemaId: schema.id, data: initialData }])
    setSelectedSchemaToAdd(undefined)
  }

  const handleStructuredPartDataChange = (partId: string, fieldKey: string, value: any) => {
    setStructuredParts(
      structuredParts.map((part) =>
        part.id === partId ? { ...part, data: { ...part.data, [fieldKey]: value } } : part,
      ),
    )
  }

  const removeStructuredPart = (partId: string) => {
    setStructuredParts(structuredParts.filter((part) => part.id !== partId))
  }

  const handleSend = () => {
    if (!text.trim() && structuredParts.length === 0) return
    onSend(text.trim() || undefined, structuredParts.length > 0 ? structuredParts : undefined)
    setText("")
    setStructuredParts([])
  }

  const renderSchemaField = (part: StructuredPart, fieldKey: string, propDef: SchemaProperty) => {
    const value = part.data[fieldKey] ?? propDef.defaultValue

    switch (propDef.type) {
      case "text":
      case "textarea":
      case "number":
        return (
          <Input
            type={propDef.type === "textarea" ? "text" : propDef.type}
            placeholder={propDef.label}
            value={value || ""}
            onChange={(e) => handleStructuredPartDataChange(part.id, fieldKey, e.target.value)}
            className="mt-1 h-8 text-sm"
          />
        )
      case "date":
        return (
          <Input
            type="date"
            placeholder={propDef.label}
            value={value || ""}
            onChange={(e) => handleStructuredPartDataChange(part.id, fieldKey, e.target.value)}
            className="mt-1 h-8 text-sm"
          />
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id={`${part.id}-${fieldKey}`}
              checked={!!value}
              onCheckedChange={(checked) => handleStructuredPartDataChange(part.id, fieldKey, !!checked)}
            />
            <label htmlFor={`${part.id}-${fieldKey}`} className="text-sm select-none">
              {propDef.label}
            </label>
          </div>
        )
      case "binary":
        return (
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant={value === true ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => handleStructuredPartDataChange(part.id, fieldKey, value === true ? undefined : true)}
            >
              Oui
            </Button>
            <Button
              variant={value === false ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => handleStructuredPartDataChange(part.id, fieldKey, value === false ? undefined : false)}
            >
              Non
            </Button>
          </div>
        )
      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => handleStructuredPartDataChange(part.id, fieldKey, val)}>
            <SelectTrigger className="mt-1 h-8 text-sm">
              <SelectValue placeholder={propDef.label} />
            </SelectTrigger>
            <SelectContent>
              {propDef.options?.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-sm">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return <p className="text-xs text-red-500 mt-1">Type de champ inconnu: {propDef.type}</p>
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Votre message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="text-sm"
      />

      {structuredParts.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {structuredParts.map((part) => {
            const schema = getSchemaById(part.schemaId)
            if (!schema) return null
            return (
              <Card key={part.id} className="relative bg-muted/50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 z-10"
                  onClick={() => removeStructuredPart(part.id)}
                  title="Supprimer l'élément"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
                <CardHeader className="pb-2 pt-3 px-3 border-b">
                  <CardTitle className="text-xs font-semibold text-foreground">{schema.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 px-3 py-2 text-sm">
                  {Object.entries(schema.properties).map(([key, propDef]) => (
                    <div key={key} className="py-1 min-h-[40px]">
                      <label className="text-xs font-medium text-muted-foreground block mb-0.5">{propDef.label}</label>
                      {renderSchemaField(part, key, propDef)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Select value={selectedSchemaToAdd || ""} onValueChange={setSelectedSchemaToAdd}>
          <SelectTrigger className="flex-1 h-9 text-sm">
            <SelectValue placeholder="Ajouter un élément structuré..." />
          </SelectTrigger>
          <SelectContent>
            {availableSchemas.filter((s) => s.isCore).length > 0 && (
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Noyau</div>
            )}
            {availableSchemas
              .filter((s) => s.isCore)
              .map((schema) => (
                <SelectItem key={schema.id} value={schema.id} className="text-sm">
                  {schema.name}
                </SelectItem>
              ))}
            {availableSchemas.filter((s) => !s.isCore).length > 0 && (
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-1 border-t">Extensions</div>
            )}
            {availableSchemas
              .filter((s) => !s.isCore)
              .map((schema) => (
                <SelectItem key={schema.id} value={schema.id} className="text-sm">
                  {schema.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAddStructuredPart}
          disabled={!selectedSchemaToAdd}
          size="icon"
          variant="outline"
          className="h-9 w-9"
          title="Ajouter l'élément sélectionné"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={handleSend} className="w-full h-9 text-sm">
        <Send className="mr-2 h-4 w-4" /> Envoyer
      </Button>
    </div>
  )
}
