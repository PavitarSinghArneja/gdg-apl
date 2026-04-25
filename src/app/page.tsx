'use client';

import { motion } from 'framer-motion';
import { MessageSquareText, PhoneCall, ArrowRight, Zap, ShieldCheck, HeartPulse } from 'lucide-react';
import { useState } from 'react';
import WentWrite from '@/components/WentWrite';
import RantRight from '@/components/RantRight';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<'none' | 'went-write' | 'rant-right'>('none');

  return (
    <main className="landing-container">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <nav className="nav">
        <div className="logo-container">
          <Zap className="logo-icon" size={24} />
          <span className="logo-text">Draft Without Damage</span>
        </div>
        <div className="nav-links">
          <button className="btn-ghost" onClick={() => setActiveFeature('none')}>Home</button>
          <button className="btn-primary">Get Started</button>
        </div>
      </nav>

      {activeFeature === 'none' && (
        <div className="hero-section">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <div className="badge">
              <HeartPulse size={14} />
              <span>Hackathon Winner Concept</span>
            </div>
            <h1 className="hero-title">
              Corporate Life is Hard. <br />
              <span className="gradient-text">Venting Should Be Easy.</span>
            </h1>
            <p className="hero-subtitle">
              Transform your raw rants into professional communications or vent safely with our witty AI companion. Because burnout shouldn't damage your career.
            </p>

            <div className="cta-grid">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="feature-card glass-card"
                onClick={() => setActiveFeature('went-write')}
              >
                <div className="card-icon-container purple">
                  <MessageSquareText size={32} />
                </div>
                <h3>Went Write {'>'} Send</h3>
                <p>Turn your unfiltered rants into Big 4 consulting gold. Professional, polished, and ready to send.</p>
                <div className="card-footer">
                  <span>Try Transformation</span>
                  <ArrowRight size={16} />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="feature-card glass-card"
                onClick={() => setActiveFeature('rant-right')}
              >
                <div className="card-icon-container blue">
                  <PhoneCall size={32} />
                </div>
                <h3>RantRight</h3>
                <p>Talk to an AI that actually gets you. Vent, yap, and laugh as the AI humorously curses your manager back.</p>
                <div className="card-footer">
                  <span>Start AI Call</span>
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <section className="features-strip">
            <div className="feature-item">
              <ShieldCheck size={20} />
              <span>100% Private Venting</span>
            </div>
            <div className="feature-item">
              <Zap size={20} />
              <span>Instant AI Polishing</span>
            </div>
            <div className="feature-item">
              <HeartPulse size={20} />
              <span>Burnout Protection</span>
            </div>
          </section>
        </div>
      )}

      {activeFeature === 'went-write' && (
        <WentWrite onBack={() => setActiveFeature('none')} />
      )}

      {activeFeature === 'rant-right' && (
        <RantRight onBack={() => setActiveFeature('none')} />
      )}

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          position: relative;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(80px);
          z-index: -1;
          opacity: 0.15;
        }

        .blob-1 {
          background: var(--primary);
          top: -100px;
          left: -100px;
          animation: float 20s infinite alternate;
        }

        .blob-2 {
          background: var(--secondary);
          bottom: -100px;
          right: -100px;
          animation: float 25s infinite alternate-reverse;
        }

        @keyframes float {
          from { transform: translate(0, 0); }
          to { transform: translate(100px, 100px); }
        }

        .nav {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          margin-bottom: 4rem;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-text {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .logo-icon {
          color: var(--primary);
        }

        .nav-links {
          display: flex;
          gap: 1rem;
        }

        .hero-section {
          width: 100%;
          max-width: 1200px;
          text-align: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.875rem;
          color: var(--primary);
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
          margin: 0 auto 4rem;
          line-height: 1.6;
        }

        .cta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 6rem;
        }

        .feature-card {
          padding: 3rem 2rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-icon-container {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-icon-container.purple {
          background: rgba(168, 85, 247, 0.1);
          color: var(--secondary);
        }

        .card-icon-container.blue {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
        }

        .feature-card h3 {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--foreground);
          font-weight: 600;
          font-family: var(--font-heading);
        }

        .features-strip {
          display: flex;
          justify-content: center;
          gap: 4rem;
          padding: 2rem;
          border-top: 1px solid var(--glass-border);
          width: 100%;
          opacity: 0.5;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .cta-grid {
            grid-template-columns: 1fr;
          }
          .features-strip {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }
        }
      `}</style>
    </main>
  );
}
