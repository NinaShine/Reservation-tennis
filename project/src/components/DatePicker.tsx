import React from 'react'

interface Props {
  selectedDate: Date
  onDateSelect: (d: Date) => void
}

export default function DatePicker({ selectedDate, onDateSelect }: Props) {
  // Très simple: input type=date pour la démo
  const value = selectedDate.toISOString().split('T')[0]
  return (
    <input
      type="date"
      className="p-2 border border-gray-300 rounded-lg"
      value={value}
      onChange={(e) => onDateSelect(new Date(e.target.value))}
    />
  )
}