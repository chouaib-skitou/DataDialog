import coreSchemaData from "../../schema-noyau.json"
import stageSchema from "@/plugins/StageSchemaPlugin/schema.json"
import roomSchema from "@/plugins/RoomBookingPlugin/schema.json"
import pizzaSchema from "@/plugins/PizzaOrderPlugin/schema.json"

export interface ExtensionSchemaFile {
  name: string
  version: string
  type: "object"
  properties: Record<string, any>
  required?: string[]
}

export interface ExtensionSchema extends ExtensionSchemaFile {}

class SchemaRegistry {
  private coreSchema: any
  private extensions: Record<string, ExtensionSchema>

  constructor() {
    this.coreSchema = coreSchemaData
    this.extensions = {}
    this.loadExtensions()
  }

  private loadExtensions() {
    const schemasToLoad = [stageSchema, roomSchema, pizzaSchema]
    for (const schema of schemasToLoad) {
      if (schema && schema.name && schema.version) {
        this.extensions[schema.name] = schema as ExtensionSchema
      }
    }
  }

  public getCoreSchema(): any {
    return this.coreSchema
  }

  public getExtensionSchema(name: string): ExtensionSchema | undefined {
    return this.extensions[name]
  }

  public isSchemaAvailable(name: string, version: string): boolean {
    const ext = this.extensions[name]
    return !!ext && ext.version === version
  }

  public listExtensions(): Array<{ name: string; version: string }> {
    return Object.values(this.extensions).map((ext) => ({ name: ext.name, version: ext.version }))
  }
}

const schemaRegistry = new SchemaRegistry()
export default schemaRegistry
