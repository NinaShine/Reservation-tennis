import React from 'react'

interface Props {
  timeSlots: string[]
  selectedSlot: string | null
  onSlotSelect: (s: string) => void
}

export default function TimeSlotGrid({ timeSlots, selectedSlot, onSlotSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {timeSlots.map((slot) => (
        <button
          key={slot}
          className={`py-2 px-3 rounded-lg border text-sm ${
            selectedSlot === slot
              ? 'bg-tennis-600 text-white border-transparent'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => onSlotSelect(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  )
}