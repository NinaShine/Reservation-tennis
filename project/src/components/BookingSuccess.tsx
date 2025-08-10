import React from 'react'
import { CheckCircle, Calendar, Clock, MapPin, User } from 'lucide-react'
import { Booking, Court, Coach } from '../types/booking'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface BookingSuccessProps {
  booking: Booking
  court: Court
  coach: Coach | null
  onNewBooking: () => void
}

export default function BookingSuccess({ booking, court, coach, onNewBooking }: BookingSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-tennis-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h2>
          <p className="text-gray-600">Vous recevrez un email de confirmation.</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">Détails</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3"><MapPin className="h-5 w-5 text-gray-400" /><span>{court.name}</span></div>
            <div className="flex items-center space-x-3"><Calendar className="h-5 w-5 text-gray-400" /><span>{format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}</span></div>
            <div className="flex items-center space-x-3"><Clock className="h-5 w-5 text-gray-400" /><span>{booking.timeSlot} ({booking.duration}h)</span></div>
            {coach && (<div className="flex items-center space-x-3"><User className="h-5 w-5 text-gray-400" /><span>Coach: {coach.name}</span></div>)}
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p>Numéro de réservation: <span className="font-mono font-medium">{booking.id}</span></p>
        </div>

        <button onClick={onNewBooking} className="btn-primary w-full">Nouvelle réservation</button>
      </div>
    </div>
  )
}
