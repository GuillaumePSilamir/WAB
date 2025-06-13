import React from 'react';

const StartScreen = ({
  passwordInput,
  setPasswordInput,
  passwordValidated,
  validatePassword,
  startGame
}) => {
  return (
    <div className="fixed top-32 left-0 right-0 bottom-0 flex items-center justify-center px-4 z-40">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl w-full max-w-5xl mx-auto text-white text-center shadow-2xl border border-white/20">
        {!passwordValidated ? (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">🔐 Accès protégé</h2>
            <p className="text-xl mb-6">
              Entrez le mot de passe pour accéder à la mission :
            </p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && validatePassword()}
              className="px-6 py-3 rounded-lg text-black text-center text-xl w-80 max-w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Mot de passe"
            />
            <div className="mt-6">
              <button
                onClick={validatePassword}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
              >
                Valider
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-6">🎯 Règles du jeu</h2>
            <p className="text-2xl mb-10 leading-relaxed max-w-3xl">
              Tapez sur les <strong className="text-yellow-400">déficiences</strong> (+15 pts) et évitez les <strong className="text-green-300">bénéfices</strong> (-10 pts).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left text-xl leading-relaxed mb-10 w-full">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-2xl font-bold mb-4 text-white">🚫 Déficiences à éliminer :</h3>
                <ul className="list-disc ml-6 space-y-2 text-white">
                  <li>🧾 Paperasse et actes manuels </li>
                  <li>🤯 Surcharge mentale</li>
                  <li>🔄 Redondances / bugs</li>
                  <li>🐢 Lenteurs</li>
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-2xl font-bold mb-4 text-green-300">✅ Bénéfices à préserver :</h3>
                <ul className="list-disc ml-6 space-y-2 text-white">
                  <li>💰 Gains financiers</li>
                  <li>🤖 Agents surperformants</li>
                  <li>💊 Résolution d'irritants métiers</li>
                </ul>
              </div>
            </div>

            <div className="text-2xl mb-10 text-yellow-300 font-semibold bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 max-w-3xl">
              💎 <strong>Pépite Agentique</strong> : +25 pts & bonus de temps si touchée plusieurs fois
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-12 py-4 rounded-full text-4xl font-bold text-white transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer"
            >
              🚀 Commencer la chasse !
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;