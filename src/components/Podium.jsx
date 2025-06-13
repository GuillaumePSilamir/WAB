import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js'; // à ajuster selon votre structure

function Podium() {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'GET',  
      headers: { 'x-api-key': 'SilamirCD2025!'}
    })
      .then(res => res.json())
      .then(data => setHighScores(data.sort((a, b) => b.score - a.score)))
      .catch(err => console.error("Erreur chargement scores :", err));
  }, []);

  return (
    <div>
      {/* Affichage des scores */}
      {highScores.map(score => (
        <div key={score.id}>{score.name}: {score.score}</div>
      ))}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

function Podium() {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'GET',  
      headers: { 'x-api-key': 'SilamirCD2025!'}
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
          <div key={score.id}>{score.name}: {score.score} points</div>
        ))
      ) : (
        <p>Chargement des scores...</p>
      )}
    </div>
  );
}

export default Podium; // ← Ajoutez cette ligne