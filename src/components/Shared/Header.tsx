import type React from "react"

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <h1 className="text-2xl font-bold tracking-tight">DataDialog</h1>
      </div>
    </header>
  )
}

export default Header
