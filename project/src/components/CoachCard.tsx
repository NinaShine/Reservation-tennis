import React from 'react'
import { Coach } from '../types/booking'

interface CoachCardProps {
  coach: Coach
  isSelected: boolean
  onSelect: (coach: Coach) => void
}

export default function CoachCard({ coach, isSelected, onSelect }: CoachCardProps) {
  return (
    <div
      className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-tennis-500 bg-tennis-50' : ''
      }`}
      onClick={() => onSelect(coach)}
    >
      <div className="flex items-center space-x-4">
        <img src={coach.avatar} alt={coach.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{coach.name}</h3>
          <p className="text-sm text-gray-600">{coach.specialty}</p>
          {/* Prix supprimé */}
        </div>
      </div>
    </div>
  )
}
