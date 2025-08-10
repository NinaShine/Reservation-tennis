import { Coach, Court } from '../types/booking'

export const courts: Court[] = [
  { id: 'c1', name: 'Terrain dur 1', type: 'hard', hourlyRate: 0 },
  { id: 'c2', name: 'Terrain dur 2', type: 'hard', hourlyRate: 0 },
  { id: 'c3', name: 'Terrain dur 3', type: 'hard', hourlyRate: 0 },
  { id: 'c4', name: 'Terrain dur 4', type: 'hard', hourlyRate: 0 },
  { id: 'c5', name: 'Terrain dur 5', type: 'hard', hourlyRate: 0 },
]

export const coaches: Coach[] = [
  {
    id: 'p1',
    name: 'Coach Amine',
    specialty: 'Service & volée',
    rating: 4.8,
    hourlyRate: 0,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256'
  },
  {
    id: 'p2',
    name: 'Coach Hanane',
    specialty: 'Fond de court',
    rating: 4.6,
    hourlyRate: 0,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256'
  },
  {
    id: 'p3',
    name: 'Coach Ronaldo',
    specialty: 'Physique & endurance',
    rating: 4.9,
    hourlyRate: 0,
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256'
  }
]

export function generateTimeSlots() {
  const slots: string[] = []
  for (let h = 8; h <= 20; h++) {
    const hour = String(h).padStart(2, '0')
    slots.push(`${hour}:00`, `${hour}:30`)
  }
  return slots
}
