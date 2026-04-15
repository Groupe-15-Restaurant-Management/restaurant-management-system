import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, User } from 'lucide-react';

const Reservation = () => {
  const [formData, setFormData] = useState({
    nomClient: '',
    telephone: '',
    email: '',
    date: '',
    heure: '',
    nombrepersonne: 2,
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Réservation:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-main py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary p-6 text-white">
            <h1 className="text-2xl font-bold">Réservation de table</h1>
            <p className="opacity-90">Réservez votre table en quelques clics</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Nom complet *
                </label>
                <input
                  type="text"
                  name="nomClient"
                  required
                  value={formData.nomClient}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Jean Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="77 123 45 67"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="jean@example.com"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Heure *
                </label>
                <input
                  type="time"
                  name="heure"
                  required
                  value={formData.heure}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Nombre de personnes *
              </label>
              <select
                name="nombrepersonne"
                value={formData.nombrepersonne}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message (optionnel)</label>
              <textarea
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Demandes spéciales, allergies, occasion..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
            >
              Réserver maintenant
            </button>
          </form>
        </div>
        
        {submitted && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Réservation envoyée avec succès !
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;