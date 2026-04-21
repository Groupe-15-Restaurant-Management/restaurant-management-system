import React, { useState, useEffect } from 'react'
import reservationService from '../../services/reservationService'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Users, Phone, Mail, MessageSquare } from 'lucide-react'

const Reservation = () => {
  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)
  const [formData, setFormData] = useState({
    date: '', time: '19:00', personnes: 2, occasion: 'diner',
    nom: '', telephone: '', email: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (formData.date) loadTables()
  }, [formData.date, formData.personnes])

  const loadTables = async () => {
  try {
    // ✅ Le service retourne déjà response.data, donc res est directement le tableau
    const availableTables = await reservationService.getAvailable(
      `${formData.date}T${formData.time}`,
      parseInt(formData.personnes) // ✅ Convertir en nombre
    )
    setTables(availableTables) // ✅ CORRECTION : ne pas faire .data
  } catch (e) {
    console.error("Erreur chargement tables :", e)
    setTables([])
  }
}

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!selectedTable || !formData.nom || !formData.telephone) {
    return alert('Veuillez sélectionner une table et remplir les champs obligatoires')
  }

  setLoading(true)
  try {
    await reservationService.createInvited({
      table_id: selectedTable.id,
      date_heure: `${formData.date}T${formData.time}`,
      nombre_personnes: parseInt(formData.personnes), // ✅ Int obligatoire
      nom_contact: formData.nom,
      telephone: formData.telephone,
      email: formData.email || null,
      occasion: formData.occasion,
      demandes_speciales: formData.notes || null
    })
    alert('✅ Réservation confirmée !')
    navigate('/menu')
  } catch (e) {
    console.error(e)
    alert('❌ Erreur : ' + (e.response?.data?.detail || 'Vérifiez vos informations.'))
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Réserver une table</h1>
        
        {/* Grille Tables */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Plan des tables</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {tables.map(t => (
              <button key={t.id} onClick={() => setSelectedTable(t)}
                className={`p-3 rounded-lg border-2 font-bold transition ${selectedTable?.id === t.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                {t.numero}
              </button>
            ))}
          </div>
          {selectedTable && <p className="mt-3 text-green-700 font-medium">Table {selectedTable.numero} sélectionnée</p>}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure</label>
              <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 border">
                <option value="18:00">18h00</option><option value="19:00">19h00</option><option value="20:00">20h00</option><option value="21:00">21h00</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Personnes</label>
              <input type="number" min="1" max="10" value={formData.personnes} onChange={e => setFormData({...formData, personnes: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Occasion</label>
              <select value={formData.occasion} onChange={e => setFormData({...formData, occasion: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 border">
                <option value="diner">Dîner classique</option><option value="anniversaire">Anniversaire</option><option value="affaires">Réunion d'affaires</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <input placeholder="Nom complet *" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full p-2 border rounded-lg" />
            <input placeholder="Téléphone *" required value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full p-2 border rounded-lg" />
            <input placeholder="Email (optionnel)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-lg" />
            <textarea placeholder="Demandes spéciales" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2 border rounded-lg" rows="2"></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? 'Confirmation...' : 'Confirmer la réservation'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default Reservation