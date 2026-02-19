import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DestinationsContext } from "../context/DestinationsContext";
import images from "../data/images";

function Compare() {
  const { compareList } = useContext(DestinationsContext);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareList.length < 2) {
      setLoading(false);
      return;
    }
    Promise.all(
      compareList.map(d =>
        fetch(`http://localhost:3001/destinations/${d.id}`)
          .then(r => r.json())
          .then(data => data.destination)
      )
    ).then(results => {
      setDetails(results);
      setLoading(false);
    });
  }, [compareList]);

  if (loading) return <p className="text-center mt-10">Caricamento...</p>;

  if (compareList.length < 2) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center mt-20">
        <p className="text-gray-500 text-lg">Seleziona 2 destinazioni da confrontare.</p>
        <Link to="/destinations" className="text-blue-500 hover:underline mt-4 inline-block">
          ← Torna alla lista
        </Link>
      </div>
    );
  }

  const [a, b] = details;

  const rows = [
    { label: "Categoria", valA: a?.category, valB: b?.category },
    { label: "Clima", valA: a?.climate, valB: b?.climate },
    { label: "Periodo migliore", valA: a?.bestPeriod, valB: b?.bestPeriod },
    { label: "Costo medio/giorno", valA: a?.averageCost ? `€${a.averageCost}` : null, valB: b?.averageCost ? `€${b.averageCost}` : null },
    { label: "Attrazioni", valA: a?.attractions, valB: b?.attractions },
    { label: "Descrizione", valA: a?.description, valB: b?.description },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/destinations" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Torna alla lista
      </Link>

      <h1 className="text-3xl font-bold mb-8">Confronto</h1>

      {/* Header con immagini */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div />
        {[a, b].map((dest) => (
          <div key={dest.id} className="text-center">
            <div className="h-48 rounded-xl overflow-hidden mb-3">
              <img src={images[dest.id]} alt={dest.title} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold">{dest.title}</h2>
          </div>
        ))}
      </div>

      {/* Tabella confronto */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 gap-4 p-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
          >
            <span className="text-gray-500 font-medium">{row.label}</span>
            <span className="text-center">{row.valA || "—"}</span>
            <span className="text-center">{row.valB || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Compare;