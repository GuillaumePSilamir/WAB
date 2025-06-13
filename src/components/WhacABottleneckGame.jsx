import React, { useState, useEffect, useRef, useCallback } from 'react';
import StartScreen from './StartScreen';
import GameBoard from './GameBoard';
import EndScreen from './EndScreen';
import Hammer from './Hammer';
import ScorePopup from './ScorePopup';
import Admin from './Admin';
import { API_BASE_URL, API_KEY } from '../config';

const WhacABottleneckGame = () => {
  // Etats
  const [gameState, setGameState] = useState('start'); // start, playing, end, admin
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hammerPosition, setHammerPosition] = useState({ x: 0, y: 0 });
  const [hammerHit, setHammerHit] = useState(false);
  const [scorePopups, setScorePopups] = useState([]);
  const [highScores, setHighScores] = useState([]);
  const [newRecord, setNewRecord] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [targets, setTargets] = useState(Array(12).fill(null));

  // Backend fetch
  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      headers: { 'x-api-key': API_KEY }
    })
      .then(res => res.json())
      .then(data => setHighScores(data.sort((a, b) => b.score - a.score)))
      .catch(err => console.error("Erreur chargement scores :", err));
  }, []);

  // Hammer follow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setHammerPosition({ x: e.clientX + 10, y: e.clientY - 10 });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentHighScore = Math.max(...highScores.map(s => s.score), 0);

  const performanceData = {
    message: "Bravo !", // simplification possible
    className: "bg-green-500/20 border-l-4 border-green-500 p-5 rounded-xl mb-5"
  };

  const validatePassword = () => {
    if (passwordInput === 'SILAMIR2025') setPasswordValidated(true);
    else alert('Mot de passe incorrect.');
  };

  const saveHighScore = () => {
    if (!playerName.trim()) return alert('Entrez votre nom.');
    const scoreData = {
      name: playerName,
      email: playerEmail,
      score,
      date: new Date().toLocaleDateString('fr-FR')
    };
    fetch(`${API_BASE_URL}/submit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(scoreData)
    })
      .then(res => res.json())
      .then(() => setHighScores(prev => [scoreData, ...prev]))
      .catch(err => console.error("Erreur d'envoi :", err));
  };

  return (
    <div className="relative min-h-screen w-full bg-red-500 text-white overflow-hidden cursor-none flex flex-col items-center justify-center">
      {/* Logo top permanent */}
      <div className="absolute top-4 left-4 z-50">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-16" />
      </div>

      {/* Marteau et popups */}
      <Hammer hammerPosition={hammerPosition} hammerHit={hammerHit} />
      {scorePopups.map(p => <ScorePopup key={p.id} {...p} />)}

      {/* Ecran principal conditionnel */}
      {!passwordValidated ? (
        <StartScreen
          passwordInput={passwordInput}
          setPasswordInput={setPasswordInput}
          passwordValidated={passwordValidated}
          validatePassword={validatePassword}
          startGame={() => setGameState('playing')}
        />
      ) : (
        <>
          <header className="text-center mt-12 px-4 max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-2 drop-shadow">🔨 Whac-A-Bottleneck</h1>
            <p className="text-lg opacity-90">Éradiquez les inefficiences dans vos process !</p>
          </header>

          <div className="flex justify-center gap-6 mt-6 text-lg font-semibold">
            <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Score: {score}</span>
            <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Temps: {timeLeft}s</span>
            <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Record: {currentHighScore}</span>
          </div>

          <main className="w-full mt-10 px-4 max-w-5xl">
            {gameState === 'start' && (
              <StartScreen
                passwordInput={passwordInput}
                setPasswordInput={setPasswordInput}
                passwordValidated={passwordValidated}
                validatePassword={validatePassword}
                startGame={() => setGameState('playing')}
              />
            )}
            {gameState === 'playing' && (
              <div className="flex justify-center">
                <GameBoard targets={targets} onHit={() => {}} />
              </div>
            )}
            {gameState === 'end' && (
              <EndScreen
                score={score}
                highScores={highScores}
                newRecord={newRecord}
                performanceMessage={performanceData}
                playerName={playerName}
                playerEmail={playerEmail}
                setPlayerName={setPlayerName}
                setPlayerEmail={setPlayerEmail}
                saveHighScore={saveHighScore}
                onRestart={() => setGameState('start')}
              />
            )}
          </main>

          {gameState === 'admin' && <Admin onReturnToGame={() => setGameState('start')} />}

          {gameState !== 'admin' && (
            <button
              onClick={() => setGameState('admin')}
              className="fixed top-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white shadow-md transition"
            >
              Scores
            </button>
          )}
        </>
      )}

      {/* Logos bas */}
      <div className="absolute bottom-4 left-4 z-40">
        <img src="/images/LOGO uiwhitenred.png" alt="Logo Celonis" className="h-20" />
      </div>
      <div className="absolute bottom-4 right-4 z-40">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-14" />
      </div>
    </div>
  );
};

export default WhacABottleneckGame;
