import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js'; // ← garde ce chemin si c’est correct

function Podium() {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'GET',
      headers: {
        'x-api-key': 'SilamirCD2025!' // ← ou 'Authorization': `Bearer ${API_KEY}` si ton backend attend ça
      }
    })
      .then(res => res.json())
      .then(data => setHighScores(data.sort((a, b) => b.score - a.score)))
      .catch(err => console.error("Erreur chargement scores :", err));
  }, []);

  return (
    <div>
      <h2>🏆 Podium & Scores</h2>
      {highScores.length > 0 ? (
        highScores.map(score => (
          <div key={score.id}>
            {score.name}: {score.score} points
          </div>
        ))
      ) : (
        <p>Chargement des scores...</p>
      )}
    </div>
  );
}

export default Podium;
