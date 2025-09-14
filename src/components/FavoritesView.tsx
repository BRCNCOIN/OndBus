import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, MapPin, Trash2 } from 'lucide-react';
import { storageService } from '../services/storage';

export const FavoritesView: React.FC = () => {
  const [favoriteRoutes, setFavoriteRoutes] = React.useState(storageService.getFavoriteRoutes());
  const [searchHistory] = React.useState(storageService.getSearchHistory());

  const removeFavorite = (routeId: string) => {
    storageService.removeFavoriteRoute(routeId);
    setFavoriteRoutes(storageService.getFavoriteRoutes());
  };

  return (
    <div className="p-4 space-y-6">
      {/* Rotas Favoritas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Heart className="h-6 w-6 mr-2 text-red-500" />
          Rotas Favoritas
        </h2>

        {favoriteRoutes.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma rota favoritada ainda</p>
            <p className="text-sm text-gray-400 mt-2">
              Favorite suas rotas mais usadas para acesso rápido
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {route.origin} → {route.destination}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{route.lines.length} linha(s)</span>
                      <span>{route.estimatedTime} min</span>
                      <span>{route.distance.toFixed(1)} km</span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-1">
                      Salvo em {new Date(route.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <motion.button
                    onClick={() => removeFavorite(route.id)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Histórico de Buscas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Clock className="h-6 w-6 mr-2 text-blue-500" />
          Histórico de Buscas
        </h2>

        {searchHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma busca realizada ainda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {searchHistory.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-lg p-3"
              >
                <p className="text-gray-700 font-medium">{term}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Suas Estatísticas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{favoriteRoutes.length}</p>
            <p className="text-sm opacity-80">Rotas Favoritadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{searchHistory.length}</p>
            <p className="text-sm opacity-80">Buscas Realizadas</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
