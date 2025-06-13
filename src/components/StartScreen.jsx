import React from 'react';

const StartScreen = ({
  passwordInput,
  setPasswordInput,
  passwordValidated,
  validatePassword,
  startGame
}) => {
  return (
    <div className="bg-white/10 p-10 rounded-2xl backdrop-blur max-w-4xl mx-auto text-center text-white">
      {!passwordValidated ? (
        <>
          <h2 className="text-3xl mb-6 font-bold">🔐 Accès protégé</h2>
          <p className="mb-4 text-xl">Veuillez entrer le mot de passe pour accéder au jeu :</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="px-4 py-2 rounded-lg text-black text-center text-xl"
            placeholder="Mot de passe"
          />
          <br />
          <button
            onClick={validatePassword}
            className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700"
          >
            Valider
          </button>
        </>
      ) : (
        <>
          <h2 className="text-4xl mb-5 font-bold">Règles du jeu</h2>
          <p className="mb-8 text-2xl">
            Tapez sur les déficiences de processus (+15 pts) et préservez les bénéfices de l'automatisation agentique (-5 pts)
          </p>
          <div className="text-left space-y-6 text-2xl mb-8 leading-relaxed">
            <div>
              <strong>Déficiences à éliminer :</strong>
              <ul className="mt-2 space-y-2 ml-5 list-disc">
                <li>🧾 – Paperasse</li>
                <li>🤯 – Surcharge mentale</li>
                <li>🔄 – Redondance, bugs</li>
                <li>🐢 – Lenteurs</li>
              </ul>
            </div>
            <div>
              <strong>Bénéfices à préserver :</strong>
              <ul className="mt-2 space-y-2 ml-5 list-disc">
                <li>💰 – Gains financiers</li>
                <li>🤖 – Agents surperformants</li>
                <li>💊 – Résolution d’irritants métiers</li>
              </ul>
            </div>
            <div>
              <strong>💎 Diamant : pépite Agentique</strong> +25 pts, bonus de temps si touché plusieurs fois
            </div>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Commencer la chasse !
          </button>
        </>
      )}
    </div>
  );
};

export default StartScreen;
