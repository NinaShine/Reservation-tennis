import React from 'react'
import { Court } from '../types/booking'

interface CourtCardProps {
  court: Court
  isSelected: boolean
  onSelect: (court: Court) => void
}

export default function CourtCard({ court, isSelected, onSelect }: CourtCardProps) {
  const getCourtTypeColor = (type: string) => {
    switch (type) {
      case 'hard': return 'bg-green-100 text-green-800'
      case 'clay': return 'bg-orange-100 text-orange-800'
      case 'grass': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  const getCourtTypeLabel = (type: string) => {
    switch (type) {
      case 'hard': return 'Dur'
      case 'clay': return 'Terre battue'
      case 'grass': return 'Gazon'
      default: return type
    }
  }

  return (
    <div
      className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-tennis-500 bg-tennis-50' : ''}`}
      onClick={() => onSelect(court)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCourtTypeColor(court.type)}`}>
            {getCourtTypeLabel(court.type)}
          </span>
        </div>
      </div>
    </div>
  )
}
