import { Route } from '../types';

export const storageService = {
  // Rotas favoritas
  getFavoriteRoutes(): Route[] {
    try {
      const routes = localStorage.getItem('ondbus_favorite_routes');
      return routes ? JSON.parse(routes) : [];
    } catch {
      return [];
    }
  },

  saveFavoriteRoute(route: Route): void {
    const routes = this.getFavoriteRoutes();
    const exists = routes.find(r => r.id === route.id);
    
    if (!exists) {
      routes.push(route);
      localStorage.setItem('ondbus_favorite_routes', JSON.stringify(routes));
    }
  },

  removeFavoriteRoute(routeId: string): void {
    const routes = this.getFavoriteRoutes().filter(r => r.id !== routeId);
    localStorage.setItem('ondbus_favorite_routes', JSON.stringify(routes));
  },

  // Histórico de buscas
  getSearchHistory(): string[] {
    try {
      const history = localStorage.getItem('ondbus_search_history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  },

  addToSearchHistory(term: string): void {
    const history = this.getSearchHistory();
    const filtered = history.filter(h => h !== term);
    filtered.unshift(term);
    
    // Manter apenas os 10 mais recentes
    const limited = filtered.slice(0, 10);
    localStorage.setItem('ondbus_search_history', JSON.stringify(limited));
  },

  // Configurações do usuário
  getUserPreferences() {
    try {
      const prefs = localStorage.getItem('ondbus_preferences');
      return prefs ? JSON.parse(prefs) : {
        notifications: true,
        autoLocation: true,
        theme: 'light'
      };
    } catch {
      return {
        notifications: true,
        autoLocation: true,
        theme: 'light'
      };
    }
  },

  saveUserPreferences(preferences: any): void {
    localStorage.setItem('ondbus_preferences', JSON.stringify(preferences));
  }
};
