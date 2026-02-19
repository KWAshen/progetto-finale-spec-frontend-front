import { useContext, useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DestinationsContext } from "../context/DestinationsContext";
import { Scale, Heart, HeartCrack, Search } from "lucide-react";
import images from "../data/images";
import toast from "react-hot-toast";

function Destinations() {
  const { destinations, loading, error, compareList, toggleCompare, resetCompare, favorites, toggleFavorite } = useContext(DestinationsContext);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState("asc");
  const [compareMode, setCompareMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showFavOnly, setShowFavOnly] = useState(false);

const filteredDestinations = useMemo(() => {
  let result = [...destinations];
  if (search) result = result.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  if (category) result = result.filter(d => d.category === category);
  if (showFavOnly) result = result.filter(d => favorites.find(f => f.id === d.id));
  result.sort((a, b) => order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
  return result;
}, [destinations, search, category, order, showFavOnly, favorites]);

  useEffect(() => {
    setCompareMode(false);
    resetCompare();
  }, [location.pathname]);

  if (loading) return <p className="text-center mt-10">Caricamento...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Errore: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 pb-32">
      <h1 className="text-5xl font-bold mb-6">Destinazioni</h1>
  

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-8">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca destinazione..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Tutte le categorie</option>
            {[...new Set(destinations.map(d => d.category))].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>

          <div className="h-8 w-px bg-gray-200" />
          <button
            onClick={() => setShowFavOnly(!showFavOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              showFavOnly ? "bg-red-500 text-white shadow-md" : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart size={16} className={showFavOnly ? "fill-white text-white" : "text-gray-400"} />
            Preferiti
          </button>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              compareMode ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Scale size={16} />
            {compareMode ? `Confronta (${compareList.length}/2)` : "Confronta"}
          </button>
        </div>
      </div>

      {compareMode && (
        <p className="text-sm text-blue-600 mb-4">Seleziona 2 destinazioni cliccando sulle card</p>
      )}

      {filteredDestinations.length === 0 ? (
        <p className="text-gray-500">Nessuna destinazione trovata</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((d) => {
            const isSelected = compareList.find((c) => c.id === d.id);
            const isDisabled = compareMode && !isSelected && compareList.length >= 2;
            const isFav = favorites.find(f => f.id === d.id);

            const heartButton = (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(d);
                  toast(isFav ? `${d.title} rimosso dai preferiti` : `${d.title} aggiunto ai preferiti`, {
                    icon: isFav ? <HeartCrack className="text-red-400" /> : <Heart className="fill-red-500 text-red-500" />,
                  });
                }}
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow hover:scale-110 transition"
              >
                <Heart
                  size={20}
                  className={isFav ? "fill-red-500 text-red-500" : "text-red-400"}
                  strokeWidth={2}
                />
              </button>
            );

            return compareMode ? (
              <div
                key={d.id}
                onClick={() => !isDisabled && toggleCompare(d)}
                className={`relative border-2 rounded-xl overflow-hidden shadow-sm transition cursor-pointer ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : isDisabled
                    ? "border-gray-200 cursor-not-allowed"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  <img src={images[d.id]} alt={d.title} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
                      {compareList.findIndex(c => c.id === d.id) + 1}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{d.title}</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{d.category}</span>
                </div>
              </div>
            ) : (
              <Link
                key={d.id}
                to={`/destinations/${d.id}`}
                className="relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                {heartButton}
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img src={images[d.id]} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{d.title}</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{d.category}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {compareMode && compareList.length === 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-2xl">
          <span className="font-medium">{compareList[0].title} vs {compareList[1].title}</span>
          <button
            onClick={() => navigate("/compare")}
            className="bg-white text-blue-600 font-bold px-6 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Confronta →
          </button>
        </div>
      )}
    </div>
  );
}

export default Destinations;