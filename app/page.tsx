"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // =========================
    // 1️⃣ SCROLL (parallax용)
    // =========================
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
  
    window.addEventListener("scroll", handleScroll);
  
    // =========================
    // 2️⃣ REVEAL / STAGGER
    // =========================
    const elements = document.querySelectorAll(".reveal, .stagger");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
  
          Array.from(children).forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("visible");
            }, i * 100);
          });
  
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    elements.forEach((el) => observer.observe(el));
  
    // =========================
    // 3️⃣ CLEANUP
    // =========================
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

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
        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          background: rgba(250,250,249,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          z-index: 100;
        }

        .nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 20px;
          color: var(--ink);
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .nav-logo span {
          color: var(--orange);
          font-style: italic;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          font-size: 14px;
          color: var(--ink-2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--ink); }

        .nav-btn {
          font-size: 14px;
          font-weight: 500;
          padding: 10px 20px;
          background: var(--ink);
          color: white;
          text-decoration: none;
          border-radius: 100px;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: var(--orange);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255,77,0,0.3);
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 40px 80px;
          position: relative;
          overflow: hidden;
        }

        /* Gradient mesh background */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(255,77,0,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(0,102,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,200,83,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 6px 16px 6px 8px;
          font-size: 13px;
          color: var(--ink-2);
          margin-bottom: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          animation: fadeUp 0.6s ease both;
        }

        .badge-dot {
          width: 8px; height: 8px;
          background: var(--green);
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 1.0;
          letter-spacing: -2px;
          margin-bottom: 24px;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .hero h1 em {
          font-style: italic;
          color: var(--orange);
        }

        .hero-sub {
          font-size: clamp(16px, 2vw, 20px);
          color: var(--ink-2);
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 48px;
          font-weight: 300;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .btn-main {
          font-size: 15px;
          font-weight: 500;
          padding: 14px 32px;
          background: var(--ink);
          color: white;
          text-decoration: none;
          border-radius: 100px;
          transition: all 0.25s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .btn-main:hover {
          background: var(--orange);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,77,0,0.35);
        }

        .btn-ghost {
          font-size: 15px;
          font-weight: 400;
          padding: 14px 32px;
          color: var(--ink-2);
          text-decoration: none;
          border-radius: 100px;
          border: 1px solid var(--border);
          transition: all 0.25s;
          background: var(--surface);
        }
        .btn-ghost:hover {
          border-color: var(--ink);
          color: var(--ink);
          transform: translateY(-2px);
        }

        /* ALERT CARD DEMO */
        .hero-card {
          margin-top: 80px;
          max-width: 640px;
          width: 100%;
          animation: fadeUp 0.6s 0.4s ease both;
        }

        .slack-preview {
          background: #1a1d21;
          border-radius: 16px;
          padding: 24px;
          text-align: left;
          box-shadow: 0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .slack-preview::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--orange), #ff9500, var(--blue));
        }

        .sp-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .sp-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--orange), #ff9500);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .sp-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        .sp-time {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-left: 4px;
        }

        .sp-alert {
          background: rgba(255,77,0,0.12);
          border: 1px solid rgba(255,77,0,0.3);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 12px;
        }

        .sp-alert-title {
          font-size: 13px;
          font-weight: 600;
          color: #ff7043;
          margin-bottom: 4px;
        }

        .sp-alert-body {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
        }

        .sp-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .sp-label {
          color: rgba(255,255,255,0.35);
          min-width: 80px;
          flex-shrink: 0;
        }

        .sp-val { color: rgba(255,255,255,0.8); }
        .sp-val.orange { color: var(--orange); }
        .sp-val.link { color: #4fa3e0; }

        .sp-scores {
          display: flex;
          gap: 12px;
          margin: 12px 0;
        }

        .score-chip {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 12px;
        }

        .score-chip-label {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .score-chip-val {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
        }

        .score-chip-val.danger { color: var(--orange); }
        .score-chip-val.viral { color: #ffb300; }

        .sp-reply {
          background: rgba(0,102,255,0.08);
          border-left: 2px solid var(--blue);
          border-radius: 0 6px 6px 0;
          padding: 12px 14px;
          margin-top: 12px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          font-style: italic;
        }

        .sp-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          background: rgba(255,77,0,0.15);
          border: 1px solid rgba(255,77,0,0.4);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--orange);
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .stat {
          background: var(--bg);
          padding: 48px 40px;
          text-align: center;
        }

        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 48px;
          color: var(--ink);
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-num em { color: var(--orange); font-style: normal; }

        .stat-label {
          font-size: 13px;
          color: var(--ink-3);
          font-weight: 400;
        }

        /* FEATURES */
        .features-section {
          padding: 120px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-eyebrow {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 5vw, 56px);
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 64px;
          color: var(--ink);
        }

        .section-title em { font-style: italic; color: var(--ink-2); }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }

        .feature {
          background: var(--surface);
          padding: 40px 36px;
          transition: background 0.3s;
        }

        .feature:hover { background: #fdf5f2; }

        .feature-emoji {
          font-size: 28px;
          margin-bottom: 20px;
          display: block;
        }

        .feature h3 {
          font-size: 16px;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .feature p {
          font-size: 14px;
          color: var(--ink-2);
          line-height: 1.7;
          font-weight: 300;
        }

        /* HOW IT WORKS */
        .how-section {
          padding: 120px 40px;
          background: var(--ink);
          position: relative;
          overflow: hidden;
        }

        .how-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 50% 60% at 10% 50%, rgba(255,77,0,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 90% 20%, rgba(0,102,255,0.08) 0%, transparent 60%);
        }

        .how-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .how-section .section-eyebrow { color: var(--orange); }
        .how-section .section-title { color: white; margin-bottom: 64px; }
        .how-section .section-title em { color: rgba(255,255,255,0.4); }

        .steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }

        .step {
          position: relative;
        }

        .step-num {
          font-family: 'Instrument Serif', serif;
          font-size: 72px;
          color: rgba(255,255,255,0.06);
          line-height: 1;
          margin-bottom: 16px;
          letter-spacing: -3px;
        }

        .step h3 {
          font-size: 16px;
          font-weight: 500;
          color: white;
          margin-bottom: 10px;
        }

        .step p {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          font-weight: 300;
        }

        .step-line {
          position: absolute;
          top: 36px;
          right: -20px;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.15), transparent);
        }

        /* PRICING */
        .pricing-section {
          padding: 120px 40px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 64px;
          text-align: left;
        }

        .plan {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 36px;
          transition: all 0.3s;
          position: relative;
        }

        .plan:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        }

        .plan.featured {
          background: var(--ink);
          border-color: var(--ink);
          color: white;
        }

        .plan.featured:hover {
          box-shadow: 0 20px 60px rgba(15,14,13,0.25);
        }

        .plan-badge {
          display: inline-block;
          background: var(--orange);
          color: white;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          margin-bottom: 16px;
        }

        .plan-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--ink-2);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .plan.featured .plan-name { color: rgba(255,255,255,0.5); }

        .plan-price {
          font-family: 'Instrument Serif', serif;
          font-size: 52px;
          letter-spacing: -2px;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 4px;
        }

        .plan.featured .plan-price { color: white; }

        .plan-period {
          font-size: 13px;
          color: var(--ink-3);
          margin-bottom: 28px;
        }

        .plan.featured .plan-period { color: rgba(255,255,255,0.35); }

        .plan-divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 24px;
        }

        .plan.featured .plan-divider { background: rgba(255,255,255,0.1); }

        .plan-features {
          list-style: none;
          margin-bottom: 32px;
        }

        .plan-features li {
          font-size: 14px;
          color: var(--ink-2);
          padding: 8px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 300;
        }

        .plan.featured .plan-features li { color: rgba(255,255,255,0.65); }

        .plan-features li::before {
          content: '✓';
          color: var(--green);
          font-weight: 600;
          font-size: 13px;
          flex-shrink: 0;
        }

        .plan-cta {
          display: block;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          padding: 13px;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.25s;
          border: 1px solid var(--border);
          color: var(--ink);
          background: var(--bg);
        }

        .plan-cta:hover {
          border-color: var(--ink);
          background: var(--ink);
          color: white;
        }

        .plan.featured .plan-cta {
          background: var(--orange);
          border-color: var(--orange);
          color: white;
        }

        .plan.featured .plan-cta:hover {
          background: #ff6a1a;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255,77,0,0.4);
        }

        /* CTA SECTION */
        .cta-section {
          padding: 160px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,77,0,0.06) 0%, transparent 70%);
        }

        .cta-section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(40px, 6vw, 72px);
          letter-spacing: -2px;
          line-height: 1.05;
          margin-bottom: 24px;
          position: relative;
        }

        .cta-section h2 em { font-style: italic; color: var(--orange); }

        .cta-section p {
          font-size: 17px;
          color: var(--ink-2);
          margin-bottom: 48px;
          font-weight: 300;
          position: relative;
        }

        /* FOOTER */
        footer {
          border-top: 1px solid var(--border);
          padding: 32px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 18px;
          color: var(--ink);
          text-decoration: none;
        }

        .footer-logo span { color: var(--orange); font-style: italic; }

        footer p {
          font-size: 13px;
          color: var(--ink-3);
        }

        /* REVEAL ANIMATIONS */
      .reveal {
       opacity: 1;
       transform: translateY(0);
       transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          nav { padding: 0 20px; }
          .hero { padding: 100px 20px 60px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; gap: 32px; }
          .pricing-grid { grid-template-columns: 1fr; }
          .features-section, .pricing-section { padding: 80px 20px; }
          .how-section { padding: 80px 20px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">HN<span>Monitor</span></a>
        <div className="nav-right">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="/register" className="nav-btn">Start Free →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Live monitoring active — 5 min scans
        </div>

        <h1>
           By the time you see it,<br/>
           it's already <em>viral.</em>
        </h1>

        <p className="hero-sub">
          Most founders find out too late.  
          We detect negative HN threads in the first 5 minutes, score the risk,  
         and give you a reply before it explodes.
       </p>

        <div className="hero-actions">
        <div style={{
  marginTop: "16px",
  fontSize: "13px",
  color: "#6b6966"
}}>
  🔥 17 founders got alerts in the last 10 minutes
</div>
        <a href="/register" className="btn-main">
          Stop the next viral thread →
        </a>

          <a href="#demo" className="btn-ghost">See live alert ↓</a>
        </div>

        <div className="hero-card" id="demo">
          <div className="slack-preview">
            <div className="sp-header">
              <div className="sp-icon">⚠️</div>
              <div>
                <span className="sp-name">HN Monitor</span>
                <span className="sp-time">Today at 9:14 AM</span>
              </div>
            </div>

            <div className="sp-alert">
              <div className="sp-alert-title">🚨 Negative thread gaining traction fast</div>
              <div className="sp-alert-body">Why I stopped recommending [YourProduct] to my entire team</div>
            </div>

            <div className="sp-row">
              <span className="sp-label">Age</span>
              <span className="sp-val orange">18 min old — act now</span>
            </div>
            <div className="sp-row">
              <span className="sp-label">Link</span>
              <span className="sp-val link">news.ycombinator.com/item?id=...</span>
            </div>

            <div className="sp-scores">
              <div className="score-chip">
                <div className="score-chip-label">Risk Score</div>
                <div className="score-chip-val danger">9/10</div>
              </div>
              <div className="score-chip">
                <div className="score-chip-label">Viral Score</div>
                <div className="score-chip-val viral">8/10</div>
              </div>
              <div className="score-chip">
                <div className="score-chip-label">Upvotes</div>
                <div className="score-chip-val">120</div>
              </div>
            </div>

            <div className="sp-reply">
              Hey, founder here. This is valid feedback and I want to address it directly. We shipped a breaking change without enough notice — that was our mistake. Here is what we are fixing.
            </div>

            <div className="sp-action">⚡ Action: Respond NOW</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats reveal">
        {[
          ["5min", "Early detection"],
          ["9/10", "Risk scoring"],
          ["< 30s", "Reply drafted"],
          ["$0", "To get started"],
        ].map(([num, label]) => (
          <div className="stat" key={label}>
            <div className="stat-num">{num.includes("9") ? <><em>9</em>/10</> : num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-eyebrow reveal">Features</div>
        <h2 className="section-title reveal">
          Everything you need<br/>
          to <em>stay ahead.</em>
        </h2>

        <div className="features-grid reveal">
          {[
            ["🚨", "Risk Score (1–10)", "Know instantly if a post threatens your brand. Score 8+ triggers an immediate Slack alert with action required."],
            ["📈", "Viral Score (1–10)", "Predict if a post will blow up before it does. Catch opportunity threads early, not just negative ones."],
            ["💬", "HN-Style Reply Draft", "AI writes in authentic founder tone — not PR speak. Paste and send in seconds."],
            ["⚡", "5-Min Early Detection", "Catch threads before they gain momentum. The first 30 minutes on HN are everything."],
            ["🥊", "Competitor Radar", "Monitor what HN says about your competitors. Turn their bad press into your opportunity."],
            ["🔔", "Slack-Native", "Zero new dashboards. Full context lands directly in your team Slack."],
          ].map(([icon, title, desc]) => (
            <div className="feature" key={title as string}>
              <span className="feature-emoji">{icon}</span>
              <h3>{title as string}</h3>
              <p>{desc as string}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-inner">
          <div className="section-eyebrow reveal">How it works</div>
          <h2 className="section-title reveal">
            Up and running<br/>
            <em>in 2 minutes.</em>
          </h2>

          <div className="steps reveal">
            {[
              ["01", "Set keywords", "Enter your brand name, product, competitors. We watch HN 24/7 so you don't have to."],
              ["02", "Early detection", "Our engine scans HN every 5 minutes — catching posts before they gain traction."],
              ["03", "AI scores the risk", "LLaMA 3.3 rates Risk (1–10) and Viral potential (1–10) for every matched post."],
              ["04", "Reply in 30 sec", "Get a founder-style draft ready to paste. Respond before the thread blows up."],
            ].map(([num, title, desc], i) => (
              <div className="step" key={num as string}>
                {i < 3 && <div className="step-line"></div>}
                <div className="step-num">{num}</div>
                <h3>{title as string}</h3>
                <p>{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
      <p style={{
  marginTop: "-40px",
  marginBottom: "40px",
  color: "#6b6966"
}}>
  One missed thread can cost you thousands in churn.
</p>
        <div className="section-eyebrow reveal">Pricing</div>
        <h2 className="section-title reveal">
          Simple pricing,<br/>
          <em>no surprises.</em>
        </h2>

        <div className="pricing-grid reveal">
          <div className="plan">
            <div className="plan-name">Free</div>
            <div className="plan-price">$0</div>
            <div className="plan-period">forever</div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li>3 keywords</li>
              <li>100 alerts / month</li>
              <li>Risk + Viral scoring</li>
              <li>Slack integration</li>
            </ul>
            <a href="/register" className="plan-cta">Get started free</a>
          </div>

          <div className="plan featured">
            <div className="plan-badge">Most popular</div>
            <div className="plan-name">Starter</div>
            <div className="plan-price">$29</div>
            <div className="plan-period">per month</div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li>20 keywords</li>
              <li>Unlimited alerts</li>
              <li>HN reply drafts</li>
              <li>Competitor radar</li>
              <li>Priority support</li>
            </ul>
            <a href="/register" className="plan-cta">Start free trial</a>
          </div>

          <div className="plan">
            <div className="plan-name">Pro</div>
            <div className="plan-price">$79</div>
            <div className="plan-period">per month</div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li>Unlimited keywords</li>
              <li>Reddit + HN + Twitter</li>
              <li>Team dashboard</li>
              <li>API access</li>
              <li>Custom alert rules</li>
            </ul>
            <a href="/register" className="plan-cta">Go pro</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
      <h2>
        The next viral thread<br/>
         could be about <em>you.</em>
      </h2>
        <p>Set up in 2 minutes. Free forever. No credit card.</p>
        <a href="/register" className="btn-main">
  Get alerts before it blows up →
</a>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="/" className="footer-logo">HN<span>Monitor</span></a>
        <p>© 2025 HN Monitor. Built for founders who move fast.</p>
      </footer>
    </>
  );
}