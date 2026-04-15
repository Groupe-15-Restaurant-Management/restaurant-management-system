import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders] = useState([
    {
      id: 'CMD-001',
      date: '2024-01-15',
      total: 45.50,
      status: 'livree',
      items: 3
    },
    {
      id: 'CMD-002',
      date: '2024-01-20',
      total: 32.00,
      status: 'en_preparation',
      items: 2
    },
    {
      id: 'CMD-003',
      date: '2024-01-25',
      total: 67.80,
      status: 'livree',
      items: 4
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      en_attente: { color: 'bg-yellow-500', icon: Clock, text: 'En attente' },
      en_preparation: { color: 'bg-blue-500', icon: Package, text: 'En préparation' },
      prete: { color: 'bg-purple-500', icon: CheckCircle, text: 'Prête' },
      livree: { color: 'bg-green-500', icon: Truck, text: 'Livrée' },
      annulee: { color: 'bg-red-500', icon: XCircle, text: 'Annulée' }
    };
    const config = statusConfig[status] || statusConfig.en_attente;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-main py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Historique des commandes</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Vous n'avez pas encore de commandes</p>
            <Link to="/menu" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">
              Commander maintenant
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-gray-500 text-sm">Date: {order.date}</p>
                    <p className="text-gray-500 text-sm">{order.items} articles</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{order.total.toFixed(2)} €</p>
                    <Link 
                      to={`/track-order/${order.id}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                    >
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;