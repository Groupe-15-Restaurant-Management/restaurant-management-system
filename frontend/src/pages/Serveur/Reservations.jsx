import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Layout/Navbar'
import Button from '../../components/Common/Button'
import DataTable from '../../components/Common/DataTable'
import { Calendar, Clock, Users } from 'lucide-react'

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    // Simulation de données
    setReservations([
      {
        id: 1,
        nom_client: 'Jean Dupont',
        telephone: '06 12 34 56 78',
        email: 'jean@email.com',
        date_heure: '2024-01-20 19:00:00',
        nombre_personnes: 4,
        statut: 'confirmee',
        table: { numero: 5 }
      },
      {
        id: 2,
        nom_client: 'Marie Martin',
        telephone: '06 23 45 67 89',
        email: 'marie@email.com',
        date_heure: '2024-01-20 20:30:00',
        nombre_personnes: 2,
        statut: 'confirmee',
        table: { numero: 3 }
      },
      {
        id: 3,
        nom_client: 'Pierre Bernard',
        telephone: '06 34 56 78 90',
        email: 'pierre@email.com',
        date_heure: '2024-01-21 12:00:00',
        nombre_personnes: 6,
        statut: 'en_attente',
        table: { numero: 8 }
      }
    ])
    setLoading(false)
  }

  const columns = [
    { header: 'Table', accessor: row => `Table ${row.table.numero}` },
    { header: 'Client', accessor: row => row.nom_client },
    { header: 'Téléphone', accessor: 'telephone' },
    { header: 'Date/Heure', accessor: row => new Date(row.date_heure).toLocaleString('fr-FR') },
    { header: 'Personnes', accessor: row => `${row.nombre_personnes} pers.` },
    {
      header: 'Statut',
      accessor: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.statut === 'confirmee' ? 'bg-green-100 text-green-800' :
          row.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.statut === 'confirmee' && 'Confirmée'}
          {row.statut === 'en_attente' && 'En attente'}
          {row.statut === 'annulee' && 'Annulée'}
        </span>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
            <p className="mt-2 text-gray-600">Gérez les réservations de tables</p>
          </div>
          <Button variant="primary">
            <Calendar className="h-5 w-5 mr-2" />
            Nouvelle réservation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Personnes prévues</p>
                <p className="text-2xl font-bold text-gray-900">48</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={reservations}
          emptyMessage="Aucune réservation"
        />
      </div>
    </div>
  )
}

export default Reservations