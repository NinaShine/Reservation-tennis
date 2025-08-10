export interface Court {
  id: string
  name: string
  type: 'clay' | 'hard' | 'grass'
  hourlyRate?: number    // ← optionnel maintenant
}

export interface Coach {
  id: string
  name: string
  specialty: string
  rating: number
  hourlyRate: number
  avatar: string
}

export interface Booking {
  id: string
  courtId: string
  coachId?: string
  date: string // yyyy-MM-dd
  timeSlot: string
  duration: number
  status: 'confirmed'
}
