import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  MapPin, 
  Palette, 
  Shield, 
  HelpCircle, 
  Info,
  ChevronRight,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { storageService } from '../services/storage';
import { apiStatus } from '../services/api';

export const SettingsView: React.FC = () => {
  const [preferences, setPreferences] = useState(storageService.getUserPreferences());
  const apisStatus = apiStatus.checkAPIsStatus();

  const updatePreference = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    storageService.saveUserPreferences(newPreferences);
  };

  const getStatusIcon = (isConfigured: boolean) => {
    return isConfigured ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusText = (isConfigured: boolean) => {
    return isConfigured ? 'Configurada' : 'Não configurada';
  };

  const settingsSections = [
    {
      title: 'Status das APIs',
      items: [
        {
          icon: Key,
          label: 'SPTrans API',
          description: getStatusText(apisStatus.sptrans),
          type: 'status',
          status: apisStatus.sptrans
        },
        {
          icon: Key,
          label: 'OpenWeatherMap API',
          description: getStatusText(apisStatus.weather),
          type: 'status',
          status: apisStatus.weather
        },
        {
          icon: Key,
          label: 'IPify API',
          description: getStatusText(apisStatus.ipify),
          type: 'status',
          status: apisStatus.ipify
        }
      ]
    },
    {
      title: 'Preferências',
      items: [
        {
          icon: Bell,
          label: 'Notificações',
          description: 'Receber alertas sobre os ônibus',
          type: 'toggle',
          key: 'notifications',
          value: preferences.notifications
        },
        {
          icon: MapPin,
          label: 'Localização Automática',
          description: 'Detectar automaticamente sua localização',
          type: 'toggle',
          key: 'autoLocation',
          value: preferences.autoLocation
        },
        {
          icon: Palette,
          label: 'Tema',
          description: 'Aparência do aplicativo',
          type: 'select',
          key: 'theme',
          value: preferences.theme,
          options: [
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Escuro' },
            { value: 'auto', label: 'Automático' }
          ]
        }
      ]
    },
    {
      title: 'Sobre',
      items: [
        {
          icon: Shield,
          label: 'Privacidade',
          description: 'Política de privacidade',
          type: 'link'
        },
        {
          icon: HelpCircle,
          label: 'Ajuda',
          description: 'Central de ajuda e suporte',
          type: 'link'
        },
        {
          icon: Info,
          label: 'Sobre o OndBus',
          description: 'Versão 1.0.0',
          type: 'link'
        }
      ]
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Settings className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-600">Personalize sua experiência</p>
      </motion.div>

      {/* Alerta sobre modo demo */}
      {apisStatus.demoMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Modo Demonstração Ativo</h3>
              <p className="text-sm text-yellow-700 mb-3">
                O app está usando dados simulados. Para ter acesso aos dados reais de ônibus e clima, 
                configure suas chaves de API no arquivo .env:
              </p>
              <div className="bg-yellow-100 rounded-lg p-3 font-mono text-xs text-yellow-800">
                <div>VITE_SPTRANS_TOKEN=sua_chave_sptrans</div>
                <div>VITE_OPENWEATHER_API_KEY=sua_chave_openweather</div>
                <div>VITE_IPIFY_API_KEY=sua_chave_ipify</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {settingsSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {section.title}
          </h2>

          <div className="space-y-2">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * section.items.length + itemIndex) * 0.05 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full p-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.label}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.type === 'status' && (
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status!)}
                          <span className={`text-sm ${item.status ? 'text-green-600' : 'text-red-600'}`}>
                            {item.status ? 'OK' : 'Pendente'}
                          </span>
                        </div>
                      )}

                      {item.type === 'toggle' && (
                        <motion.button
                          onClick={() => updatePreference(item.key!, !item.value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                            layout
                          />
                        </motion.button>
                      )}

                      {item.type === 'select' && (
                        <select
                          value={item.value}
                          onChange={(e) => updatePreference(item.key!, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                        >
                          {item.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {item.type === 'link' && (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Informações do app */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center"
      >
        <h3 className="text-lg font-semibold mb-2">OndBus</h3>
        <p className="text-sm opacity-90 mb-4">
          Encontre ônibus em tempo real em São Paulo
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <div>
            <p className="font-medium">APIs</p>
            <p className="opacity-80">SPTrans • OpenWeather</p>
          </div>
          <div>
            <p className="font-medium">Versão</p>
            <p className="opacity-80">1.0.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
