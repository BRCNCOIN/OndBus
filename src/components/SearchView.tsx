import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Bus, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { sptransApi, apiStatus } from '../services/api';
import { storageService } from '../services/storage';
import { BusLine } from '../types';

interface SearchViewProps {
  onSelectLine: (line: BusLine) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onSelectLine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<BusLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory] = useState(() => storageService.getSearchHistory());
  const { demoMode } = apiStatus.checkAPIsStatus();

  const popularLines = [
    { id: '4110', name: '4110-10 - Vila Prudente / Cidade Tiradentes', direction: 'Ida' },
    { id: '701A', name: '701A-10 - Terminal Barra Funda / Santana', direction: 'Ida' },
    { id: '5119', name: '5119-10 - Terminal Santo Amaro / Cidade Ademar', direction: 'Ida' },
    { id: '809P', name: '809P-10 - Metrô Vila Madalena / Vila Leopoldina', direction: 'Ida' },
    { id: '2024', name: '2024-10 - Metrô República / Terminal Princesa Isabel', direction: 'Ida' }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite um termo para buscar');
      return;
    }

    setIsLoading(true);
    
    if (demoMode) {
      toast.success('Buscando no modo demonstração...');
    }

    try {
      const results = await sptransApi.searchLines(searchTerm);
      setSearchResults(results);
      storageService.addToSearchHistory(searchTerm);
      
      if (results.length === 0) {
        toast.error('Nenhuma linha encontrada');
      } else {
        toast.success(`${results.length} linha(s) encontrada(s)`);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar linhas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectLine = (line: BusLine) => {
    onSelectLine(line);
    if (demoMode) {
      toast.success('Abrindo mapa com dados simulados');
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Status de conexão */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-center space-x-2 text-sm p-2 rounded-lg ${
          demoMode 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}
      >
        {demoMode ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Modo Demonstração - Dados Simulados</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4" />
            <span>Conectado - Dados em Tempo Real</span>
          </>
        )}
      </motion.div>

      {/* Barra de busca */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite o número ou nome da linha..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <motion.button
          onClick={handleSearch}
          disabled={isLoading || !searchTerm.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Buscando...' : 'Buscar Linhas'}
        </motion.button>
      </motion.div>

      {/* Resultados da busca */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-800">Resultados da Busca</h3>
            {searchResults.map((line, index) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectLine(line)}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Bus className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{line.name}</h4>
                      <p className="text-sm text-gray-500">{line.direction}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Histórico de buscas */}
      {searchHistory.length > 0 && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Buscas Recentes
          </h3>
          <div className="space-y-2">
            {searchHistory.slice(0, 5).map((term, index) => (
              <motion.button
                key={index}
                onClick={() => setSearchTerm(term)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                {term}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Linhas populares */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Linhas Populares {demoMode && '(Demo)'}
        </h3>
        <div className="space-y-2">
          {popularLines.map((line, index) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectLine({
                id: line.id,
                name: line.name,
                direction: line.direction,
                color: '#1E40AF',
                stops: []
              })}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Bus className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{line.name}</h4>
                    <p className="text-sm text-gray-500">{line.direction}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
