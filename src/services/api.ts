import axios from 'axios';
import { BusStop, BusLine, BusPosition, WeatherData, UserLocation } from '../types';

const SPTRANS_BASE_URL = 'https://api.olhovivo.sptrans.com.br/v2.1';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const IPIFY_BASE_URL = 'https://geo.ipify.org/api/v2';

// Verificar se as APIs estão configuradas
const isApiConfigured = (apiKey: string) => {
  return apiKey && apiKey !== 'YOUR_API_KEY' && !apiKey.includes('*');
};

// Dados mock para demonstração
const mockBusLines: BusLine[] = [
  {
    id: '4110',
    name: '4110-10 - Vila Prudente / Cidade Tiradentes',
    direction: 'Ida',
    color: '#1E40AF',
    stops: []
  },
  {
    id: '701A',
    name: '701A-10 - Terminal Barra Funda / Santana',
    direction: 'Ida',
    color: '#DC2626',
    stops: []
  },
  {
    id: '5119',
    name: '5119-10 - Terminal Santo Amaro / Cidade Ademar',
    direction: 'Ida',
    color: '#059669',
    stops: []
  },
  {
    id: '809P',
    name: '809P-10 - Metrô Vila Madalena / Vila Leopoldina',
    direction: 'Ida',
    color: '#7C3AED',
    stops: []
  },
  {
    id: '2024',
    name: '2024-10 - Metrô República / Terminal Princesa Isabel',
    direction: 'Ida',
    color: '#EA580C',
    stops: []
  }
];

const mockBusPositions: BusPosition[] = [
  {
    id: '1',
    lineId: '4110',
    latitude: -23.5505 + (Math.random() - 0.5) * 0.02,
    longitude: -46.6333 + (Math.random() - 0.5) * 0.02,
    speed: Math.floor(Math.random() * 60),
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    lineId: '4110',
    latitude: -23.5505 + (Math.random() - 0.5) * 0.02,
    longitude: -46.6333 + (Math.random() - 0.5) * 0.02,
    speed: Math.floor(Math.random() * 60),
    timestamp: new Date().toISOString()
  },
  {
    id: '3',
    lineId: '4110',
    latitude: -23.5505 + (Math.random() - 0.5) * 0.02,
    longitude: -46.6333 + (Math.random() - 0.5) * 0.02,
    speed: Math.floor(Math.random() * 60),
    timestamp: new Date().toISOString()
  }
];

// SPTrans API
export const sptransApi = {
  async authenticate() {
    const token = import.meta.env.VITE_SPTRANS_TOKEN;
    
    if (!isApiConfigured(token)) {
      console.log('⚠️ SPTrans em modo demonstração - Adicione sua chave API para dados reais');
      return { success: true, demo: true };
    }

    try {
      const response = await axios.post(`${SPTRANS_BASE_URL}/Login/Autenticar`, {
        token: token
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      return { success: true, demo: false, data: response.data };
    } catch (error) {
      console.warn('Erro ao autenticar SPTrans, usando modo demonstração:', error);
      return { success: true, demo: true };
    }
  },

  async searchLines(term: string): Promise<BusLine[]> {
    const token = import.meta.env.VITE_SPTRANS_TOKEN;
    
    if (!isApiConfigured(token)) {
      // Simular busca com dados mock
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular latência
      
      const filtered = mockBusLines.filter(line => 
        line.name.toLowerCase().includes(term.toLowerCase()) ||
        line.id.includes(term)
      );
      
      return filtered.length > 0 ? filtered : mockBusLines.slice(0, 3);
    }

    try {
      const response = await axios.get(`${SPTRANS_BASE_URL}/Linha/Buscar`, {
        params: { termosBusca: term },
        timeout: 10000
      });
      
      return response.data.map((line: any) => ({
        id: line.cl.toString(),
        name: `${line.tp} - ${line.nm}`,
        direction: line.ts,
        color: line.cl % 2 === 0 ? '#1E40AF' : '#DC2626',
        stops: []
      }));
    } catch (error) {
      console.warn('Erro ao buscar linhas, usando dados demo:', error);
      return mockBusLines.slice(0, 3);
    }
  },

  async getStopsByLine(lineId: string): Promise<BusStop[]> {
    const token = import.meta.env.VITE_SPTRANS_TOKEN;
    
    if (!isApiConfigured(token)) {
      // Retornar paradas mock
      return [
        {
          id: '1',
          name: 'Terminal Vila Prudente',
          latitude: -23.5505,
          longitude: -46.6333,
          lines: [lineId]
        },
        {
          id: '2',
          name: 'Estação Vila Prudente',
          latitude: -23.5515,
          longitude: -46.6343,
          lines: [lineId]
        }
      ];
    }

    try {
      const response = await axios.get(`${SPTRANS_BASE_URL}/Parada/BuscarParadasPorLinha`, {
        params: { codigoLinha: lineId },
        timeout: 10000
      });
      
      return response.data.map((stop: any) => ({
        id: stop.cp.toString(),
        name: stop.np,
        latitude: stop.py,
        longitude: stop.px,
        lines: [lineId]
      }));
    } catch (error) {
      console.warn('Erro ao buscar paradas, usando dados demo:', error);
      return [];
    }
  },

  async getBusPositions(lineId: string): Promise<BusPosition[]> {
    const token = import.meta.env.VITE_SPTRANS_TOKEN;
    
    if (!isApiConfigured(token)) {
      // Simular posições de ônibus com movimento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockBusPositions.map(bus => ({
        ...bus,
        lineId,
        latitude: -23.5505 + (Math.random() - 0.5) * 0.03,
        longitude: -46.6333 + (Math.random() - 0.5) * 0.03,
        speed: Math.floor(Math.random() * 60),
        timestamp: new Date().toISOString()
      }));
    }

    try {
      const response = await axios.get(`${SPTRANS_BASE_URL}/Posicao/Linha`, {
        params: { codigoLinha: lineId },
        timeout: 10000
      });
      
      return response.data?.vs?.map((bus: any) => ({
        id: bus.p.toString(),
        lineId: lineId,
        latitude: bus.py,
        longitude: bus.px,
        speed: bus.v || 0,
        timestamp: bus.ta
      })) || [];
    } catch (error) {
      console.warn('Erro ao buscar posições dos ônibus, usando dados demo:', error);
      return mockBusPositions.map(bus => ({ ...bus, lineId }));
    }
  }
};

