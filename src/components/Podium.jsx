import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js'; // ← chemin correct depuis src/components vers src/config.js

function Podium() {
  const [highScores, setHighScores] = useState([]);
  const [error, setError] = useState(null); // pour afficher les erreurs éventuelles
  const [loading, setLoading] = useState(true); // pour gérer l'affichage en cours de chargement

  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'GET',
      headers: {
        'x-api-key': 'SilamirCD2025!' // ← ou 'Authorization': `Bearer ${API_KEY}` selon ton backend
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const sortedScores = data.sort((a, b) => b.score - a.score);
          setHighScores(sortedScores);
        } else {
          throw new Error("Format de réponse inattendu");
        }
      })
      .catch(err => {
        console.error("Erreur lors du chargement des scores :", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">🏆 Podium & Scores</h2>

      {loading ? (
        <p className="text-gray-500">Chargement des scores...</p>
      ) : error ? (
        <p className="text-red-600">Erreur : {error}</p>
      ) : highScores.length > 0 ? (
        <ul className="space-y-2">
          {highScores.map((score, index) => (
            <li
              key={score.id || index}
              className="bg-white shadow rounded p-2 flex justify-between"
            >
              <span>{index + 1}. {score.name}</span>
              <span className="font-semibold">{score.score} pts</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucun score disponible.</p>
      )}
    </div>
  );
}

export default Podium;
