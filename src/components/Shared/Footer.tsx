import type React from "react"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-gray-100 text-center p-3 text-sm text-gray-600 border-t">
      <p>&copy; {currentYear} – DataDialog – Projet Polytech</p>
    </footer>
  )
}

export default Footer
