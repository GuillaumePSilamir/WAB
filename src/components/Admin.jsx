import React, { useEffect, useState } from 'react';

const Admin = ({ onReturnToGame }) => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'GET',
      headers: {
        'x-api-key': 'SilamirCD2025!'
      }
    })
      .then(res => {
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
        setError(`Erreur de connexion: ${err.message}`);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-600 text-white px-6 py-10 relative">
      <button
        onClick={onReturnToGame}
        className="absolute top-4 left-4 bg-white/10 px-4 py-2 rounded-md text-sm hover:bg-white/20"
      >
        ← Retour au jeu
      </button>

      <h2 className="text-4xl font-bold text-center mb-10">🏆 Podium & Scores</h2>

      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      {scores.length >= 3 && (
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="text-5xl">🥈</div>
            <div className="text-lg font-medium mt-2">{scores[1]?.name}</div>
            <div className="text-sm opacity-80">{scores[1]?.score} pts</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-6xl">🥇</div>
            <div className="text-xl font-bold mt-2">{scores[0]?.name}</div>
            <div className="text-base font-bold">{scores[0]?.score} pts</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl">🥉</div>
            <div className="text-lg font-medium mt-2">{scores[2]?.name}</div>
            <div className="text-sm opacity-80">{scores[2]?.score} pts</div>
          </div>
        </div>
      )}

      {scores.length === 0 ? (
        <p className="text-center text-lg">Aucun score enregistré.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-white/20 text-sm">
            <thead className="bg-white/10 text-left">
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
        </div>
      )}
    </div>
  );
};

export default Admin;
