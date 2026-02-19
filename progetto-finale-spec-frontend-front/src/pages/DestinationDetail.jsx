import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, HeartCrack, ArrowLeft, MapPin, Thermometer, Calendar, DollarSign, Star } from "lucide-react";
import { DestinationsContext } from "../context/DestinationsContext";
import images from "../data/images";
import toast from "react-hot-toast";

function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(DestinationsContext);
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/destinations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDest(data.destination);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Caricamento...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Errore: {error}</p>;
  if (!dest) return <p className="text-center mt-10">Destinazione non trovata.</p>;

  const isFav = favorites.find(f => f.id === dest.id);

  const handleFavorite = () => {
    toggleFavorite(dest);
    toast(isFav ? `${dest.title} rimosso dai preferiti` : `${dest.title} aggiunto ai preferiti`, {
      icon: isFav ? <HeartCrack className="text-red-400" /> : <Heart className="fill-red-500 text-red-500" />,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      
      {/* Torna indietro */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
        <span className="text-sm font-medium">Torna indietro</span>
      </button>

      {/* Immagine hero */}
      <div className="relative h-72 rounded-2xl overflow-hidden mb-6 shadow-md">
        <img
          src={images[dest.id]}
          alt={dest.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white">{dest.title}</h1>
            <span className="flex items-center gap-1 text-white/80 text-sm mt-1">
              <MapPin size={14} />
              {dest.category}
            </span>
          </div>
          <button
            onClick={handleFavorite}
            className="bg-white rounded-full p-2.5 shadow-lg hover:scale-110 transition"
          >
            <Heart
              size={22}
              className={isFav ? "fill-red-500 text-red-500" : "text-red-400"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Dettagli */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {dest.description && (
          <div className="p-5 border-b border-gray-100">
            <p className="text-gray-600 leading-relaxed">{dest.description}</p>
          </div>
        )}

        {dest.climate && (
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
              <Thermometer size={16} />
              <span className="text-sm font-medium">Clima</span>
            </div>
            <span className="text-sm font-semibold">{dest.climate}</span>
          </div>
        )}

        {dest.bestPeriod && (
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={16} />
              <span className="text-sm font-medium">Periodo migliore</span>
            </div>
            <span className="text-sm font-semibold">{dest.bestPeriod}</span>
          </div>
        )}

        {dest.averageCost && (
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
              <DollarSign size={16} />
              <span className="text-sm font-medium">Costo medio/giorno</span>
            </div>
            <span className="text-sm font-semibold text-green-600">€{dest.averageCost}</span>
          </div>
        )}

        {dest.attractions && (
          <div className="flex justify-between items-center px-5 py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Star size={16} />
              <span className="text-sm font-medium">Attrazioni</span>
            </div>
            <span className="text-sm font-semibold">{dest.attractions}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DestinationDetail;