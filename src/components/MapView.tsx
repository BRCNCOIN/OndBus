import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { motion } from 'framer-motion';
import { Navigation, Thermometer, Wind, Droplets } from 'lucide-react';
import { locationApi, weatherApi } from '../services/api';
import { UserLocation, WeatherData, BusPosition } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix para os ícones do Leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  busPositions?: BusPosition[];
  selectedLine?: any;
}

export const MapView: React.FC<MapViewProps> = ({ busPositions = [], selectedLine }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Centro padrão: São Paulo
  const defaultCenter: LatLngExpression = [-23.5505, -46.6333];
  const mapCenter = userLocation 
    ? [userLocation.latitude, userLocation.longitude] as LatLngExpression
    : defaultCenter;

  useEffect(() => {
    loadUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadWeatherData();
    }
  }, [userLocation]);

  const loadUserLocation = async () => {
    try {
      const location = await locationApi.getCurrentPosition();
      setUserLocation(location);
    } catch (error) {
      console.log('Usando localização por IP como fallback');
      const fallbackLocation = await locationApi.getLocationByIP();
      setUserLocation(fallbackLocation);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const loadWeatherData = async () => {
    if (!userLocation) return;

    try {
      const weatherData = await weatherApi.getCurrentWeather(
        userLocation.latitude,
        userLocation.longitude
      );
      setWeather(weatherData);
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  return (
    <div className="relative h-full">
      {/* Widget do clima */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-[1000] bg-white rounded-xl shadow-lg p-4"
      >
        {isLoadingWeather ? (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Carregando clima...</span>
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="h-12 w-12"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{weather.cityName}</h3>
                <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-1" />
                  {weather.temperature}°C
                </div>
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-1" />
                  {weather.humidity}%
                </div>
                <div className="flex items-center">
                  <Wind className="h-4 w-4 mr-1" />
                  {weather.windSpeed.toFixed(1)} m/s
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500 py-2">
            Não foi possível carregar o clima
          </div>
        )}
      </motion.div>

      {/* Status da localização */}
      {isLoadingLocation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-4 right-4 z-[1000] bg-blue-600 text-white rounded-xl p-3 flex items-center justify-center"
        >
          <Navigation className="h-5 w-5 mr-2 animate-pulse" />
          <span className="text-sm">Obtendo sua localização...</span>
        </motion.div>
      )}

      {/* Mapa */}
      <div className="h-full">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcador da localização do usuário */}
          {userLocation && (
            <>
              <Marker position={[userLocation.latitude, userLocation.longitude]}>
                <Popup>
                  <div className="text-center">
                    <strong>Sua Localização</strong>
                    <br />
                    <small>Precisão: {userLocation.accuracy.toFixed(0)}m</small>
                  </div>
                </Popup>
              </Marker>
              
              {/* Círculo de precisão */}
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={userLocation.accuracy}
                fillColor="blue"
                fillOpacity={0.1}
                color="blue"
                weight={2}
              />
            </>
          )}

          {/* Marcadores dos ônibus */}
          {busPositions.map((bus) => (
            <Marker
              key={bus.id}
              position={[bus.latitude, bus.longitude]}
            >
              <Popup>
                <div className="text-center">
                  <strong>Ônibus {selectedLine?.name || bus.lineId}</strong>
                  <br />
                  <small>Velocidade: {bus.speed} km/h</small>
                  <br />
                  <small>Última atualização: {new Date(bus.timestamp).toLocaleTimeString()}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
