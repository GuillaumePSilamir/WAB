import React from 'react'
import StartScreen from './StartScreen'
import GameBoard from './GameBoard'
import EndScreen from './EndScreen'
import Hammer from './Hammer'
import ScorePopup from './ScorePopup'
import Admin from './Admin'

// Config backend
import { API_BASE_URL, API_KEY } from '../config'

const WhacABottleneckGame = () => {
  // ⚙️ États : score, temps, états du jeu, joueurs...
  // 👉 Garde ta logique ici : useState, useEffect, fonctions de jeu...

  return (
    <div className="relative min-h-screen w-full bg-orange-500 text-white overflow-hidden cursor-none flex flex-col items-center justify-center">
      
      {/* 🔨 Marteau */}
      <Hammer hammerPosition={hammerPosition} hammerHit={hammerHit} />

      {/* 🎇 ScorePopups */}
      {scorePopups.map(popup => (
        <ScorePopup key={popup.id} {...popup} />
      ))}

      {/* 🔼 Logos Top */}
      <div className="absolute top-4 flex justify-center items-center gap-6 z-40">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-16" />
      </div>

      {/* 🧾 Header & Infos */}
      <header className="text-center mt-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-2 drop-shadow">🔨 Whac-A-Bottleneck</h1>
        <p className="text-lg opacity-90">Éradiquez les inefficiences dans vos process !</p>
      </header>

      {/* 📊 Score infos */}
      <div className="flex justify-center gap-6 mt-6 text-lg font-semibold">
        <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Score: {score}</span>
        <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Temps: {timeLeft}s</span>
        <span className="bg-white/20 px-5 py-2 rounded-full backdrop-blur">Record: {currentHighScore}</span>
      </div>

      {/* 🎮 Zones de jeu */}
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

      {/* 🛠️ Admin screen */}
      {gameState === 'admin' && <Admin onReturnToGame={() => setGameState('start')} />}

      {/* 🎯 Bouton Admin */}
      {gameState !== 'admin' && (
        <button
          onClick={() => setGameState('admin')}
          className="fixed top-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white shadow-md transition"
        >
          Scores
        </button>
      )}

      {/* 📍 Logos bas */}
      <div className="absolute bottom-4 left-4 z-40">
        <img src="/images/LOGO uiwhitenred.png" alt="Logo Celonis" className="h-20" />
      </div>
      <div className="absolute bottom-4 right-4 z-40">
        <img src="/images/Silamir-group-light-logo.png" alt="Logo Silamir" className="h-14" />
      </div>
    </div>
  )
}

export default WhacABottleneckGame
