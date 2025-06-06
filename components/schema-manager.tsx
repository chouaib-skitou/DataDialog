"use client"

import { useState } from "react"
import type { CoreSchema } from "../shared/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

interface SchemaManagerProps {
  schemas: CoreSchema[]
  onSchemasChange: (schemas: CoreSchema[]) => void
}

export function SchemaManager({ schemas, onSchemasChange }: SchemaManagerProps) {
  const [selectedSchema, setSelectedSchema] = useState<CoreSchema | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const coreSchemas = schemas.filter((s) => s.type === "core")
  const extensionSchemas = schemas.filter((s) => s.type === "extension")

  const createSchema = async (schemaData: Partial<CoreSchema>) => {
    try {
      const response = await fetch("http://localhost:3001/api/schemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schemaData),
      })
      const newSchema = await response.json()
      onSchemasChange([...schemas, newSchema])
      setIsCreating(false)
    } catch (error) {
      console.error("Error creating schema:", error)
    }
  }

  const updateSchema = async (id: string, schemaData: Partial<CoreSchema>) => {
    try {
      const response = await fetch(`http://localhost:3001/api/schemas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schemaData),
      })
      const updatedSchema = await response.json()
      onSchemasChange(schemas.map((s) => (s.id === id ? updatedSchema : s)))
      setIsEditing(false)
      setSelectedSchema(updatedSchema)
    } catch (error) {
      console.error("Error updating schema:", error)
    }
  }

  const deleteSchema = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/api/schemas/${id}`, {
        method: "DELETE",
      })
      onSchemasChange(schemas.filter((s) => s.id !== id))
      setSelectedSchema(null)
    } catch (error) {
      console.error("Error deleting schema:", error)
    }
  }

  return (
    <div className="h-full">
      <Tabs defaultValue="core" className="h-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="core">Schémas Noyau ({coreSchemas.length})</TabsTrigger>
            <TabsTrigger value="extension">Extensions ({extensionSchemas.length})</TabsTrigger>
          </TabsList>

          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau schéma
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau schéma</DialogTitle>
              </DialogHeader>
              <SchemaEditor onSave={createSchema} onCancel={() => setIsCreating(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          <div className="space-y-4">
            <TabsContent value="core" className="mt-0">
              <div className="space-y-2">
                {coreSchemas.map((schema) => (
                  <SchemaCard
                    key={schema.id}
                    schema={schema}
                    isSelected={selectedSchema?.id === schema.id}
                    onSelect={setSelectedSchema}
                    onDelete={deleteSchema}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="extension" className="mt-0">
              <div className="space-y-2">
                {extensionSchemas.map((schema) => (
                  <SchemaCard
                    key={schema.id}
                    schema={schema}
                    isSelected={selectedSchema?.id === schema.id}
                    onSelect={setSelectedSchema}
                    onDelete={deleteSchema}
                  />
                ))}
              </div>
            </TabsContent>
          </div>

          <div>
            {selectedSchema ? (
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant={selectedSchema.type === "core" ? "default" : "secondary"}>
                      {selectedSchema.type === "core" ? "Noyau" : "Extension"}
                    </Badge>
                    {selectedSchema.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Modifier le schéma</DialogTitle>
                        </DialogHeader>
                        <SchemaEditor
                          schema={selectedSchema}
                          onSave={(data) => updateSchema(selectedSchema.id, data)}
                          onCancel={() => setIsEditing(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <SchemaViewer schema={selectedSchema} />
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un schéma pour voir les détails</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

function SchemaCard({
  schema,
  isSelected,
  onSelect,
  onDelete,
}: {
  schema: CoreSchema
  isSelected: boolean
  onSelect: (schema: CoreSchema) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={() => onSelect(schema)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={schema.type === "core" ? "default" : "secondary"}>
                {schema.type === "core" ? "Noyau" : "Extension"}
              </Badge>
              <span className="text-sm text-muted-foreground">v{schema.version}</span>
            </div>
            <h3 className="font-medium">{schema.name}</h3>
            <p className="text-sm text-muted-foreground">
              {Object.keys(schema.definition.properties).length} propriétés
            </p>
          </div>
          {schema.type === "extension" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(schema.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SchemaViewer({ schema }: { schema: CoreSchema }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Informations générales</h4>
        <div className="space-y-1 text-sm">
          <p>
            <strong>ID:</strong> {schema.id}
          </p>
          <p>
            <strong>Version:</strong> {schema.version}
          </p>
          <p>
            <strong>Type:</strong> {schema.type}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Propriétés</h4>
        <div className="space-y-2">
          {Object.entries(schema.definition.properties).map(([key, property]) => (
            <Card key={key} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{key}</span>
                <Badge variant="outline">{property.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{property.label}</p>
              {property.description && <p className="text-xs text-muted-foreground mt-1">{property.description}</p>}
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Définition JSON</h4>
        <pre className="bg-muted p-3 rounded text-xs overflow-auto">{JSON.stringify(schema.definition, null, 2)}</pre>
      </div>
    </div>
  )
}

function SchemaEditor({
  schema,
  onSave,
  onCancel,
}: {
  schema?: CoreSchema
  onSave: (data: Partial<CoreSchema>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(schema?.name || "")
  const [type, setType] = useState<"core" | "extension">(schema?.type || "extension")
  const [version, setVersion] = useState(schema?.version || "1.0.0")
  const [jsonDefinition, setJsonDefinition] = useState(
    JSON.stringify(schema?.definition || { properties: {}, required: [] }, null, 2),
  )

  const handleSave = () => {
    try {
      const definition = JSON.parse(jsonDefinition)
      onSave({
        name,
        type,
        version,
        definition,
      })
    } catch (error) {
      alert("Erreur dans la définition JSON")
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du schéma</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du schéma" />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={(value: "core" | "extension") => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Noyau</SelectItem>
              <SelectItem value="extension">Extension</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="version">Version</Label>
        <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" />
      </div>

      <div>
        <Label htmlFor="definition">Définition JSON</Label>
        <Textarea
          id="definition"
          value={jsonDefinition}
          onChange={(e) => setJsonDefinition(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>{schema ? "Modifier" : "Créer"}</Button>
      </div>
    </div>
  )
}
