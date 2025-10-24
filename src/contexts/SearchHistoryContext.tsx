import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
  category?: string;
  type: 'medicine' | 'pharmacy' | 'location';
}

export interface PopularSearch {
  query: string;
  count: number;
  category?: string;
  type: 'medicine' | 'pharmacy' | 'location';
}

interface SearchHistoryContextType {
  searchHistory: SearchHistoryItem[];
  popularSearches: PopularSearch[];
  addSearch: (query: string, resultCount?: number, category?: string, type?: 'medicine' | 'pharmacy' | 'location') => void;
  clearHistory: () => void;
  removeSearch: (id: string) => void;
  getRecentSearches: (limit?: number) => SearchHistoryItem[];
  getPopularSearches: (limit?: number) => PopularSearch[];
  clearOldSearches: (daysOld?: number) => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined);

interface SearchHistoryProviderProps {
  children: ReactNode;
}

export const SearchHistoryProvider: React.FC<SearchHistoryProviderProps> = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('medicine-tracker-search-history');
    const savedPopular = localStorage.getItem('medicine-tracker-popular-searches');
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(parsed);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }

    if (savedPopular) {
      try {
        const parsed = JSON.parse(savedPopular);
        setPopularSearches(parsed);
      } catch (error) {
        console.error('Error loading popular searches:', error);
      }
    } else {
      // Initialize with default popular searches
      const defaultPopular: PopularSearch[] = [
        { query: 'Paracetamol 500mg', count: 1250, category: 'pain-relief', type: 'medicine' },
        { query: 'Ibuprofen 400mg', count: 980, category: 'pain-relief', type: 'medicine' },
        { query: 'Amoxicillin 500mg', count: 750, category: 'antibiotics', type: 'medicine' },
        { query: 'CVS Pharmacy', count: 650, type: 'pharmacy' },
        { query: 'Walgreens', count: 580, type: 'pharmacy' },
        { query: 'Nearby Pharmacies', count: 420, type: 'location' },
        { query: 'Aspirin 75mg', count: 380, category: 'cardiovascular', type: 'medicine' },
        { query: 'Metformin 500mg', count: 320, category: 'diabetes', type: 'medicine' },
        { query: 'Omeprazole 20mg', count: 280, category: 'digestive', type: 'medicine' },
        { query: '24/7 Pharmacy', count: 250, type: 'pharmacy' }
      ];
      setPopularSearches(defaultPopular);
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medicine-tracker-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Save popular searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medicine-tracker-popular-searches', JSON.stringify(popularSearches));
  }, [popularSearches]);

  const addSearch = (
    query: string, 
    resultCount?: number, 
    category?: string, 
    type: 'medicine' | 'pharmacy' | 'location' = 'medicine'
  ) => {
    const newSearch: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      query: query.trim(),
      timestamp: Date.now(),
      resultCount,
      category,
      type
    };

    setSearchHistory(prev => {
      // Remove any existing search with the same query to avoid duplicates
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      // Add new search at the beginning
      return [newSearch, ...filtered].slice(0, 50); // Keep only last 50 searches
    });

    // Update popular searches
    setPopularSearches(prev => {
      const existing = prev.find(item => item.query.toLowerCase() === query.toLowerCase());
      if (existing) {
        return prev.map(item => 
          item.query.toLowerCase() === query.toLowerCase() 
            ? { ...item, count: item.count + 1 }
            : item
        );
      } else {
        return [
          { query: query.trim(), count: 1, category, type },
          ...prev
        ].slice(0, 20); // Keep only top 20 popular searches
      }
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('medicine-tracker-search-history');
  };

  const removeSearch = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const getRecentSearches = (limit: number = 10) => {
    return searchHistory.slice(0, limit);
  };

  const getPopularSearches = (limit: number = 10) => {
    return popularSearches
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const clearOldSearches = (daysOld: number = 30) => {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    setSearchHistory(prev => prev.filter(item => item.timestamp > cutoffTime));
  };

  const value: SearchHistoryContextType = {
    searchHistory,
    popularSearches,
    addSearch,
    clearHistory,
    removeSearch,
    getRecentSearches,
    getPopularSearches,
    clearOldSearches
  };

  return (
    <SearchHistoryContext.Provider value={value}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

export const useSearchHistory = (): SearchHistoryContextType => {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  }
  return context;
};
