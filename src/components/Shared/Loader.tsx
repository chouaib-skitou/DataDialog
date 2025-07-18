import type React from "react"

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span className="ml-2 text-gray-700">Chargement...</span>
    </div>
  )
}

export default Loader
