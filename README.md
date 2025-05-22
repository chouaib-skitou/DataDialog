# DataDialog

**DataDialog** is a React + TypeScript front-end client for creating and viewing structured conversation threads. Each message can include an optional **structured** section validated automatically against JSON Schemas, enabling rich interactions (forms, polls, schedules, etc.) without sacrificing the flexibility of a classic chat interface.

---

## 🚀 Features

* **Conversation Threads**

  * Metadata: UUID, title, participants, creation timestamp
  * Chronological display of messages

* **Structured Messages**

  * Free-text body plus optional `structured` payload
  * JSON Schema validation to guarantee data integrity
  * Domain-specific extensions (e.g. “internship”, “pizza order”, etc.)

* **Dynamic Schema Loading**

  * Load any JSON Schema at runtime following our conventions
  * Automatic rendering of fields (checkbox, radio, date picker, color picker…)

---

## 🛠️ Technologies

* **React** (v18+) — Declarative component-based UI
* **TypeScript** — Static typing and safer code
* **JSON Schema** — Formal definition of data structures
* **Ajv** — JSON Schema validation engine
* **uuid** — Generation of unique identifiers (UUID v4)
* **ESLint** & **Prettier** — Linting and code formatting
* **React Router** (optional) — Navigation between threads
* **Tailwind CSS** (optional) — Utility-first CSS framework for rapid styling

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone git@github.com:YourUsername/DataDialog.git
cd DataDialog

# 2. Install dependencies
npm install

# 3. Run in development mode
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
DataDialog/
├── README.md
├── tsconfig.json
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.tsx
    ├── App.tsx
    ├── schema/
    │   ├── noyau.schema.json
    │   └── extensions/
    │       ├── stage.schema.json
    │       └── pizza.schema.json
    ├── schema.ts
    └── components/
        ├── Thread.tsx
        ├── Message.tsx
        └── FieldRenderer.tsx
```

* **schema/**: JSON Schemas for the core and extension models
* **schema.ts**: Imports and exports schemas for use in the app
* **components/**:

  * `Thread.tsx`: Renders a conversation thread
  * `Message.tsx`: Renders a message (text + structured fields)
  * `FieldRenderer.tsx`: Generic renderer for structured field types

---

## ✍️ Customization & Extensions

1. **Add a New Schema**

   * Place your JSON Schema in `src/schema/extensions/`
   * Import and register it in `src/schema.ts`

2. **Render New Field Types**

   * Extend `FieldRenderer.tsx` to handle your new `type` values
   * Implement corresponding input components (e.g. date picker, select)

---

## 🤝 Contributing

1. Fork this repository
2. Create a branch `feature/your-extension`
3. Submit a detailed Pull Request

---

## 📄 License

This project is released under the MIT License. See the [`LICENSE`](LICENSE) file for details.
