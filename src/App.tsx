import React, { useEffect, useState } from 'react'
import { startOfToday } from 'date-fns'

import Header from './components/Header'
import CourtCard from './components/CourtCard'
import CoachCard from './components/CoachCard'
import DatePicker from './components/DatePicker'
import TimeSlotGrid from './components/TimeSlotGrid'
import BookingForm from './components/BookingForm'
import BookingSuccess from './components/BookingSuccess'

import { courts, coaches, generateTimeSlots } from './data/mockData'
import { Court, Coach, Booking } from './types/booking'

const API_BASE = import.meta.env.VITE_API_URL || '' // '' = proxy Vite en dev

type BookingStep = 'selection' | 'form' | 'success'
const LS_KEY = 'tennis_bookings'

export default function App() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('selection')
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const [timeSlots] = useState(generateTimeSlots())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sendingMail, setSendingMail] = useState(false)

  // Charger/Sauver l'historique local pour l’anti-doublon UI
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setBookings(JSON.parse(raw))
    } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(bookings)) } catch {}
  }, [bookings])

  const canProceedToForm = !!(selectedCourt && selectedTimeSlot)

  // Vérifie s'il y a conflit sur terrain/coach au même créneau
  const findConflict = (args: { dateISO: string; timeSlot: string; courtId: string; coachId?: string }) => {
    const { dateISO, timeSlot, courtId, coachId } = args
    const sameDT = (b: Booking) => b.date === dateISO && b.timeSlot === timeSlot

    if (bookings.some((b) => sameDT(b) && b.courtId === courtId)) {
      return "Ce terrain n'est pas disponible à ce créneau. Veuillez changer votre réservation."
    }
    if (coachId && bookings.some((b) => sameDT(b) && b.coachId && b.coachId === coachId)) {
      return "Ce coach n'est pas disponible à ce créneau. Veuillez changer votre réservation."
    }
    return null
  }

  // Étape 1 → 2 : vérifier avant d’ouvrir le formulaire
  const handleContinue = () => {
    if (!selectedCourt || !selectedTimeSlot) return
    setErrorMsg(null)
    const dateISO = selectedDate.toISOString().split('T')[0]
    const clash = findConflict({ dateISO, timeSlot: selectedTimeSlot, courtId: selectedCourt.id, coachId: selectedCoach?.id })
    if (clash) { setErrorMsg(clash); return }
    setCurrentStep('form')
  }

  // Formulaire confirmé : re-vérifier → envoyer email → enregistrer → succès
  const handleBookingSubmit = async (formData: any) => {
    setErrorMsg(null)

    // re-vérif conflit
    const clash = findConflict({
      dateISO: formData.date,
      timeSlot: formData.timeSlot,
      courtId: formData.courtId,
      coachId: formData.coachId
    })
    if (clash) {
      setCurrentStep('selection')
      setErrorMsg(clash)
      return
    }

    // Envoi email (après vérif OK)
    setSendingMail(true)
    try {
      const courtName = courts.find(c => c.id === formData.courtId)?.name || ''
      const coachName = formData.coachId ? (coaches.find(p => p.id === formData.coachId)?.name || null) : null

      const res = await fetch(`${API_BASE}/api/send-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: formData.playerName,
          playerEmail: formData.playerEmail,
          playerPhone: formData.playerPhone,
          courtName,
          coachName,
          dateISO: formData.date,
          timeSlot: formData.timeSlot,
          duration: formData.duration,
          bookingId: formData.id
        })
      })
      if (!res.ok) {
        console.error('Échec envoi email', await res.text().catch(() => ''))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSendingMail(false)
    }

    // Enregistrer côté backend (historique admin)
    try {
      const courtName = courts.find(c => c.id === formData.courtId)?.name || ''
      const coachName = formData.coachId ? (coaches.find(p => p.id === formData.coachId)?.name || null) : null

      const save = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          date: formData.date,
          timeSlot: formData.timeSlot,
          duration: formData.duration ?? 1,
          courtId: formData.courtId,
          courtName,
          coachId: formData.coachId,
          coachName,
          playerName: formData.playerName,
          playerEmail: formData.playerEmail,
          playerPhone: formData.playerPhone
        })
      })
      if (!save.ok) {
        console.error('Erreur enregistrement /api/bookings', await save.text().catch(() => ''))
      }
    } catch (e) {
      console.error('Save booking failed', e)
    }

    // Mettre à jour l’état local et passer à l’écran succès
    const booking: Booking = {
      id: formData.id,
      courtId: formData.courtId,
      coachId: formData.coachId,
      date: formData.date,
      timeSlot: formData.timeSlot,
      duration: formData.duration ?? 1,
      status: 'confirmed'
    }
    setBookings(prev => [...prev, booking])
    setCurrentStep('success')
  }

  const handleNewBooking = () => {
    setCurrentStep('selection')
    setSelectedCourt(null)
    setSelectedCoach(null)
    setSelectedDate(startOfToday())
    setSelectedTimeSlot(null)
    setErrorMsg(null)
  }

  if (currentStep === 'success') {
    const last = bookings[bookings.length - 1]
    const court = courts.find(c => c.id === last.courtId)!
    const coach = last.coachId ? (coaches.find(p => p.id === last.coachId) || null) : null
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookingSuccess booking={last} court={court} coach={coach} onNewBooking={handleNewBooking} />
        </main>
      </div>
    )
  }

  if (currentStep === 'form' && selectedCourt && selectedTimeSlot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {sendingMail && (
            <div className="mb-4 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-3">
              Envoi de l’email de confirmation…
            </div>
          )}
          <BookingForm
            court={selectedCourt}
            coach={selectedCoach}
            date={selectedDate}
            timeSlot={selectedTimeSlot}
            onSubmit={handleBookingSubmit}
            onCancel={() => setCurrentStep('selection')}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Réserver un terrain</h2>
          <p className="text-gray-600">Choisissez votre terrain, votre date et votre créneau (coach optionnel)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Terrain */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Choisir un terrain</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map((court) => (
                  <CourtCard key={court.id} court={court} isSelected={selectedCourt?.id === court.id} onSelect={setSelectedCourt} />
                ))}
              </div>
            </div>

            {/* 2. Date */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Choisir une date</h3>
              <DatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>

            {/* 3. Créneau */}
            {selectedCourt && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Choisir un créneau</h3>
                <TimeSlotGrid timeSlots={timeSlots} selectedSlot={selectedTimeSlot} onSlotSelect={setSelectedTimeSlot} />
              </div>
            )}

            {/* 4. Coach (optionnel) */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Choisir un coach (optionnel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {coaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} isSelected={selectedCoach?.id === coach.id} onSelect={setSelectedCoach} />
                ))}
              </div>
              {selectedCoach && (
                <button onClick={() => setSelectedCoach(null)} className="btn-secondary">Réserver sans coach</button>
              )}
            </div>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>

                {errorMsg && (
                  <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                    {errorMsg}
                  </div>
                )}

                {selectedCourt ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Terrain :</span><span className="font-medium">{selectedCourt.name}</span></div>
                    <div className="flex justify-between"><span>Date :</span><span className="font-medium">{selectedDate.toLocaleDateString('fr-FR')}</span></div>
                    {selectedTimeSlot && (<div className="flex justify-between"><span>Heure :</span><span className="font-medium">{selectedTimeSlot}</span></div>)}
                    {selectedCoach && (<div className="flex justify-between"><span>Coach :</span><span className="font-medium">{selectedCoach.name}</span></div>)}
                    <div className="border-t pt-3 mt-4 text-gray-500">Vérifiez les informations puis continuez.</div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sélectionnez un terrain pour voir le résumé</p>
                )}

                <button
                  onClick={handleContinue}
                  disabled={!canProceedToForm}
                  className={`w-full mt-6 ${canProceedToForm ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed py-2 px-4 rounded-lg'}`}
                >
                  Continuer la réservation
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
