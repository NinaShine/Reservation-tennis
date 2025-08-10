import React, { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '' // '' = proxy Vite en dev

type AdminItem = {
  id: string
  date: string
  timeSlot: string
  duration: number
  courtId: string
  courtName: string | null
  coachId?: string | null
  coachName?: string | null
  playerName: string
  playerEmail: string
  playerPhone?: string | null
  createdAt: string
}

export default function AdminBooking() {
  const [bookings, setBookings] = useState<AdminItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [onlyFuture, setOnlyFuture] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bookings`)
        const data = await res.json().catch(() => ({} as any))

        // Accepte { ok, items } (backend) OU un tableau direct (fallback)
        let list: AdminItem[] = []
        if (Array.isArray((data as any).items)) list = (data as any).items
        else if (Array.isArray(data)) list = data as any
        else if ((data as any).ok && Array.isArray((data as any).items)) list = (data as any).items

        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) // récent → ancien
        setBookings(list)
      } catch (e: any) {
        setError(e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const now = new Date()
    return (bookings || []).filter((it) => {
      if (onlyFuture) {
        const dt = new Date(`${it.date}T${it.timeSlot}:00`)
        if (dt < now) return false
      }
      const txt =
        `${it.id} ${it.playerName} ${it.playerEmail} ${it.playerPhone || ''} ` +
        `${it.courtName || ''} ${it.coachName || ''} ${it.date} ${it.timeSlot}`.toLowerCase()
      return txt.includes(q.toLowerCase())
    })
  }, [bookings, q, onlyFuture])

  if (loading) return <div className="p-6">Chargement…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Historique des réservations</h1>
          <a href="/" className="text-sm text-tennis-600 hover:underline">← Retour au site</a>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (nom, email, terrain, date, heure, id)…"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyFuture}
              onChange={(e) => setOnlyFuture(e.target.checked)}
            />
            Réservations à venir seulement
          </label>
        </div>

        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">Réf</th>
                <th className="text-left px-3 py-2">Joueur</th>
                <th className="text-left px-3 py-2">Email</th>
                <th className="text-left px-3 py-2">Téléphone</th>
                <th className="text-left px-3 py-2">Terrain</th>
                <th className="text-left px-3 py-2">Coach</th>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Heure</th>
                <th className="text-left px-3 py-2">Durée</th>
                <th className="text-left px-3 py-2">Créée le</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-3 py-4 text-center text-gray-500">Aucune réservation</td></tr>
              )}
              {(filtered || []).map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-3 py-2 font-mono">{b.id}</td>
                  <td className="px-3 py-2">{b.playerName}</td>
                  <td className="px-3 py-2">{b.playerEmail}</td>
                  <td className="px-3 py-2">{b.playerPhone || '—'}</td>
                  <td className="px-3 py-2">{b.courtName || b.courtId}</td>
                  <td className="px-3 py-2">{b.coachName || '—'}</td>
                  <td className="px-3 py-2">{b.date}</td>
                  <td className="px-3 py-2">{b.timeSlot}</td>
                  <td className="px-3 py-2">{b.duration}h</td>
                  <td className="px-3 py-2">{new Date(b.createdAt).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          Source : <code>/api/bookings</code>. Si le tableau est vide, vérifie que le backend renvoie bien <code>{`{ ok: true, items: [...] }`}</code>.
        </div>
      </div>
    </div>
  )
}
