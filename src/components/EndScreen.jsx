import React from 'react';

const EndScreen = ({
  score,
  highScores,
  newRecord,
  performanceMessage,
  playerName,
  playerEmail,
  setPlayerName,
  setPlayerEmail,
  saveHighScore,
  onRestart
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur p-8 rounded-2xl text-white shadow-xl">
      <h2 className="text-4xl font-bold text-center mb-6">🎮 Partie terminée</h2>

      <div className="text-2xl text-center mb-4">
        <span className="text-yellow-400 font-extrabold">Votre score : {score}</span>
      </div>

      {performanceMessage && (
        <div className={`text-center mb-6 ${performanceMessage.className}`}>
          {performanceMessage.message}
        </div>
      )}

      {newRecord && (
        <div className="text-center text-yellow-400 font-bold text-lg mb-6">
          🎉 Nouveau record personnel !
        </div>
      )}

      {/* Formulaire d'enregistrement */}
      <div className="bg-white/10 p-6 rounded-xl mb-8">
        <h3 className="text-xl font-semibold mb-4">📋 Enregistrer votre score</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Nom du joueur"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            className="px-4 py-2 rounded-lg text-black flex-1"
          />
          <input
            type="email"
            placeholder="Email (optionnel)"
            value={playerEmail}
            onChange={(e) => setPlayerEmail(e.target.value)}
            className="px-4 py-2 rounded-lg text-black flex-1"
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={saveHighScore}
            className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Enregistrer
          </button>
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Rejouer
          </button>
        </div>
      </div>

      {/* Top 10 */}
      <div className="bg-white/5 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-center">🏆 Top 10 des scores</h3>
        <div className="space-y-3">
          {highScores.slice(0, 10).map((entry, index) => (
            <div
              key={entry.id}
              className="bg-white/10 p-3 rounded-lg flex items-center gap-3"
            >
              <span className={`text-2xl ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : ''}`}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
              </span>
              <span className="font-semibold">
                {entry.name} – {entry.score} pts <span className="text-sm opacity-70">({entry.date})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
