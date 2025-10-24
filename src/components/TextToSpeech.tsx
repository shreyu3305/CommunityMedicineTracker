import React, { useState, useEffect, useRef, useCallback } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/tokens';

export interface TextToSpeechProps {
  text: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  onPause?: () => void;
  onResume?: () => void;
  style?: React.CSSProperties;
}

export interface SpeechControlsProps {
  text: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  onVoiceChange?: (voice: SpeechSynthesisVoice | null) => void;
  onRateChange?: (rate: number) => void;
  onPitchChange?: (pitch: number) => void;
  onVolumeChange?: (volume: number) => void;
  style?: React.CSSProperties;
}

export interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
  language: string;
}

// Text-to-Speech component
export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  language = 'en-US',
  rate = 1,
  pitch = 1,
  volume = 1,
  voice = null,
  autoPlay = false,
  onStart,
  onEnd,
  onError,
  onPause,
  onResume,
  style
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if speech synthesis is supported
  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  // Create utterance
  const createUtterance = useCallback(() => {
    if (!isSupported) return null;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (voice) {
      utterance.voice = voice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setError(null);
      onStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      setIsPaused(false);
      const error = new Error(`Speech synthesis error: ${event.error}`);
      setError(error.message);
      onError?.(error);
    };

    utterance.onpause = () => {
      setIsPaused(true);
      onPause?.();
    };

    utterance.onresume = () => {
      setIsPaused(false);
      onResume?.();
    };

    return utterance;
  }, [text, language, rate, pitch, volume, voice, isSupported, onStart, onEnd, onError, onPause, onResume]);

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && isSupported && text) {
      const utterance = createUtterance();
      if (utterance) {
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }
    }
  }, [autoPlay, isSupported, text, createUtterance]);

  // Play function
  const play = useCallback(() => {
    if (!isSupported) {
      setError('Speech synthesis is not supported in this browser');
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = createUtterance();
    if (utterance) {
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  }, [isSupported, isPaused, createUtterance]);

  // Pause function
  const pause = useCallback(() => {
    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
    }
  }, [isPlaying, isPaused]);

  // Stop function
  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  // Resume function
  const resume = useCallback(() => {
    if (isPaused) {
      speechSynthesis.resume();
    }
  }, [isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    ...style
  };

  if (!isSupported) {
    return (
      <div style={containerStyles}>
        <span style={{ color: colors.error, fontSize: typography.sizes.sm }}>
          Text-to-speech is not supported in this browser
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyles}>
        <span style={{ color: colors.error, fontSize: typography.sizes.sm }}>
          {error}
        </span>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <button
        onClick={isPlaying ? (isPaused ? resume : pause) : play}
        style={{
          padding: `${spacing.sm} ${spacing.md}`,
          border: 'none',
          borderRadius: borderRadius.md,
          backgroundColor: isPlaying ? colors.primary : colors.neutral[200],
          color: isPlaying ? colors.white : colors.text,
          cursor: 'pointer',
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.medium,
          transition: 'all 0.2s ease'
        }}
        aria-label={isPlaying ? (isPaused ? 'Resume speech' : 'Pause speech') : 'Play speech'}
      >
        {isPlaying ? (isPaused ? '▶️ Resume' : '⏸️ Pause') : '🔊 Play'}
      </button>
      
      {isPlaying && (
        <button
          onClick={stop}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            border: 'none',
            borderRadius: borderRadius.md,
            backgroundColor: colors.error,
            color: colors.white,
            cursor: 'pointer',
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            transition: 'all 0.2s ease'
          }}
          aria-label="Stop speech"
        >
          ⏹️ Stop
        </button>
      )}
    </div>
  );
};

