import React from 'react'

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${colors[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard