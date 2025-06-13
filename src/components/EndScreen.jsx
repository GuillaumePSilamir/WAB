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
    <div className="bg-white/10 p-10 rounded-2xl backdrop-blur max-w-2xl mx-auto text-white">
      <h2 className="text-2xl mb-5">Partie terminée !</h2>
      <div className="text-3xl text-yellow-500 mb-5">Score: {score}</div>

      <div className={performanceMessage.className}>{performanceMessage.message}</div>

      {newRecord && (
        <div className="text-yellow-500 text-xl mb-5">
          🎉 Nouveau record personnel !
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl mb-4">Enregistrer votre score</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nom du joueur"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            className="px-4 py-2 rounded-lg text-black w-48 mx-2"
          />
          <br />
          <input
            type="email"
            placeholder="Email (optionnel)"
            value={playerEmail}
            onChange={(e) => setPlayerEmail(e.target.value)}
            className="px-4 py-2 rounded-lg text-black w-48 mx-2"
          />
        </div>
        <div className="mt-5 space-x-3">
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

      <div className="bg-white/10 p-5 rounded-xl">
        <h3 className="text-xl mb-4">🏆 Meilleurs scores</h3>
        <div className="space-y-2">
          {highScores.slice(0, 10).map((scoreEntry, index) => (
            <div
              key={scoreEntry.id}
              className="p-3 bg-white/10 rounded-lg"
            >
              <span className={`font-bold flex items-center gap-2 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : ''}`}>
  <span className="text-2xl">
    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
  </span>
  {index + 1}. {scoreEntry.name} – {scoreEntry.score} pts ({scoreEntry.date})
</span>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
