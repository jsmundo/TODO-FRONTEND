import { useEffect, useContext, useState, useRef } from "react";
import { Context } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import "../Learn.css";
export default function Learn() {
  const { store, actions } = useContext(Context);

  /* ---------------- estado global ---------------- */
  const learnBatch = store?.learnBatch || [];
  const learnIndex = store?.learnIndex || 0;

  /* ---------------- estado local ----------------- */
  const [batchSize, setBatchSize] = useState(20); // ← selector
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* --------- guardamos actions en un ref ---------- */
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions; // mantiene la referencia estable
  }, [actions]);

  /* --------------- cargar lote -------------------- */
  useEffect(() => {
    const fetchBatch = async () => {
      setLoading(true);
      setError(null);
      try {
        await actionsRef.current.getSentencesBatch(batchSize);
      } catch {
        setError("❌ No se pudieron cargar las frases.");
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [batchSize]); // ← solo cambia cuando el user elige

  /* ---------------- handlers ---------------------- */
  const handleAnswer = async (quality) => {
    const current = learnBatch[learnIndex];
    if (current) await actionsRef.current.sendAnswer(current.id, quality);
  };

  const handleRestart = () => actionsRef.current.getSentencesBatch(batchSize);

  /* --------------- pantallas auxiliares ----------- */
  if (loading) return <p className="text-center">⏳ Cargando frases...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  if (!learnBatch.length || learnIndex >= learnBatch.length) {
    return (
      <div className="learn-container text-center">
        <p className="mb-4">✅ ¡Revisión completada!</p>

        {/* selector para la próxima tanda */}
        <label className="block mb-3">
          Cantidad:&nbsp;
          <select
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <button className="btn" onClick={handleRestart}>
          🔁 Volver a empezar
        </button>
      </div>
    );
  }

  /* ---------------- flash-card actual -------------- */
  const current = learnBatch[learnIndex];

  return (
    <div className="learn">
      {/* selector visible durante la sesión */}
      <div className="learn__toolbar">
        <select
          value={batchSize}
          onChange={(e) => setBatchSize(Number(e.target.value))}
          className="learn__select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flashcard"
        >
          <h2 className="flashcard__en">🇬🇧 {current.text_en}</h2>
          <h3 className="flashcard__es">🇪🇸 {current.text_es}</h3>

          {current.audio_url && (
            <audio
              className="flashcard__audio"
              controls
              src={current.audio_url}
            />
          )}

          <div className="flashcard__buttons">
            <button className="btn btn--hard" onClick={() => handleAnswer(0)}>
              🙈 Difícil
            </button>
            <button className="btn btn--normal" onClick={() => handleAnswer(3)}>
              😐 Normal
            </button>
            <button className="btn btn--easy" onClick={() => handleAnswer(5)}>
              😄 Fácil
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