// Speech Controls component
export const SpeechControls: React.FC<SpeechControlsProps> = ({
  text,
  language = 'en-US',
  rate = 1,
  pitch = 1,
  volume = 1,
  voice = null,
  onVoiceChange,
  onRateChange,
  onPitchChange,
  onVolumeChange,
  style
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Check support and load voices
  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  // Play function
  const play = () => {
    if (!isSupported) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    speechSynthesis.speak(utterance);
  };

  // Pause function
  const pause = () => {
    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
    }
  };

  // Stop function
  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Resume function
  const resume = () => {
    if (isPaused) {
      speechSynthesis.resume();
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    padding: spacing.md,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    ...style
  };

  const controlGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm
  };

  const labelStyles: React.CSSProperties = {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text
  };

  const inputStyles: React.CSSProperties = {
    padding: spacing.sm,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.sm,
    fontSize: typography.sizes.sm
  };

  const buttonStyles: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    border: 'none',
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    color: colors.white,
    cursor: 'pointer',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    transition: 'all 0.2s ease'
  };

  if (!isSupported) {
    return (
      <div style={containerStyles}>
        <span style={{ color: colors.error, fontSize: typography.sizes.sm }}>
          Text-to-speech is not supported in this browser
        </span>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={controlGroupStyles}>
        <label style={labelStyles}>Voice:</label>
        <select
          value={voice?.name || ''}
          onChange={(e) => {
            const selectedVoice = voices.find(v => v.name === e.target.value);
            onVoiceChange?.(selectedVoice || null);
          }}
          style={inputStyles}
        >
          <option value="">Default Voice</option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div style={controlGroupStyles}>
        <label style={labelStyles}>Rate: {rate.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => onRateChange?.(parseFloat(e.target.value))}
          style={inputStyles}
        />
      </div>

      <div style={controlGroupStyles}>
        <label style={labelStyles}>Pitch: {pitch.toFixed(1)}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => onPitchChange?.(parseFloat(e.target.value))}
          style={inputStyles}
        />
      </div>

      <div style={controlGroupStyles}>
        <label style={labelStyles}>Volume: {Math.round(volume * 100)}%</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
          style={inputStyles}
        />
      </div>

      <div style={{ display: 'flex', gap: spacing.sm }}>
        <button
          onClick={isPlaying ? (isPaused ? resume : pause) : play}
          style={{
            ...buttonStyles,
            backgroundColor: isPlaying ? colors.primary : colors.neutral[200],
            color: isPlaying ? colors.white : colors.text
          }}
        >
          {isPlaying ? (isPaused ? '▶️ Resume' : '⏸️ Pause') : '🔊 Play'}
        </button>
        
        {isPlaying && (
          <button
            onClick={stop}
            style={{
              ...buttonStyles,
              backgroundColor: colors.error
            }}
          >
            ⏹️ Stop
          </button>
        )}
      </div>
    </div>
  );
};

// Medicine name reader component
export const MedicineNameReader: React.FC<{
  medicineName: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  style?: React.CSSProperties;
}> = ({ medicineName, language = 'en-US', rate = 0.8, pitch = 1, volume = 1, voice, style }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const readMedicineName = () => {
    if (!isSupported) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(medicineName);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    ...style
  };

  if (!isSupported) {
    return (
      <div style={containerStyles}>
        <span style={{ color: colors.neutral[500], fontSize: typography.sizes.sm }}>
          🔊 Audio not supported
        </span>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <button
        onClick={isPlaying ? stopReading : readMedicineName}
        style={{
          padding: spacing.sm,
          border: 'none',
          borderRadius: borderRadius.sm,
          backgroundColor: isPlaying ? colors.error : colors.primary,
          color: colors.white,
          cursor: 'pointer',
          fontSize: typography.sizes.sm,
          transition: 'all 0.2s ease'
        }}
        aria-label={isPlaying ? 'Stop reading medicine name' : 'Read medicine name aloud'}
      >
        {isPlaying ? '⏹️' : '🔊'}
      </button>
      <span style={{ fontSize: typography.sizes.sm, color: colors.neutral[600] }}>
        {isPlaying ? 'Reading...' : 'Listen'}
      </span>
    </div>
  );
};

// Speech settings hook
export const useSpeechSettings = () => {
  const [settings, setSettings] = useState<SpeechSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null,
    language: 'en-US'
  });

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const updateSettings = (newSettings: Partial<SpeechSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const speak = (text: string) => {
    if (!isSupported) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.language;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    if (settings.voice) {
      utterance.voice = settings.voice;
    }

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
  };

  return {
    settings,
    voices,
    isSupported,
    updateSettings,
    speak,
    stop
  };
};
