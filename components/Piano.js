'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as Tone from 'tone';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVE = 4;

export default function Piano() {
  const [synth, setSynth] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [targetNote, setTargetNote] = useState(null);
  const [difficulty, setDifficulty] = useState('beginner');
  const [feedback, setFeedback] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const newSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.5,
        release: 0.5
      }
    }).toDestination();
    
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, []);

  const getNotesForDifficulty = () => {
    if (difficulty === 'beginner') {
      return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Natural notes only
    } else if (difficulty === 'intermediate') {
      return NOTES; // All notes
    } else {
      return NOTES; // Advanced can include chords later
    }
  };

  const playRandomNote = async () => {
    if (!synth || isPlaying) return;
    
    await Tone.start();
    setIsPlaying(true);
    
    const availableNotes = getNotesForDifficulty();
    const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
    const fullNote = `${randomNote}${OCTAVE}`;
    
    setTargetNote(randomNote);
    setFeedback(null);
    
    synth.triggerAttackRelease(fullNote, '0.5');
    
    setTimeout(() => setIsPlaying(false), 500);
  };

  const handleNoteClick = async (note) => {
    if (!synth || !targetNote) return;

    await Tone.start();
    
    const fullNote = `${note}${OCTAVE}`;
    synth.triggerAttackRelease(fullNote, '0.3');
    setActiveNote(note);
    
    setTimeout(() => setActiveNote(null), 300);

    // Check if correct
    if (note === targetNote) {
      setFeedback('correct');
      setScore(score + 10);
      setStreak(streak + 1);
      setTimeout(() => {
        setFeedback(null);
        setTargetNote(null);
      }, 1000);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const isBlackKey = (note) => note.includes('#');

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Controls */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">Score</p>
              <p className="text-2xl font-bold text-primary-400">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Streak</p>
              <p className="text-2xl font-bold text-purple-400">{streak}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playRandomNote}
            disabled={isPlaying || targetNote !== null}
            className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
          >
            {targetNote ? 'Guess the Note!' : 'Play Note'}
          </motion.button>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-lg text-center font-semibold ${
              feedback === 'correct'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {feedback === 'correct' ? '✓ Correct!' : '✗ Try Again'}
          </motion.div>
        )}
      </div>

      {/* Piano Keys */}
      <div className="glass-card p-6">
        <div className="relative flex justify-center" style={{ height: '200px' }}>
          {NOTES.map((note, index) => {
            const isBlack = isBlackKey(note);
            const isActive = activeNote === note;
            const isTarget = targetNote === note && feedback === 'correct';

            return (
              <motion.button
                key={note}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNoteClick(note)}
                className={`piano-key ${isActive ? 'active' : ''} ${
                  isBlack
                    ? 'absolute w-12 h-32 bg-gray-900 border border-white/20 z-10'
                    : 'w-16 h-48 bg-white border border-gray-300'
                } rounded-b-lg transition-all ${
                  isTarget ? 'ring-4 ring-green-400' : ''
                }`}
                style={
                  isBlack
                    ? {
                        left: `${(index - 0.5) * 64 + 32}px`,
                        top: 0
                      }
                    : {}
                }
              >
                <span
                  className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold ${
                    isBlack ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {note}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Click "Play Note" to hear a random note, then click the key you think it is!</p>
        <p className="mt-2">
          <span className="text-primary-400">Beginner:</span> Natural notes only |{' '}
          <span className="text-primary-400">Intermediate:</span> All notes |{' '}
          <span className="text-primary-400">Advanced:</span> Chords (coming soon)
        </p>
      </div>
    </div>
  );
}

