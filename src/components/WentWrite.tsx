'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ArrowLeft, Check, AlertTriangle } from 'lucide-react';

interface WentWriteProps {
  onBack: () => void;
}

const TONES = [
  { emoji: '🙃', label: 'Corporate Hostage', desc: 'Maximum diplomacy, lawyer-approved' },
  { emoji: '🗡️', label: 'Polite Dagger', desc: 'Firm, no hedging, polite knife' },
  { emoji: '😇', label: 'Suspiciously Calm', desc: 'Neutral, flat — they sense something' },
  { emoji: '🤝', label: 'LinkedIn Influencer', desc: 'Warm, collaborative, slightly cringe' },
];

const LOADING_MESSAGES = [
  'Removing all the f-bombs…',
  'Consulting LinkedIn…',
  'Channeling middle management…',
  "Adding 'per my last email'…",
];

export default function WentWrite({ onBack }: WentWriteProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tone, setTone] = useState('Corporate Hostage');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hrFlag, setHrFlag] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleTransform = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setOutput('');
    setHrFlag(false);
    setError('');
    setLoadingMsgIdx(0);
    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, tone }),
      });
      const data = await res.json();
      if (data.error) {
        setError('Something went wrong. Try again.');
      } else {
        setOutput(data.polished);
        setHrFlag(!!data.hrFlag);
      }
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="feature-view"
    >
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      <div className="view-header">
        <h2 className="gradient-text">Went Write {'>'} Send</h2>
        <p>Type the version that would get you fired. We'll handle the rest.</p>
      </div>

      {/* Tone Selector */}
      <div className="tone-row">
        {TONES.map(t => (
          <button
            key={t.label}
            className={`tone-pill ${tone === t.label ? 'active' : ''}`}
            onClick={() => setTone(t.label)}
            title={t.desc}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="transformer-grid">
        {/* Input Panel */}
        <div className="panel glass-card">
          <div className="panel-header">
            <span className="label">Raw Rant</span>
            <span className="badge-red">Unfiltered</span>
          </div>
          <textarea
            placeholder="Type the version that would get you escorted out…"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <div className="panel-footer">
            <span className="char-count">{input.length} chars</span>
            <button
              className="btn-primary defuse-btn"
              onClick={handleTransform}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loadingMsgIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {LOADING_MESSAGES[loadingMsgIdx]}
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span>Defuse 💣</span>
              )}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="panel glass-card">
          <div className="panel-header">
            <span className="label">Polished Draft</span>
            {output && <span className="badge-green">Now you sound employable.</span>}
          </div>

          <div className="output-content">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-text">
                  {error}
                </motion.p>
              ) : output ? (
                <motion.p key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="polished-text">
                  {output}
                </motion.p>
              ) : (
                <p key="placeholder" className="placeholder">Your professional alibi will appear here.</p>
              )}
            </AnimatePresence>
          </div>

          {hrFlag && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="hr-banner"
            >
              <AlertTriangle size={16} />
              <span>⚠️ This sounds serious. Polish away — but maybe loop in HR for real.</span>
            </motion.div>
          )}

          <div className="panel-footer">
            <button className="btn-ghost steal-btn" onClick={copyToClipboard} disabled={!output}>
              {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
              <span>{copied ? 'Stolen ✓' : 'Steal it'}</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .feature-view {
          width: 100%;
          max-width: 1100px;
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
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          width: fit-content;
          transition: color 0.2s;
        }
        .back-btn:hover { color: white; }

        .view-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.4rem;
        }
        .view-header p {
          color: rgba(255,255,255,0.55);
          font-size: 1rem;
        }

        .tone-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .tone-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-size: 0.875rem;
          font-family: var(--font-heading);
          transition: all 0.2s;
        }
        .tone-pill:hover {
          border-color: var(--primary);
          color: white;
        }
        .tone-pill.active {
          background: rgba(99,102,241,0.15);
          border-color: var(--primary);
          color: white;
          font-weight: 600;
        }

        .transformer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          min-height: 420px;
        }

        .panel {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.6;
        }

        .badge-red {
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          background: rgba(244,63,94,0.1);
          color: var(--accent);
          border: 1px solid rgba(244,63,94,0.2);
        }

        .badge-green {
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          background: rgba(16,185,129,0.1);
          color: #10B981;
          border: 1px solid rgba(16,185,129,0.2);
        }

        textarea {
          flex: 1;
          background: transparent;
          border: none;
          resize: none;
          color: white;
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.65;
          padding: 0.5rem 0;
          outline: none;
          min-height: 250px;
        }
        textarea::placeholder { color: rgba(255,255,255,0.25); }

        .output-content {
          flex: 1;
          padding: 0.5rem 0;
          min-height: 250px;
        }

        .polished-text {
          font-size: 1rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.9);
        }

        .placeholder {
          color: rgba(255,255,255,0.25);
          font-style: italic;
          font-size: 0.95rem;
        }

        .error-text {
          color: var(--accent);
          font-size: 0.9rem;
        }

        .hr-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244,63,94,0.08);
          border: 1px solid rgba(244,63,94,0.25);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          color: #fca5a5;
          margin-bottom: 0.75rem;
        }

        .panel-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--glass-border);
        }

        .char-count {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
        }

        .defuse-btn {
          min-width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          font-size: 0.95rem;
        }
        .defuse-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .steal-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .steal-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        @media (max-width: 768px) {
          .transformer-grid { grid-template-columns: 1fr; }
          .tone-row { gap: 0.5rem; }
          .tone-pill { font-size: 0.8rem; padding: 0.4rem 0.75rem; }
        }
      `}</style>
    </motion.div>
  );
}
