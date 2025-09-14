import React from 'react';
import { Bus, MapPin, Star, Settings, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiStatus } from '../services/api';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { demoMode } = apiStatus.checkAPIsStatus();
  
  const menuItems = [
    { id: 'search', icon: Bus, label: 'Buscar' },
    { id: 'map', icon: MapPin, label: 'Mapa' },
    { id: 'favorites', icon: Star, label: 'Favoritos' },
    { id: 'settings', icon: Settings, label: 'Config' }
  ];

  return (
    <motion.header 
      className="bg-blue-600 text-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        {/* Banner de modo demo */}
        {demoMode && (
          <motion.div 
            className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Modo Demonstração - Adicione suas chaves de API para dados reais</span>
            </div>
          </motion.div>
        )}

        {/* Logo e título */}
        <div className="flex items-center justify-between py-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white rounded-full p-2">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">OndBus</h1>
              <p className="text-blue-100 text-sm">
                São Paulo {demoMode && '(Demo)'}
              </p>
            </div>
          </motion.div>

          <div className="text-right">
            <p className="text-sm text-blue-100">
              {demoMode ? 'Dados Simulados' : 'Tempo Real'}
            </p>
            <p className="text-xs text-blue-200">
              {demoMode ? 'Demo Mode' : 'SPTrans'}
            </p>
          </div>
        </div>

        {/* Navegação */}
        <nav className="pb-4">
          <div className="flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex-1 flex flex-col items-center py-3 px-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-blue-100 hover:bg-blue-500/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
