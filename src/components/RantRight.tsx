'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff, Mic, MicOff, ArrowLeft, Phone } from 'lucide-react';

interface RantRightProps {
  onBack: () => void;
}

export default function RantRight({ onBack }: RantRightProps) {
  const [status, setStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [lastCaption, setLastCaption] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [micDenied, setMicDenied] = useState(false);

  const vapiRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const VAPI_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const VAPI_ASSISTANT = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const vapiReady = VAPI_KEY && VAPI_KEY !== 'your_vapi_public_key';

  useEffect(() => {
    if (!vapiReady || typeof window === 'undefined') return;
    import('@vapi-ai/web').then(({ default: Vapi }) => {
      const vapi = new Vapi(VAPI_KEY!);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setStatus('connected');
        setCallDuration(0);
      });
      vapi.on('call-end', () => {
        setStatus('idle');
        setCallDuration(0);
        setLastCaption('');
        if (timerRef.current) clearInterval(timerRef.current);
      });
      vapi.on('message', (msg: any) => {
        if (msg.type === 'transcript' && msg.transcript) {
          setLastCaption(`${msg.role === 'assistant' ? 'Vent: ' : 'You: '}${msg.transcript}`);
        }
      });
      vapi.on('error', (e: any) => {
        console.error('VAPI error', e);
        setStatus('idle');
      });
    });

    return () => {
      vapiRef.current?.stop();
    };
  }, [vapiReady, VAPI_KEY]);

  useEffect(() => {
    if (status === 'connected') {
      timerRef.current = setInterval(() => setCallDuration(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  const startCall = async () => {
    setMicDenied(false);
    if (!vapiReady) {
      // Demo mode — no VAPI keys
      setStatus('calling');
      setTimeout(() => {
        setStatus('connected');
        setLastCaption('Vent: Okay. Lay it on me. What did they do this time?');
      }, 1800);
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicDenied(true);
      return;
    }
    setStatus('calling');
    vapiRef.current?.start(VAPI_ASSISTANT);
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setStatus('idle');
    setLastCaption('');
    setCallDuration(0);
  };

  const toggleMute = () => {
    vapiRef.current?.setMuted(!isMuted);
    setIsMuted(m => !m);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="feature-view"
    >
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="call-container glass-card">
        {status === 'idle' ? (
          <div className="idle-screen">
            <motion.div
              className="vent-avatar"
              animate={{ boxShadow: ['0 0 20px rgba(99,102,241,0.2)', '0 0 40px rgba(168,85,247,0.4)', '0 0 20px rgba(99,102,241,0.2)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="vent-emoji">😤</span>
            </motion.div>

            <h2>Vent</h2>
            <p className="idle-subtitle">Someone who actually agrees with you. Free of charge.</p>

            {micDenied && (
              <p className="mic-denied">Mic permission denied. Please allow microphone access and try again.</p>
            )}

            {!vapiReady && (
              <p className="demo-note">Demo mode — add VAPI keys to .env.local for real voice calls.</p>
            )}

            <button className="start-btn btn-primary" onClick={startCall}>
              <Phone size={20} />
              <span>Scream into the void →</span>
            </button>
          </div>
        ) : (
          <div className="call-screen">
            <div className="call-top">
              {status === 'connected' && (
                <div className="live-row">
                  <span className="live-dot" />
                  <span className="live-label">LIVE</span>
                  <span className="timer">{formatTime(callDuration)}</span>
                </div>
              )}
              {status === 'calling' && <p className="connecting-text">Connecting to Vent…</p>}
            </div>

            <div className="waveform-area">
              <div className="waveform">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bar"
                    animate={{
                      height: status === 'connected' ? [8, 16 + Math.random() * 36, 8] : 8,
                      opacity: status === 'connected' ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.6 + i * 0.04, repeat: Infinity, delay: i * 0.06 }}
                  />
                ))}
              </div>
              <p className="listening-text">
                {status === 'calling' ? 'Establishing connection…' : 'Vent is listening. And judging them, not you.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {lastCaption && (
                <motion.div
                  key={lastCaption}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="caption-bubble"
                >
                  {lastCaption}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="controls">
              <button className={`ctrl-btn ${isMuted ? 'muted' : ''}`} onClick={toggleMute}>
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
              <button className="ctrl-btn end-btn" onClick={endCall}>
                <PhoneOff size={22} />
              </button>
            </div>
            <p className="end-label">That's enough therapy</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .feature-view {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          width: fit-content;
          transition: color 0.2s;
        }
        .back-btn:hover { color: white; }

        .call-container {
          min-height: 560px;
          display: flex;
          flex-direction: column;
        }

        /* --- IDLE --- */
        .idle-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          text-align: center;
          padding: 3rem 2rem;
        }

        .vent-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: rgba(99,102,241,0.08);
          border: 1px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .vent-emoji { font-size: 2.5rem; }

        .idle-screen h2 {
          font-size: 2rem;
          font-weight: 700;
        }

        .idle-subtitle {
          color: rgba(255,255,255,0.55);
          max-width: 320px;
          line-height: 1.5;
        }

        .mic-denied {
          color: var(--accent);
          font-size: 0.85rem;
          max-width: 300px;
        }

        .demo-note {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
          max-width: 320px;
        }

        .start-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 2rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        /* --- CALL ACTIVE --- */
        .call-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem;
          gap: 1.5rem;
        }

        .call-top {
          width: 100%;
          text-align: center;
        }

        .live-row {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          animation: blink 1s infinite;
        }
        @keyframes blink { 50% { opacity: 0.3; } }

        .live-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--accent);
        }

        .timer {
          font-family: monospace;
          font-size: 1rem;
          opacity: 0.7;
        }

        .connecting-text {
          color: rgba(255,255,255,0.5);
          font-style: italic;
        }

        .waveform-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .waveform {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 64px;
        }

        .bar {
          width: 4px;
          background: linear-gradient(to top, var(--primary), var(--secondary));
          border-radius: 2px;
        }

        .listening-text {
          color: rgba(255,255,255,0.45);
          font-size: 0.875rem;
          font-style: italic;
          text-align: center;
        }

        .caption-bubble {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem;
          text-align: center;
          max-width: 400px;
          line-height: 1.5;
          color: rgba(255,255,255,0.85);
        }

        .controls {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .ctrl-btn {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ctrl-btn:hover { background: var(--glass-hover); }
        .ctrl-btn.muted {
          background: rgba(244,63,94,0.15);
          border-color: var(--accent);
        }
        .end-btn {
          background: var(--accent);
          border: none;
          width: 68px;
          height: 68px;
        }
        .end-btn:hover { background: #e11d48; transform: scale(1.05); }

        .end-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
          margin-top: -0.5rem;
        }
      `}</style>
    </motion.div>
  );
}
