import React from 'react';

const StartScreen = ({
  passwordInput,
  setPasswordInput,
  passwordValidated,
  validatePassword,
  startGame
}) => {
  return (
    <div className="bg-white/10 p-10 rounded-2xl backdrop-blur-xl max-w-5xl mx-auto text-center text-white shadow-lg animate-fade-in">
      {!passwordValidated ? (
        <>
          <h2 className="text-4xl font-bold mb-4">🔐 Accès protégé</h2>
          <p className="text-xl mb-6">
            Entrez le mot de passe pour accéder à la mission :
          </p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="px-6 py-3 rounded-lg text-black text-center text-xl w-80 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Mot de passe"
          />
          <div className="mt-6">
            <button
              onClick={validatePassword}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-md"
            >
              Valider
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-5xl font-bold mb-6">🎯 Règles du jeu</h2>
          <p className="text-2xl mb-10 leading-relaxed">
            Tapez sur les <strong className="text-yellow-400">déficiences</strong> (+15 pts) et évitez les <strong className="text-green-300">bénéfices</strong> (-5 pts).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left text-xl leading-relaxed mb-10">
            <div>
              <h3 className="text-2xl font-bold mb-2">🚫 Déficiences à éliminer :</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>🧾 Paperasse</li>
                <li>🤯 Surcharge mentale</li>
                <li>🔄 Redondance / bugs</li>
                <li>🐢 Lenteurs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">✅ Bénéfices à préserver :</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>💰 Gains financiers</li>
                <li>🤖 Agents surperformants</li>
                <li>💊 Résolution d’irritants métiers</li>
              </ul>
            </div>
          </div>

          <div className="text-xl mb-10 text-yellow-300 font-semibold">
            💎 <strong>Pépite Agentique</strong> : +25 pts & bonus de temps si touchée plusieurs fois
          </div>

          <button
            onClick={startGame}
            className="bg-gradient-to-r from-red-500 to-orange-500 px-10 py-4 rounded-full text-2xl font-bold hover:scale-105 transition-transform shadow-xl"
          >
            🚀 Commencer la chasse !
          </button>
        </>
      )}
    </div>
  );
};

export default StartScreen;
