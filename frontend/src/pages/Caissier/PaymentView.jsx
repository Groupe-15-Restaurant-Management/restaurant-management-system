import React, { useState } from 'react'
import paymentService from '../../services/paymentService'
import { Banknote, CreditCard, Smartphone, Printer, Split } from 'lucide-react'

const PaymentView = () => {
  const [mode, setMode] = useState('')
  const [loading, setLoading] = useState(false)
  // Simulation données commande
  const commande = { id: 12345, table: 12, serveur: 'Jean', total: 50.60, items: [{nom: 'Burger', qty: 2, price: 24}, {nom: 'Coca', qty: 3, price: 9}] }

  const handlePay = async () => {
    if (!mode) return alert('Sélectionnez un mode de paiement')
    setLoading(true)
    try {
      await paymentService.process({ commande_id: commande.id, montant: commande.total, mode_paiement: mode })
      alert('Paiement validé ! Facture générée.')
      // window.print() ou téléchargement PDF ici
    } catch(e) { alert('Erreur paiement') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode Paiement */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Mode de paiement</h2>
          <div className="grid grid-cols-1 gap-3">
            {[{id:'especes', icon: Banknote, label:'Espèces'}, {id:'carte', icon: CreditCard, label:'Carte Bancaire'}, {id:'mobile_money', icon: Smartphone, label:'Mobile Money'}].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} className={`flex items-center p-4 rounded-lg border-2 transition ${mode === m.id ? 'border-green-500 bg-green-50 shadow' : 'border-gray-200 hover:bg-gray-50'}`}>
                <m.icon className={`w-6 h-6 mr-3 ${mode === m.id ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
          <h2 className="text-xl font-bold mb-4">Résumé Commande #{commande.id}</h2>
          <div className="flex-1 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p>Table {commande.table} • Serveur: {commande.serveur}</p>
            <hr />
            {commande.items.map((i, idx) => <div key={idx} className="flex justify-between"><span>{i.qty}x {i.nom}</span><span>€{i.price.toFixed(2)}</span></div>)}
            <hr />
            <div className="flex justify-between font-bold text-lg text-green-700 pt-2"><span>Total</span><span>€{commande.total.toFixed(2)}</span></div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button className="flex items-center justify-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"><Split className="w-4 h-4 mr-1"/> Split</button>
            <button className="flex items-center justify-center bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"><Printer className="w-4 h-4 mr-1"/> Reçu</button>
          </div>
          <button onClick={handlePay} disabled={loading} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? 'Traitement...' : 'VALIDER LE PAIEMENT'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default PaymentView