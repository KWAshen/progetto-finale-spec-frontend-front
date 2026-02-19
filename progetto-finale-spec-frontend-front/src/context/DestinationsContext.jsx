import { createContext, useState, useEffect } from 'react';

export const DestinationsContext = createContext();

export const DestinationsProvider = ({ children }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareList, setCompareList] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (dest) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === dest.id);
      const updated = exists ? prev.filter(f => f.id !== dest.id) : [...prev, dest];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:3001/destinations');
        const data = await response.json();
        setDestinations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const toggleCompare = (dest) => {
    setCompareList((prev) => {
      if (prev.find((d) => d.id === dest.id)) return prev.filter((d) => d.id !== dest.id);
      if (prev.length >= 2) return prev;
      return [...prev, dest];
    });
  };

  const resetCompare = () => {
    setCompareList([]);
  };

  return (
    <DestinationsContext.Provider value={{ 
      destinations, loading, error, compareList, toggleCompare, resetCompare, favorites, toggleFavorite
    }}>
      {children}
    </DestinationsContext.Provider>
  );
};