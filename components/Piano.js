import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeys = ['C#', 'D#', null, 'F#', 'G#', 'A#', null];

export default function Piano({ onNotePlay }) {
  const [activeNote, setActiveNote] = useState(null);
  const synthRef = useRef(null);

  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).toDestination();

    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const playNote = (note) => {
    if (!synthRef.current) return;

    Tone.start();
    synthRef.current.triggerAttackRelease(`${note}4`, '8n');
    setActiveNote(note);
    
    if (onNotePlay) {
      onNotePlay(note);
    }

    setTimeout(() => setActiveNote(null), 200);
  };

  // Keyboard controls
  useEffect(() => {
    const keyMap = {
      'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#',
      'd': 'E', 'f': 'F', 't': 'F#', 'g': 'G',
      'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B',
    };

    const handleKeyDown = (e) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note && activeNote !== note) {
        playNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNote]);

  return (
    <div className="relative">
      {/* Instructions */}
      <p className="text-center text-gray-300 mb-4 text-sm">
        Click the keys or use your keyboard: A W S E D F T G Y H U J
      </p>

      {/* Piano Container */}
      <div className="relative flex justify-center items-end h-64 select-none">
        {/* White Keys */}
        {whiteKeys.map((note, index) => (
          <button
            key={`white-${note}`}
            onClick={() => playNote(note)}
            className={`piano-key piano-key-white w-16 h-48 ${
              activeNote === note ? 'bg-gray-300' : ''
            }`}
            style={{ zIndex: 1 }}
          >
            <span className="text-gray-800 font-semibold mb-2">{note}</span>
          </button>
        ))}

        {/* Black Keys */}
        <div className="absolute top-0 left-0 w-full h-48 flex justify-center pointer-events-none">
          {blackKeys.map((note, index) => {
            if (!note) {
              return <div key={`black-${index}`} className="w-16" />;
            }
            return (
              <button
                key={`black-${note}`}
                onClick={() => playNote(note)}
                className={`piano-key piano-key-black w-10 h-32 ${
                  activeNote === note ? 'bg-gray-700' : ''
                }`}
                style={{
                  zIndex: 2,
                  marginLeft: '-20px',
                  marginRight: '-20px',
                  pointerEvents: 'auto',
                }}
              >
                <span className="text-white text-xs font-semibold mb-2">
                  {note}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

