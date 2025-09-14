import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { SearchView } from './components/SearchView';
import { MapView } from './components/MapView';
import { FavoritesView } from './components/FavoritesView';
import { SettingsView } from './components/SettingsView';
import { BusLine, BusPosition } from './types';
import { sptransApi } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('search');
  const [selectedLine, setSelectedLine] = useState<BusLine | null>(null);
  const [busPositions, setBusPositions] = useState<BusPosition[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);

  // Autenticar SPTrans ao iniciar
  useEffect(() => {
    initializeApp();
  }, []);

  // Buscar posições dos ônibus quando uma linha for selecionada
  useEffect(() => {
    if (selectedLine) {
      loadBusPositions();
      // Atualizar posições a cada 30 segundos
      const interval = setInterval(loadBusPositions, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedLine]);

  const initializeApp = async () => {
    try {
      await sptransApi.authenticate();
      console.log('SPTrans autenticado com sucesso');
    } catch (error) {
      console.error('Erro ao autenticar SPTrans:', error);
    }
  };

  const loadBusPositions = async () => {
    if (!selectedLine) return;

    setIsLoadingPositions(true);
    try {
      const positions = await sptransApi.getBusPositions(selectedLine.id);
      setBusPositions(positions);
    } catch (error) {
      console.error('Erro ao carregar posições dos ônibus:', error);
    } finally {
      setIsLoadingPositions(false);
    }
  };

  const handleSelectLine = (line: BusLine) => {
    setSelectedLine(line);
    setCurrentView('map');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <SearchView onSelectLine={handleSelectLine} />;
      case 'map':
        return (
          <MapView 
            busPositions={busPositions} 
            selectedLine={selectedLine}
          />
        );
      case 'favorites':
        return <FavoritesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <SearchView onSelectLine={handleSelectLine} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>

      {/* Loading indicator para posições de ônibus */}
      {isLoadingPositions && currentView === 'map' && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Atualizando ônibus...</span>
        </div>
      )}

      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
          },
        }}
      />
    </div>
  );
}

export default App;
