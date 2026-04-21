import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import reservationService from '../../services/reservationService'
import tableService from '../../services/tableService'
import Button from '../../components/Common/Button'
import { Calendar, Users, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react'

const ReservationForm = () => {
  const navigate = useNavigate()
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    table_id: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    nombre_personnes: 2,
    nom_contact: '',
    telephone: '',
    email: '',
    occasion: 'diner',
    demandes_speciales: ''
  })

  useEffect(() => {
    loadTables()
  }, [])

  const loadTables = async () => {
    try {
      const res = await tableService.getTables()
      // Filtrer uniquement les tables libres ou réservables
      setTables(res.data.filter(t => t.statut === 'libre' || t.statut === 'reservee'))
    } catch (e) { console.error(e) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.table_id || !formData.nom_contact || !formData.telephone) {
      return alert('Veuillez remplir la table, le nom et le téléphone.')
    }
    setLoading(true)
    try {
      const datetime = `${formData.date}T${formData.time}`
      await reservationService.createReservation({
        table_id: parseInt(formData.table_id),
        date_heure: datetime,
        nombre_personnes: formData.nombre_personnes,
        nom_contact: formData.nom_contact,
        telephone: formData.telephone,
        email: formData.email || undefined,
        occasion: formData.occasion,
        demandes_speciales: formData.demandes_speciales
      })
      alert('✅ Réservation enregistrée avec succès !')
      navigate('/serveur/tables')
    } catch (err) {
      alert(err.response?.data?.detail || 'Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Calendar className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle Réservation (Serveur)</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sélection Table & Horaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Table disponible</label>
              <select 
                required 
                value={formData.table_id} 
                onChange={e => setFormData({...formData, table_id: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-primary-500"
              >
                <option value="">-- Choisir une table --</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>Table {t.numero} ({t.capacite} pers.)</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option><option>21:00</option>
                </select>
              </div>
            </div>
          </div>

          {/* Infos Client */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-medium text-gray-800 flex items-center gap-2"><Users className="w-4 h-4"/> Coordonnées du client</h3>
            <input placeholder="Nom complet *" required value={formData.nom_contact} onChange={e => setFormData({...formData, nom_contact: e.target.value})} className="w-full p-2 border rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                <input placeholder="Téléphone *" required value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full pl-9 p-2 border rounded-lg" />
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                <input placeholder="Email (optionnel)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-9 p-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Occasion & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
              <select value={formData.occasion} onChange={e => setFormData({...formData, occasion: e.target.value})} className="w-full p-2 border rounded-lg">
                <option value="diner">Dîner classique</option>
                <option value="anniversaire">Anniversaire</option>
                <option value="affaires">Réunion d'affaires</option>
                <option value="romantique">Dîner romantique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes</label>
              <input type="number" min="1" max="20" required value={formData.nombre_personnes} onChange={e => setFormData({...formData, nombre_personnes: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          
          <div className="relative">
            <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
            <textarea placeholder="Demandes spéciales / Allergies / Préférences" value={formData.demandes_speciales} onChange={e => setFormData({...formData, demandes_speciales: e.target.value})} className="w-full pl-9 p-2 border rounded-lg" rows="2"></textarea>
          </div>

          <Button type="submit" variant="success" className="w-full py-3 text-lg" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Confirmer la Réservation'}
          </Button>
        </form>
      </div>
    </div>
  )
}
export default ReservationForm