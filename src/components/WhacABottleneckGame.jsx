import React, { useState, useEffect, useRef, useCallback } from 'react';
import StartScreen from './StartScreen';
import GameBoard from './GameBoard';
import EndScreen from './EndScreen';
import Hammer from './Hammer';
import ScorePopup from './ScorePopup';
import Admin from './Admin';

import { API_BASE_URL, API_KEY } from '../config';

const WhacABottleneckGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameState, setGameState] = useState('start');
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [highScores, setHighScores] = useState([]);
  const [targets, setTargets] = useState(Array(12).fill(null));
  const [hammerPosition, setHammerPosition] = useState({ x: 0, y: 0 });
  const [hammerHit, setHammerHit] = useState(false);
  const [scorePopups, setScorePopups] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [newRecord, setNewRecord] = useState(false);
  const gameTimerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setHammerPosition({ x: e.clientX + 10, y: e.clientY - 10 });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      headers: {
        'x-api-key': API_KEY
      }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.score - a.score);
        setHighScores(sorted);
      })
      .catch(err => console.error("Erreur chargement scores:", err));
  }, []);

  const startGame = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    setGameState('playing');
    setScore(0);
    setTimeLeft(25);
    setTargets(Array(12).fill(null));
    setNewRecord(false);
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
          setGameState('end');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const hitTarget = (holeIndex) => {
    if (!targets[holeIndex]) return;
    setHammerHit(true);
    setTimeout(() => setHammerHit(false), 200);
    setScore(prev => prev + 10);
    const popup = {
      id: Date.now(),
      points: 10,
      isPositive: true
    };
    setScorePopups(prev => [...prev, popup]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== popup.id));
    }, 800);
    const newTargets = [...targets];
    newTargets[holeIndex] = null;
    setTargets(newTargets);
  };

  const validatePassword = () => {
    if (passwordInput === 'SILAMIR2025') {
      setPasswordValidated(true);
    } else {
      alert('Mot de passe incorrect.');
    }
  };

  const saveHighScore = () => {
    if (!playerName.trim()) {
      alert('Veuillez entrer votre nom !');
      return;
    }
    const newScore = {
      name: playerName.trim(),
      email: playerEmail.trim(),
      score: score,
      date: new Date().toLocaleDateString('fr-FR'),
      id: Date.now()
    };
    const currentHighScore = Math.max(...highScores.map(s => s.score), 0);
    if (score > currentHighScore) setNewRecord(true);
    setHighScores(prev => {
      const updated = [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10);
      return updated;
    });
    fetch(`${API_BASE_URL}/submit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(newScore)
    })
      .then(res => res.json())
      .then(data => console.log('Serveur:', data.message))
      .catch(err => console.error('Erreur enregistrement:', err));
    alert('Score enregistré avec succès !');
    setPlayerName('');
    setPlayerEmail('');
  };

  const performanceMessage = {
    message: score >= 200 ? "🎉 Maîtrise totale !" : score >= 100 ? "👍 Bien joué !" : "🎓 Continuez à vous entraîner !",
    className: score >= 200 ? "bg-green-500/20 border-l-4 border-green-500 p-5 rounded-xl mb-5" : score >= 100 ? "bg-yellow-500/20 border-l-4 border-yellow-500 p-5 rounded-xl mb-5" : "bg-red-500/20 border-l-4 border-red-500 p-5 rounded-xl mb-5"
  };

  const currentHighScore = Math.max(...highScores.map(s => s.score), 0);

  return (
    <div className="relative min-h-screen w-full bg-orange-500 text-white overflow-hidden cursor-none flex flex-col items-center justify-center">
      <Hammer hammerPosition={hammerPosition} hammerHit={hammerHit} />
      {scorePopups.map(popup => (
        <ScorePopup key={popup.id} {...popup} />
      ))}
      <div className="absolute top-4 flex justify-center items-center gap-6 z-40">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-16" />
      </div>
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
            startGame={startGame}
          />
        )}
        {gameState === 'playing' && (
          <div className="flex justify-center">
            <GameBoard targets={targets} onHit={hitTarget} />
          </div>
        )}
        {gameState === 'end' && (
          <EndScreen
            score={score}
            highScores={highScores}
            newRecord={newRecord}
            performanceMessage={performanceMessage}
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
