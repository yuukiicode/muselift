import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Piano from '../components/Piano';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const DIFFICULTIES = {
  beginner: { name: 'Beginner', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  intermediate: { name: 'Intermediate', notes: NOTES },
  advanced: { name: 'Advanced (Chords)', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
};

export default function EarTraining() {
  const [difficulty, setDifficulty] = useState('beginner');
  const [targetNote, setTargetNote] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    generateNewNote();
  };

  const generateNewNote = () => {
    const availableNotes = DIFFICULTIES[difficulty].notes;
    const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
    setTargetNote(randomNote);
    setFeedback(null);
  };

  const handleNoteGuess = (guessedNote) => {
    if (!gameStarted || !targetNote) return;

    if (guessedNote === targetNote) {
      setFeedback('correct');
      setScore(score + 10);
      setStreak(streak + 1);
      
      setTimeout(() => {
        generateNewNote();
      }, 1000);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }

    setTimeout(() => setFeedback(null), 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          Ear Training
        </h1>
        <p className="text-gray-300 text-lg">
          Sharpen your musical ear and master note recognition
        </p>
      </motion.div>

      {/* Stats */}
      {gameStarted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-3xl font-bold text-primary-400">{score}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Streak</p>
              <p className="text-3xl font-bold text-purple-400">{streak}🔥</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Difficulty</p>
              <p className="text-xl font-bold text-white capitalize">{difficulty}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Difficulty Selection */}
      {!gameStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Difficulty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(DIFFICULTIES).map(([key, level]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                className={`p-6 rounded-xl transition-all ${
                  difficulty === key
                    ? 'bg-primary-600 text-white scale-105'
                    : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{level.name}</h3>
                <p className="text-sm opacity-75">
                  {key === 'beginner' && 'Natural notes only'}
                  {key === 'intermediate' && 'Includes sharps & flats'}
                  {key === 'advanced' && 'Chord recognition'}
                </p>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button onClick={startGame} className="btn-primary text-lg px-10 py-4">
              Start Training
            </button>
          </div>
        </motion.div>
      )}

      {/* Game Area */}
      {gameStarted && (
        <>
          {/* Feedback */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {feedback === 'correct' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block px-8 py-4 bg-green-600 bg-opacity-20 border-2 border-green-500 rounded-2xl"
              >
                <p className="text-3xl font-bold text-green-400">✓ Correct!</p>
              </motion.div>
            )}
            {feedback === 'incorrect' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block px-8 py-4 bg-red-600 bg-opacity-20 border-2 border-red-500 rounded-2xl"
              >
                <p className="text-3xl font-bold text-red-400">✗ Try Again</p>
              </motion.div>
            )}
            {!feedback && (
              <div className="inline-block px-8 py-4 glass-card">
                <p className="text-xl text-gray-300">
                  Listen carefully and identify the note
                </p>
              </div>
            )}
          </motion.div>

          {/* Piano */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <Piano onNotePlay={handleNoteGuess} />
          </motion.div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={generateNewNote}
              className="btn-primary"
            >
              Skip Note
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="btn-secondary"
            >
              Change Difficulty
            </button>
          </div>
        </>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold mb-4">How to Play</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Select your difficulty level</li>
          <li>• Listen to the note played</li>
          <li>• Click or press the keyboard key for your guess</li>
          <li>• Build your streak for higher scores!</li>
          <li>• Practice daily to improve your musical ear</li>
        </ul>
      </motion.div>
    </div>
  );
}

