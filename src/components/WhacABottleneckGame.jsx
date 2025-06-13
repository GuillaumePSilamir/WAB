import React, { useState, useEffect, useRef, useCallback } from 'react';
import Admin from './Admin';

const WhacABottleneckGame = () => {
  // États du jeu
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameActive, setGameActive] = useState(false);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'end', 'admin'
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Meilleurs scores initiaux
  const [highScores, setHighScores] = useState([
    { name: 'Expert Agentic Automation', score: 180, date: '23/05/2025', id: 1716400001 },
    { name: 'Professionnel de la simplification', score: 145, date: '22/05/2025', id: 1716400002 },
    { name: 'Simplificateur en herbe', score: 120, date: '21/05/2025', id: 1716400003 }
  ]);

  // Grille de jeu initialement vide (12 cases nulles)
  const [targets, setTargets] = useState(Array(12).fill(null));
  const [hammerPosition, setHammerPosition] = useState({ x: 0, y: 0 });
  const [hammerHit, setHammerHit] = useState(false);
  const [scorePopups, setScorePopups] = useState([]);
  const [diamondCount, setDiamondCount] = useState(0);
  const [diamondHits, setDiamondHits] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [newRecord, setNewRecord] = useState(false);

  const gameTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);

  const deficiencies = ['🧾', '🤯', '🔄', '🐢'];
  const benefits = ['💰', '💊', '🤖'];
  const maxDiamonds = 3;

  //  Charger les scores sauvegardés à l'ouverture du jeu
  useEffect(() => {
    fetch('https://Whac-A-Bottleneck-backend.onrender.com/scores', {
      headers: {
        'x-api-key': 'SilamirCD2025!'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
  const sorted = data.sort((a, b) => b.score - a.score);
  setHighScores(sorted);
})
    .catch(err => {
      console.error("Erreur chargement scores :", err);
      // Afficher un message d'erreur à l'utilisateur
    });
  }, []); // CORRECTION: Ajout des dépendances manquantes

  useEffect(() => {
    const handleMouseMove = (e) => {
      setHammerPosition({ x: e.clientX + 10, y: e.clientY - 10 });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
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

  // FIX: Création d'une version stable de spawnTarget avec useRef
  const spawnTargetRef = useRef();
  
  spawnTargetRef.current = () => {
    console.log('🎯 spawnTarget called, gameActive:', gameActive);
    
    if (!gameActive) {
      console.log('❌ Game not active, returning');
      return;
    }

    console.log('🎲 Current targets state:', targets);

    // FIX: Meilleure logique pour trouver les trous disponibles
    const availableHoles = [];
    targets.forEach((target, index) => {
      if (target === null) {
        availableHoles.push(index);
      }
    });

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

    const newTarget = {
      emoji,
      type: targetType,
      timestamp: Date.now(),
      id: Date.now() // CORRECTION: Ajout de l'ID manquant
    };

    // FIX: Mise à jour immédiate et vérification
    setTargets(prev => {
      const newTargets = [...prev];
      newTargets[randomHole] = newTarget;
      console.log(`Spawning ${emoji} at hole ${randomHole}`, newTargets); // Debug
      return newTargets;
    });

    // FIX: Meilleure gestion du timing de disparition
    const hideTime = targetType === 'diamond' ? 600 : 600 + Math.random() * 300;
    console.log('⏰ Target will hide in', hideTime, 'ms');
    
    setTimeout(() => {
      console.log('🫥 Attempting to hide target at hole', randomHole);
      setTargets(prev => {
        const newTargets = [...prev];
        if (newTargets[randomHole] && 
            newTargets[randomHole].id === newTarget.id) {
          newTargets[randomHole] = null;
          console.log('✅ Target hidden successfully');
        } else {
          console.log('⚠️ Target already removed or different target');
        }
        return newTargets;
      });
    }, hideTime);

    const nextSpawn = 400 + Math.random() * 400;
    console.log('🔄 Next spawn in', nextSpawn, 'ms');
    spawnTimerRef.current = setTimeout(() => spawnTargetRef.current(), nextSpawn);
  };

  const spawnTarget = useCallback(() => {
    spawnTargetRef.current();
  }, []);

  const hitTarget = useCallback((holeIndex) => {
    console.log(`Hit attempt on hole ${holeIndex}, target:`, targets[holeIndex]); // Debug

    if (!gameActive || !targets[holeIndex]) return;

    const target = targets[holeIndex];
    setHammerHit(true);
    setTimeout(() => setHammerHit(false), 200);

    let points;
    if (target.type === 'bottleneck') {
      points = 15;
    } else if (target.type === 'diamond') {
      points = 25;
      setDiamondHits(prev => {
        const newHits = prev + 1;
        if (newHits === 2) setTimeLeft(t => t + 2);
        else if (newHits === 3) setTimeLeft(t => t + 5);
        return newHits;
      });
    } else {
      points = -5;
    }

    setScore(prev => prev + points);
    createScorePopup(holeIndex, points);

    setTargets(prev => {
      const newTargets = [...prev];
      newTargets[holeIndex] = null;
      return newTargets;
    });
  }, [gameActive, targets, createScorePopup]); // CORRECTION: Suppression du commentaire mal placé

  // AJOUT MOT DE PASSE
  const validatePassword = () => {
    const correctPassword = 'SILAMIR2025'; // 🛡️ Tu peux changer le mot de passe ici
    if (passwordInput === correctPassword) {
      setPasswordValidated(true);
    } else {
      alert('Mot de passe incorrect.');
    }
  };

  const startGame = useCallback(() => {
    
    // FIX: Nettoyage des timers avant de commencer
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    setGameState('playing');
    setScore(0);
    setTimeLeft(25);
    setDiamondCount(0);
    setDiamondHits(0);
    setGameActive(true);
    setTargets(Array(12).fill(null));
    setNewRecord(false);

    // FIX: Activer le jeu AVANT de démarrer les timers
    setGameActive(true);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setGameState('end');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // FIX: Démarrage immédiat du spawn
    setTimeout(() => {
      console.log("Starting spawn cycle");
      spawnTarget();
    }, 500);
  }, [spawnTarget]);
const onReturnToGame = () => {
  setGameState('start'); // ou 'playing' selon ce que tu veux faire
};
  useEffect(() => {
    if (!gameActive) {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    }
  }, [gameActive]);

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

    // ✅ ENVOI vers le serveur
    fetch('https://Whac-A-Bottleneck-backend.onrender.com/submit-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'SilamirCD2025!'
      },
      body: JSON.stringify({
        name: playerName.trim(),
        email: playerEmail.trim(),
        score,
        date: new Date().toLocaleDateString('fr-FR')
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('Serveur:', data.message);
    })
    .catch(err => {
      console.error('Erreur d\'envoi au serveur :', err);
    });

    alert('Score enregistré avec succès !');
    setPlayerName('');
    setPlayerEmail('');
  };

  const getPerformanceMessage = () => {
    if (score >= 200) {
      return {
        message: "🎉 Extraordinaire ! Vous êtes un véritable maître de l'Automatisation Agentique !",
        className: "bg-green-500/20 border-l-4 border-green-500 p-5 rounded-xl mb-5"
      };
    } else if (score >= 150) {
      return {
        message: "🌟 Excellent travail ! Vous maîtrisez bien les concepts de l'Automatisation.",
        className: "bg-green-500/20 border-l-4 border-green-500 p-5 rounded-xl mb-5"
      };
    } else if (score >= 100) {
      return {
        message: "👍 Bonne performance ! Continuez à vous entraîner !",
        className: "bg-yellow-500/20 border-l-4 border-yellow-500 p-5 rounded-xl mb-5"
      };
    } else if (score >= 50) {
      return {
        message: "⚡ Pas mal ! Vous commencez à distinguer les inefficiences.",
        className: "bg-yellow-500/20 border-l-4 border-yellow-500 p-5 rounded-xl mb-5"
      };
    } else if (score >= 0) {
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
  };

  const performanceData = getPerformanceMessage();
  const currentHighScore = Math.max(...highScores.map(s => s.score), 0);

  return (
    <div className="min-h-screen bg-[#FA4515] text-white flex flex-col items-center justify-center cursor-none relative">
      {/* Images de logo ajoutées */}
      <div className="flex justify-center items-center gap-10 mb-6">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-24" />
      </div>

{/* Marteau - Hammer*/}
      import Hammer from './Hammer';
// ...
<Hammer hammerPosition={hammerPosition} hammerHit={hammerHit} />

{/* Popups de score - ScorePopup */}
      import ScorePopup from './ScorePopup';
// ...
{scorePopups.map(popup => (
  <ScorePopup
    key={popup.id}
    id={popup.id}
    points={popup.points}
    isPositive={popup.isPositive}
  />
))}

      <div className="text-center max-w-4xl w-full px-5">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-shadow">🔨 Whac-A-Bottleneck</h1>
          <p className="text-xl opacity-90">Éradiquez les inefficiences dans vos process !</p>
        </div>

        {/* Infos en haut */}
        <div className="flex justify-center gap-8 mb-8 text-lg font-bold">
          <div className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Score: {score}</div>
          <div className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Temps: {timeLeft}s</div>
          <div className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">High Score: {currentHighScore}</div>
        </div>

{/* Écran de démarrage - StartScreen*/}
        import StartScreen from './StartScreen';
// ...
{gameState === 'start' && (
  <StartScreen
    passwordInput={passwordInput}
    setPasswordInput={setPasswordInput}
    passwordValidated={passwordValidated}
    validatePassword={validatePassword}
    startGame={startGame}
  />
)}

{/* Plateau de jeu */}
       import GameBoard from './GameBoard';
// ...
{gameState === 'playing' && (
  <div className="flex justify-center w-full mt-8">
    <GameBoard targets={targets} onHit={hitTarget} />
  </div>
)}

{/* Écran de fin - Endscreen*/}
       import EndScreen from './EndScreen';
// ...
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
      </div>

      {/* Interface admin */}
      {gameState === 'admin' && (
  <Admin onReturnToGame={() => setGameState('start')} />
)}
      {/* Logo en bas de l'écran */}
      <div className="fixed bottom-5 right-5 z-40 opacity-80">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-20" />
      </div>

      {/* Logo en bas à gauche */}
      <div className="fixed bottom-5 left-5 z-40 opacity-80">
        <img src="/images/LOGO uiwhitenred.png" alt="Logo Celonis" className="h-40" />
      </div>

      {/* ✅ Bouton Admin en haut à droite */}
      {gameState !== 'admin' && (
  <button
    onClick={() => setGameState('admin')}
    className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
  >
    Scores
  </button>
)}
    </div>
  );
};

export default WhacABottleneckGame;