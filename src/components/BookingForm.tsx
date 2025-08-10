import React, { useState } from 'react'
import { Court, Coach } from '../types/booking'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface BookingFormProps {
  court: Court
  coach: Coach | null
  date: Date
  timeSlot: string
  onSubmit: (formData: any) => void
  onCancel: () => void
}

export default function BookingForm({ court, coach, date, timeSlot, onSubmit, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    playerName: '',
    playerEmail: '',
    playerPhone: '',
    duration: 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bookingId = `BK${Date.now()}`
    const dateISO = format(date, 'yyyy-MM-dd', { locale: fr })

    onSubmit({
      id: bookingId,
      playerName: formData.playerName,
      playerEmail: formData.playerEmail,
      playerPhone: formData.playerPhone,
      courtId: court.id,
      coachId: coach?.id,
      date: dateISO,
      timeSlot,
      duration: formData.duration
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Finaliser la réservation</h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Récapitulatif</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Terrain:</span><span className="font-medium">{court.name}</span></div>
          <div className="flex justify-between"><span>Date:</span><span className="font-medium">{format(date, 'EEEE d MMMM yyyy', { locale: fr })}</span></div>
          <div className="flex justify-between"><span>Heure:</span><span className="font-medium">{timeSlot}</span></div>
          {coach && (<div className="flex justify-between"><span>Coach:</span><span className="font-medium">{coach.name}</span></div>)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durée (heures)</label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-500 focus:border-transparent"
          >
            <option value={1}>1 heure</option>
            <option value={2}>2 heures</option>
            <option value={3}>3 heures</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
          <input type="text" required value={formData.playerName} onChange={(e) => setFormData({ ...formData, playerName: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input type="email" required value={formData.playerEmail} onChange={(e) => setFormData({ ...formData, playerEmail: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
          <input type="tel" required value={formData.playerPhone} onChange={(e) => setFormData({ ...formData, playerPhone: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-500 focus:border-transparent" />
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Annuler</button>
          <button type="submit" className="flex-1 btn-primary">Confirmer la réservation</button>
        </div>
      </form>
    </div>
  )
}
