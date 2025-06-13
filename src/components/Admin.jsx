import React, { useEffect, useState } from 'react';

const Admin = ({ onReturnToGame }) => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Tentative de connexion au backend...');
    fetch('https://whac-a-bottleneck-backend.onrender.com/scores', {
      method: 'GET',
      headers: {
        'x-api-key': 'SilamirCD2025!'
      }
    })
      .then(res => {
        console.log('Réponse reçue:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        const sorted = data.sort((a, b) => b.score - a.score);
        setScores(sorted);
      })
      .catch(err => {
        console.error('Erreur complète:', err);
        setError(`Erreur de connexion: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-8 text-white">
      <div className="absolute top-4 left-4">
        <button
          onClick={onReturnToGame}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700"
        >
          Retour au jeu
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-center">🏆 Podium & Scores</h2>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {scores.length >= 3 && (
        <div className="flex justify-center gap-12 mb-12">
          <div className="text-center">
            <div className="text-5xl text-silver">🥈</div>
            <div>{scores[1]?.name}</div>
            <div>{scores[1]?.score} pts</div>
          </div>
          <div className="text-center">
            <div className="text-6xl text-gold">🥇</div>
            <div className="font-bold">{scores[0]?.name}</div>
            <div className="font-bold">{scores[0]?.score} pts</div>
          </div>
          <div className="text-center">
            <div className="text-5xl text-[#cd7f32]">🥉</div>
            <div>{scores[2]?.name}</div>
            <div>{scores[2]?.score} pts</div>
          </div>
        </div>
      )}

      {scores.length === 0 ? (
        <p className="text-center">Aucun score enregistré.</p>
      ) : (
        <table className="table-auto w-full text-white text-left border border-white/20">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Score</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, idx) => (
              <tr key={idx} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.email}</td>
                <td className="p-3">{entry.score}</td>
                <td className="p-3">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