// OpenWeatherMap API
export const weatherApi = {
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    
    if (!isApiConfigured(apiKey)) {
      // Retornar dados de clima simulados
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockWeather = {
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        description: ['ensolarado', 'parcialmente nublado', 'nublado', 'chuva leve'][Math.floor(Math.random() * 4)],
        icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.random() * 10 + 2, // 2-12 m/s
        cityName: 'São Paulo'
      };
      
      return mockWeather;
    }

    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
          lang: 'pt_br'
        },
        timeout: 10000
      });

      return {
        temperature: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        cityName: response.data.name
      };
    } catch (error) {
      console.warn('Erro ao buscar dados do clima, usando dados demo:', error);
      return {
        temperature: 25,
        description: 'ensolarado',
        icon: '01d',
        humidity: 65,
        windSpeed: 3.5,
        cityName: 'São Paulo'
      };
    }
  }
};

// Geolocalização
export const locationApi = {
  async getCurrentPosition(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn('Erro ao obter localização GPS:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  },

  async getLocationByIP(): Promise<UserLocation> {
    const apiKey = import.meta.env.VITE_IPIFY_API_KEY;
    
    if (!isApiConfigured(apiKey)) {
      // Retorna coordenadas do centro de SP como fallback
      return {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 1000
      };
    }

    try {
      const response = await axios.get(`${IPIFY_BASE_URL}/country,city`, {
        params: {
          apiKey: apiKey
        },
        timeout: 10000
      });

      // Para São Paulo como fallback se não conseguir dados específicos
      return {
        latitude: response.data.location?.lat || -23.5505,
        longitude: response.data.location?.lng || -46.6333,
        accuracy: 1000
      };
    } catch (error) {
      console.warn('Erro ao obter localização por IP, usando SP centro:', error);
      return {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 1000
      };
    }
  }
};

// Função para verificar status das APIs
export const apiStatus = {
  checkAPIsStatus() {
    const sptransConfigured = isApiConfigured(import.meta.env.VITE_SPTRANS_TOKEN);
    const weatherConfigured = isApiConfigured(import.meta.env.VITE_OPENWEATHER_API_KEY);
    const ipifyConfigured = isApiConfigured(import.meta.env.VITE_IPIFY_API_KEY);
    
    return {
      sptrans: sptransConfigured,
      weather: weatherConfigured,
      ipify: ipifyConfigured,
      allConfigured: sptransConfigured && weatherConfigured,
      demoMode: !sptransConfigured || !weatherConfigured
    };
  }
};
