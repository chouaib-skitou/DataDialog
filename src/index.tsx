import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./styles/globals.css" // Tailwind CSS
import { PluginProvider } from "./contexts/PluginProvider.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PluginProvider>
      <App />
    </PluginProvider>
  </React.StrictMode>,
)
