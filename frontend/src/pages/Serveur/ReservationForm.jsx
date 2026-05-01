import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import reservationService from '../../services/reservationService'
import tableService from '../../services/tableService'
import Button from '../../components/Common/Button'
import { Calendar, Users, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react'

/**
 * Formulaire de réservation pour serveur
 * @param {Function} onSuccess - Callback appelé après succès (ferme modal + refresh)
 * @param {Function} onCancel - Callback appelé si annulation
 */
const ReservationForm = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate()
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    table_id: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    nombre_personnes: 2,
    nom_client: '',  // ✅ CORRECTION : nom_client au lieu de nom_contact
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
      const tables = await tableService.getTables()
      
      // Filtrage robuste avec vérification des propriétés
      const availableTables = Array.isArray(tables) 
        ? tables.filter(t => 
            t?.statut && 
            (t.statut === 'libre' || t.statut === 'reservee')
          )
        : []

      setTables(availableTables)

      if (availableTables.length === 0) {
        console.warn('⚠️ Aucune table disponible trouvée')
      }
    } catch (error) {
      console.error('❌ Erreur chargement tables:', error)
      // Message utilisateur utile
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.')
      } else if (error.response?.status === 403) {
        alert('Accès non autorisé.')
      } else {
        alert('Erreur: Impossible de charger les tables.')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation basique
    if (!formData.table_id || !formData.nom_client || !formData.telephone) {  // ✅ CORRECTION : nom_client
      return alert('Veuillez remplir la table, le nom et le téléphone.')
    }

    setLoading(true)
    try {
      const datetime = `${formData.date}T${formData.time}`
      
      await reservationService.createReservation({
        table_id: parseInt(formData.table_id),
        date_heure: datetime,
        nombre_personnes: formData.nombre_personnes,
        nom_client: formData.nom_client,  // ✅ CORRECTION : nom_client
        telephone: formData.telephone,
        email: formData.email || undefined,
        occasion: formData.occasion,
        demandes_speciales: formData.demandes_speciales
      })
      
      // ✅ Appel du callback de succès (au lieu de navigate)
      if (onSuccess) {
        onSuccess()
      }
      
    } catch (err) {
      console.error('Erreur réservation:', err)
      alert(err.response?.data?.detail || 'Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sélection Table & Horaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Table disponible *
          </label>
          <select 
            required 
            value={formData.table_id} 
            onChange={e => setFormData({...formData, table_id: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">-- Choisir une table --</option>
            {tables.map(t => (
              <option key={t.id} value={t.id}>
                Table {t.numero} ({t.capacite} pers.)
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input 
              type="date" 
              required 
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
            <select 
              value={formData.time} 
              onChange={e => setFormData({...formData, time: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500"
            >
              <option value="18:00">18:00</option>
              <option value="18:30">18:30</option>
              <option value="19:00">19:00</option>
              <option value="19:30">19:30</option>
              <option value="20:00">20:00</option>
              <option value="20:30">20:30</option>
              <option value="21:00">21:00</option>
            </select>
          </div>
        </div>
      </div>

      {/* Infos Client */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-600" />
          Coordonnées du client
        </h3>
        <input 
          placeholder="Nom complet *" 
          required 
          value={formData.nom_client}  // ✅ CORRECTION : nom_client
          onChange={e => setFormData({...formData, nom_client: e.target.value})} 
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
              placeholder="Téléphone *" 
              required 
              value={formData.telephone} 
              onChange={e => setFormData({...formData, telephone: e.target.value})} 
              className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-primary-500" 
            />
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
              placeholder="Email (optionnel)" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-primary-500" 
            />
          </div>
        </div>
      </div>

      {/* Occasion & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
          <select 
            value={formData.occasion} 
            onChange={e => setFormData({...formData, occasion: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500"
          >
            <option value="diner">Dîner classique</option>
            <option value="anniversaire">Anniversaire</option>
            <option value="affaires">Réunion d'affaires</option>
            <option value="romantique">Dîner romantique</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes *</label>
          <input 
            type="number" 
            min="1" 
            max="20" 
            required 
            value={formData.nombre_personnes} 
            onChange={e => setFormData({...formData, nombre_personnes: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500" 
          />
        </div>
      </div>
      
      <div className="relative">
        <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <textarea 
          placeholder="Demandes spéciales / Allergies / Préférences" 
          value={formData.demandes_speciales} 
          onChange={e => setFormData({...formData, demandes_speciales: e.target.value})} 
          className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-primary-500" 
          rows="2"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="gray" 
          className="flex-1"
          onClick={handleCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          variant="success" 
          className="flex-1 py-3" 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Enregistrement...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmer la Réservation
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}

export default ReservationForm