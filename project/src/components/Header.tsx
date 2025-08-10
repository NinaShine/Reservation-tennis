// src/components/Header.tsx
import React from 'react'
import { Calendar, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="bg-green-600 border-b border-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo / Image club */}
        <div className="flex items-center space-x-3">
          <img
            src="/mbb-logo.png" 
            alt="Club de Tennis"
            className="h-12 w-auto object-cover"
          />
          <div className="flex items-center space-x-2">
          
            <span className="font-semibold text-white">Tennis Booking</span>
          </div>
        </div>

        {/* Droite */}
        <div className="flex items-center space-x-4">
          <nav className="text-sm text-white">
            Fait par <strong>Nina SALHI</strong>
          </nav>

          {/* Icône Admin */}
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-lg hover:bg-green-700 transition"
            title="Voir les réservations"
          >
             <Calendar className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  )
}
