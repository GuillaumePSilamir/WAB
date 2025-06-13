import React, { useState, useEffect, useRef, useCallback } from 'react';
import StartScreen from './StartScreen';
import GameBoard from './GameBoard';
import EndScreen from './EndScreen';
import Hammer from './Hammer';
import ScorePopup from './ScorePopup';
import Admin from './Admin';
import { API_BASE_URL, API_KEY } from '../config';

const WhacABottleneckGame = () => {
  const [gameState, setGameState] = useState('start');
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
  const [diamondHits, setDiamondHits] = useState(0);
  const [diamondCount, setDiamondCount] = useState(0);
  const [performanceMessage, setPerformanceMessage] = useState(null);

  const gameTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const spawnTargetRef = useRef();

  const deficiencies = ['🧾', '🤯', '🔄', '🐢'];
  const benefits = ['💰', '💊', '🤖'];
  const maxDiamonds = 3;

  const getPerformanceMessage = useCallback((finalScore) => {
    if (finalScore >= 200) {
      return {
        message: "🎉 Extraordinaire ! Vous êtes un véritable maître de l'Automatisation Agentique !",
        className: "bg-green-500/20 border-l-4 border-green-500 p-5 rounded-xl mb-5"
      };
    } else if (finalScore >= 150) {
      return {
        message: "🌟 Excellent travail ! Vous maîtrisez bien les concepts de l'Automatisation.",
        className: "bg-green-500/20 border-l-4 border-green-500 p-5 rounded-xl mb-5"
      };
    } else if (finalScore >= 100) {
      return {
        message: "👍 Bonne performance ! Continuez à vous entraîner !",
        className: "bg-yellow-500/20 border-l-4 border-yellow-500 p-5 rounded-xl mb-5"
      };
    } else if (finalScore >= 50) {
      return {
        message: "⚡ Pas mal ! Vous commencez à distinguer les inefficiences.",
        className: "bg-yellow-500/20 border-l-4 border-yellow-500 p-5 rounded-xl mb-5"
      };
    } else if (finalScore >= 0) {
      return {
        message: "🎓 C'est un début ! Continuez à jouer pour affiner vos compétences !",
        className: "bg-red-500/20 border-l-4 border-red-500 p-5 rounded-xl mb-5"
      };
    } else {
      return {
        message: "😅 Oups ! Vous avez un peu d'entraînement devant vous!",
        className: "bg-red-500/20 border-l-4 border-red-500 p-5 rounded-xl mb-5"
      };
    }
  }, []);

  const createScorePopup = useCallback((holeIndex, points) => {
    const popup = {
      id: Date.now(),
      points,
      holeIndex,
      isPositive: points > 0
    };
    setScorePopups(prev => [...prev, popup]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== popup.id));
    }, 800);
  }, []);

  const hitTarget = useCallback((holeIndex) => {
    if (!targets[holeIndex]) return;
    const target = targets[holeIndex];
    setHammerHit(true);
    setTimeout(() => setHammerHit(false), 200);
    let points = 0;
    if (target.type === 'bottleneck') points = 15;
    else if (target.type === 'diamond') {
      points = 25;
      setDiamondHits(prev => {
        const newHits = prev + 1;
        if (newHits === 2) setTimeLeft(t => t + 2);
        else if (newHits === 3) setTimeLeft(t => t + 5);
        return newHits;
      });
    } else points = -5;
    setScore(prev => prev + points);
    createScorePopup(holeIndex, points);
    setTargets(prev => {
      const newTargets = [...prev];
      newTargets[holeIndex] = null;
      return newTargets;
    });
  }, [targets, createScorePopup]);

  spawnTargetRef.current = () => {
    const availableHoles = targets.map((t, i) => t === null ? i : null).filter(i => i !== null);
    if (availableHoles.length === 0) {
      spawnTimerRef.current = setTimeout(spawnTarget, 200);
      return;
    }
    const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    const rand = Math.random();
    let targetType, emoji;
    if (rand < 0.15 && diamondCount < maxDiamonds) {
      targetType = 'diamond';
      emoji = '💎';
      setDiamondCount(prev => prev + 1);
    } else if (rand < 0.6) {
      targetType = 'bottleneck';
      emoji = deficiencies[Math.floor(Math.random() * deficiencies.length)];
    } else {
      targetType = 'benefit';
      emoji = benefits[Math.floor(Math.random() * benefits.length)];
    }
    const newTarget = { emoji, type: targetType, timestamp: Date.now(), id: Date.now() };
    setTargets(prev => {
      const newTargets = [...prev];
      newTargets[randomHole] = newTarget;
      return newTargets;
    });
    const hideTime = targetType === 'diamond' ? 600 : 600 + Math.random() * 300;
    setTimeout(() => {
      setTargets(prev => {
        const newTargets = [...prev];
        if (newTargets[randomHole]?.id === newTarget.id) newTargets[randomHole] = null;
        return newTargets;
      });
    }, hideTime);
    const nextSpawn = 400 + Math.random() * 400;
    spawnTimerRef.current = setTimeout(() => spawnTargetRef.current(), nextSpawn);
  };

  const spawnTarget = useCallback(() => {
    spawnTargetRef.current();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/scores`, {
      method: 'GET',  
      headers: { 'x-api-key': API_KEY }
    })
      .then(res => res.json())
      .then(data => setHighScores(data.sort((a, b) => b.score - a.score)))
      .catch(err => console.error("Erreur chargement scores :", err));
  }, []);

useEffect(() => {
  if (gameState === 'end') {
    setPerformanceMessage(getPerformanceMessage(score));
  }
}, [gameState, score]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setHammerPosition({ x: e.clientX + 10, y: e.clientY - 10 });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentHighScore = Math.max(...highScores.map(s => s.score), 0);

  const validatePassword = () => {
    if (passwordInput === 'SILAMIR2025') {
      setPasswordValidated(true);
    } else {
      alert('Mot de passe incorrect.');
    }
  };

  const startGame = useCallback(() => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setDiamondCount(0);
    setDiamondHits(0);
    setTargets(Array(12).fill(null));
    setNewRecord(false);
    setPerformanceMessage(null);
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
          setTimeout(() => setGameState('end'), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimeout(() => {
      spawnTarget();
    }, 500);
  }, [spawnTarget, getPerformanceMessage, score]);

  const saveHighScore = () => {
    if (!playerName.trim()) {
      alert('Entrez votre nom.');
      return;
    }

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
      .then(async res => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err);
        }
        return res.json();
      })
      .then(() => {
        setHighScores(prev => [scoreData, ...prev].sort((a, b) => b.score - a.score));
        alert('Score enregistré !');
      })
      .catch(err => {
        console.error("Erreur d'envoi :", err);
        alert('Erreur lors de l\'enregistrement du score');
      });
  };

  const onRestart = () => {
    setGameState('start');
    setScore(0);
    setTimeLeft(30);
    setPlayerName('');
    setPlayerEmail('');
    setNewRecord(false);
  };

  if (gameState === 'admin') {
    return <Admin onReturnToGame={() => setGameState('start')} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-orange-500 to-orange-600 overflow-hidden">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-20 w-auto" onError={(e) => { e.target.style.display = 'none'; }} />
      </div>

      <button onClick={() => setGameState('admin')} className="fixed top-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white shadow-md transition cursor-pointer">
        Scores
      </button>

      {passwordValidated && (
        <>
          <Hammer hammerPosition={hammerPosition} hammerHit={hammerHit} />
          {scorePopups.map(p => <ScorePopup key={p.id} {...p} />)}
        </>
      )}

      <div className="pt-32 px-4 text-white">
        {!passwordValidated ? (
          <StartScreen
            passwordInput={passwordInput}
            setPasswordInput={setPasswordInput}
            passwordValidated={passwordValidated}
            validatePassword={validatePassword}
            startGame={startGame}
          />
        ) : (
          <>
            <header className="text-center mb-8 max-w-3xl mx-auto">
              <h1 className="text-6xl font-extrabold mb-2 drop-shadow-lg">🔨 Whac-A-Bottleneck</h1>
              <p className="text-xl opacity-90">Éradiquez les inefficiences dans vos process !</p>
            </header>

            <div className="flex justify-center gap-6 mb-8 text-lg font-semibold">
              <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Score: {score}</span>
              <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Temps: {timeLeft}s</span>
              <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Record: {currentHighScore}</span>
            </div>

            <main className="w-full flex-1">
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
                <div className="flex justify-center w-full">
                  <GameBoard targets={targets} onHit={hitTarget} />
                </div>
              )}

              {gameState === 'end' && performanceMessage && (
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
                  onRestart={onRestart}
                />
              )}
            </main>
          </>
        )}
      </div>

      <div className="absolute bottom-4 left-4 z-40">
        <img src="/images/LOGO uiwhitenred.png" alt="Logo Celonis" className="h-20 w-auto" onError={(e) => { e.target.style.display = 'none'; }} />
      </div>

      <div className="absolute bottom-4 right-4 z-40">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-14 w-auto" onError={(e) => { e.target.style.display = 'none'; }} />
      </div>
    </div>
  );
};

export default WhacABottleneckGame;
