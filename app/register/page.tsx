"use client";

import { FormEvent, useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [keywords, setKeywords] = useState("");
  const [competitorKeywords, setCompetitorKeywords] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, keywords, slackWebhook, competitorKeywords }),
      });
      const data: { message?: string; error?: string } = await response.json();
      if (!response.ok) {
        setError(data.error ?? "An error occurred.");
        return;
      }
      setMessage(data.message ?? "Monitoring started!");
      setStep(3);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        :root {
          --bg: #fafaf9;
          --ink: #0f0e0d;
          --ink-2: #6b6966;
          --ink-3: #b5b2ae;
          --orange: #ff4d00;
          --blue: #0066ff;
          --green: #00c853;
          --surface: #ffffff;
          --border: rgba(15,14,13,0.08);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: var(--bg);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 60% at 10% 10%, rgba(255,77,0,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 90% 90%, rgba(0,102,255,0.05) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .page {
          min-height: 100vh;
          display: flex;
          position: relative;
          z-index: 1;
        }

        /* LEFT PANEL */
        .left {
          width: 420px;
          flex-shrink: 0;
          background: var(--ink);
          padding: 48px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 0% 40%, rgba(255,77,0,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 100% 80%, rgba(0,102,255,0.1) 0%, transparent 60%);
        }

        .left-inner {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .left-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 20px;
          color: white;
          text-decoration: none;
          margin-bottom: 60px;
          display: block;
        }

        .left-logo span { color: var(--orange); font-style: italic; }

        .left h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          color: white;
          line-height: 1.2;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }

        .left h2 em { font-style: italic; color: rgba(255,255,255,0.45); }

        .left-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 48px;
        }

        .left-benefits {
          list-style: none;
          flex: 1;
        }

        .left-benefits li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          font-weight: 300;
          line-height: 1.5;
          animation: slideIn 0.5s ease both;
        }

        .left-benefits li:nth-child(1) { animation-delay: 0.1s; }
        .left-benefits li:nth-child(2) { animation-delay: 0.2s; }
        .left-benefits li:nth-child(3) { animation-delay: 0.3s; }
        .left-benefits li:nth-child(4) { animation-delay: 0.4s; }
        .left-benefits li:nth-child(5) { animation-delay: 0.5s; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .benefit-icon {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .left-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 12px;
          color: rgba(255,255,255,0.25);
        }

        /* RIGHT PANEL */
        .right {
          flex: 1;
          padding: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .form-container {
          width: 100%;
          max-width: 480px;
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* PROGRESS */
        .progress {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 40px;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--ink-3);
        }

        .progress-step.active { color: var(--ink); }
        .progress-step.done { color: var(--green); }

        .progress-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          color: var(--ink-3);
          transition: all 0.3s;
        }

        .progress-step.active .progress-dot {
          border-color: var(--orange);
          background: var(--orange);
          color: white;
        }

        .progress-step.done .progress-dot {
          border-color: var(--green);
          background: var(--green);
          color: white;
        }

        .progress-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* FORM */
        .form-title {
          font-family: 'Instrument Serif', serif;
          font-size: 32px;
          letter-spacing: -1px;
          color: var(--ink);
          margin-bottom: 6px;
        }

        .form-sub {
          font-size: 14px;
          color: var(--ink-2);
          margin-bottom: 36px;
          font-weight: 300;
        }

        .field {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .label-optional {
          font-size: 11px;
          font-weight: 400;
          color: var(--ink-3);
          margin-left: 6px;
        }

        .input {
          width: 100%;
          padding: 13px 16px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          outline: none;
          transition: all 0.2s;
        }

        .input:focus {
          border-color: var(--orange);
          box-shadow: 0 0 0 3px rgba(255,77,0,0.08);
        }

        .input::placeholder { color: var(--ink-3); }

        textarea.input {
          resize: none;
          min-height: 80px;
          line-height: 1.6;
        }

        .hint {
          font-size: 12px;
          color: var(--ink-3);
          margin-top: 6px;
          line-height: 1.5;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .divider-label {
          font-size: 12px;
          color: var(--ink-3);
          white-space: nowrap;
        }

        .competitor-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff5f0;
          border: 1px solid rgba(255,77,0,0.15);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 500;
          color: var(--orange);
          margin-bottom: 10px;
        }

        .submit {
          width: 100%;
          padding: 15px;
          background: var(--ink);
          color: white;
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s;
          margin-top: 8px;
        }

        .submit:hover:not(:disabled) {
          background: var(--orange);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,77,0,0.3);
        }

        .submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .back-link {
          display: block;
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: var(--ink-3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover { color: var(--ink); }

        /* SUCCESS STATE */
        .success-state {
          text-align: center;
          animation: fadeUp 0.5s ease both;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #00c853, #00e676);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 24px;
          box-shadow: 0 8px 32px rgba(0,200,83,0.3);
        }

        .success-state h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 32px;
          letter-spacing: -1px;
          margin-bottom: 12px;
        }

        .success-state p {
          font-size: 15px;
          color: var(--ink-2);
          line-height: 1.6;
          margin-bottom: 32px;
          font-weight: 300;
        }

        .error-msg {
          background: #fff5f5;
          border: 1px solid rgba(255,0,0,0.15);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #d32f2f;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .page { flex-direction: column; }
          .left { width: 100%; padding: 32px 24px; }
          .left-benefits { display: none; }
          .right { padding: 32px 24px; }
        }
      `}</style>

      <div className="page">
        {/* LEFT */}
        <div className="left">
          <div className="left-inner">
            <a href="/" className="left-logo">HN<span>Monitor</span></a>

            <h2>
              Start protecting<br/>
              your brand <em>today.</em>
            </h2>
            <p className="left-sub">
              Join founders who respond to HN mentions in under 30 seconds — before the damage spreads.
            </p>

            <ul className="left-benefits">
              {[
                ["⚡", "5-minute early detection — catch threads before they blow up"],
                ["📊", "Risk & Viral scoring — know exactly what needs action"],
                ["💬", "HN-style reply draft — paste and send in seconds"],
                ["🥊", "Competitor radar — turn their bad press into your win"],
                ["🔔", "Slack-native — zero new dashboards to check"],
              ].map(([icon, text]) => (
                <li key={text as string}>
                  <div className="benefit-icon">{icon}</div>
                  {text as string}
                </li>
              ))}
            </ul>

            <div className="left-footer">
              Free forever. No credit card required.
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="form-container">

            {step === 3 ? (
              <div className="success-state">
                <div className="success-icon">✓</div>
                <h2>You&apos;re all set!</h2>
                <p>
                  Your monitor is now active. We&apos;ll scan Hacker News every 5 minutes
                  and alert your Slack when something needs attention.
                </p>
                <a href="/" className="submit" style={{display:"block", textDecoration:"none", textAlign:"center"}}>
                  Back to home
                </a>
              </div>
            ) : (
              <>
                <div className="progress">
                  <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
                    <div className="progress-dot">1</div>
                  </div>
                  <div className="progress-line"></div>
                  <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
                    <div className="progress-dot">2</div>
                  </div>
                  <div className="progress-line"></div>
                  <div className={`progress-step ${step >= 3 ? "done" : ""}`}>
                    <div className="progress-dot">✓</div>
                  </div>
                </div>

                <h1 className="form-title">
                  {step === 1 ? "Set up your monitor" : "Connect Slack"}
                </h1>
                <p className="form-sub">
                  {step === 1
                    ? "Enter keywords to watch on Hacker News"
                    : "Where should we send your alerts?"}
                </p>

                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <>
                      <div className="field">
                        <label className="label">Email</label>
                        <input
                          className="input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          required
                        />
                      </div>

                      <div className="field">
                        <label className="label">Brand Keywords</label>
                        <textarea
                          className="input"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="your-brand, your-product, your-name"
                          required
                        />
                        <p className="hint">Separate with commas. We&apos;ll alert you when these appear on HN.</p>
                      </div>

                      <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-label">Optional</span>
                        <div className="divider-line"></div>
                      </div>

                      <div className="field">
                        <div className="competitor-tag">🥊 Competitor Radar</div>
                        <label className="label">
                          Competitor Keywords
                          <span className="label-optional">optional</span>
                        </label>
                        <textarea
                          className="input"
                          value={competitorKeywords}
                          onChange={(e) => setCompetitorKeywords(e.target.value)}
                          placeholder="zendesk, intercom, freshdesk"
                        />
                        <p className="hint">Monitor HN mentions of your competitors — turn their bad press into opportunity.</p>
                      </div>

                      <button
                        type="button"
                        className="submit"
                        onClick={() => {
                          if (!email || !keywords) return;
                          setStep(2);
                        }}
                      >
                        Continue →
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="field">
                        <label className="label">Slack Webhook URL</label>
                        <input
                          className="input"
                          type="url"
                          value={slackWebhook}
                          onChange={(e) => setSlackWebhook(e.target.value)}
                          placeholder="https://hooks.slack.com/services/..."
                          required
                        />
                        <p className="hint">
                          Get your webhook URL from{" "}
                          <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" style={{color:"var(--orange)"}}>
                            api.slack.com/apps
                          </a>
                        </p>
                      </div>

                      <button type="submit" className="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Activating..." : "Activate Monitor →"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="back-link"
                        style={{background:"none",border:"none",cursor:"pointer",width:"100%"}}
                      >
                        ← Back
                      </button>

                      {error && <div className="error-msg">✗ {error}</div>}
                    </>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}