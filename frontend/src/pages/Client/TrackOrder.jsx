import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Circle, Package, Truck, Clock, Home } from 'lucide-react';

const TrackOrder = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { id: 1, label: 'Commande confirmée', icon: CheckCircle, completed: currentStep >= 1 },
    { id: 2, label: 'En préparation', icon: Package, completed: currentStep >= 2 },
    { id: 3, label: 'Prête', icon: Clock, completed: currentStep >= 3 },
    { id: 4, label: 'En livraison', icon: Truck, completed: currentStep >= 4 },
    { id: 5, label: 'Livrée', icon: Home, completed: currentStep >= 5 }
  ];

  useEffect(() => {
    // Simuler la progression
    const interval = setInterval(() => {
      setCurrentStep(prev => prev < 5 ? prev + 1 : prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-main py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Suivi de commande #{id}</h1>
          
          {/* Timeline */}
          <div className="relative">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center mb-8">
                <div className="relative">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center z-10 relative
                    ${step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                  `}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      absolute top-10 left-5 w-0.5 h-16
                      ${step.completed && steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                    `} />
                  )}
                </div>
                <div className="ml-4">
                  <p className={`font-semibold ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  {step.completed && (
                    <p className="text-sm text-gray-400">Terminé</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Une notification vous sera envoyée à chaque étape
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;