"use client";

import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function TypingCard() {
  const [phase, setPhase] = useState(0);
  const [text, setText] = useState("");
  const fullText = "Hey, founder here. This is valid feedback and I want to address it directly. We shipped a breaking change without enough notice — that was our mistake. Here is what we are fixing.";

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 800));
    timers.push(setTimeout(() => setPhase(2), 1600));
    timers.push(setTimeout(() => setPhase(3), 2400));
    timers.push(setTimeout(() => {
      setPhase(4);
      let i = 0;
      const interval = setInterval(() => {
        setText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 18);
      timers.push(interval as unknown as ReturnType<typeof setTimeout>);
    }, 3200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="slack-preview">
      <div className="sp-header">
        <div className="sp-icon">⚠️</div>
        <div>
          <span className="sp-name">RespondAI</span>
          <span className="sp-time">Just now</span>
        </div>
        {phase >= 1 && <div className="sp-live">● LIVE</div>}
      </div>
      {phase >= 1 && (
        <div className="sp-alert" style={{animation:"fadeIn 0.4s ease"}}>
          <div className="sp-alert-title">🚨 Negative thread gaining traction fast</div>
          <div className="sp-alert-body">Why I stopped recommending [YourProduct] to my entire team</div>
        </div>
      )}
      {phase >= 2 && (
        <div style={{animation:"fadeIn 0.4s ease"}}>
          <div className="sp-row"><span className="sp-label">Age</span><span className="sp-val orange">18 min old — act now</span></div>
          <div className="sp-row"><span className="sp-label">Link</span><span className="sp-val link">news.ycombinator.com/item?id=...</span></div>
        </div>
      )}
      {phase >= 3 && (
        <div className="sp-scores" style={{animation:"fadeIn 0.4s ease"}}>
          <div className="score-chip">
            <div className="score-chip-label">Risk Score</div>
            <div className="score-chip-val danger">9/10</div>
            <div className="score-bar-bg"><div className="score-bar-fill danger" style={{width:"90%"}}></div></div>
          </div>
          <div className="score-chip">
            <div className="score-chip-label">Viral Score</div>
            <div className="score-chip-val viral">8/10</div>
            <div className="score-bar-bg"><div className="score-bar-fill viral" style={{width:"80%"}}></div></div>
          </div>
          <div className="score-chip">
            <div className="score-chip-label">Upvotes</div>
            <div className="score-chip-val">120</div>
          </div>
        </div>
      )}
      {phase >= 4 && (
        <div style={{animation:"fadeIn 0.4s ease"}}>
          <div className="sp-reply">
            {text}<span className="cursor-blink">|</span>
          </div>
          <div className="sp-action">⚡ Action: Respond NOW</div>
        </div>
      )}
    </div>
  );
}

function StatsSection() {
  const { ref, inView } = useInView();
  const risk = useCountUp(9, 1200, inView);
  const viral = useCountUp(8, 1400, inView);
  const upvotes = useCountUp(120, 1600, inView);

  return (
    <div className="stats" ref={ref}>
      <div className="stat">
        <div className="stat-num">5<span style={{fontSize:"24px",color:"var(--ink-3)"}}>min</span></div>
        <div className="stat-label">Early detection</div>
      </div>
      <div className="stat">
        <div className="stat-num" style={{color:"var(--red)"}}>{risk}<span style={{fontSize:"24px",color:"var(--ink-3)"}}>/10</span></div>
        <div className="stat-label">Risk scoring</div>
      </div>
      <div className="stat">
        <div className="stat-num" style={{color:"var(--emerald)"}}>{viral}<span style={{fontSize:"24px",color:"var(--ink-3)"}}>/10</span></div>
        <div className="stat-label">Viral detection</div>
      </div>
      <div className="stat">
        <div className="stat-num">{upvotes}</div>
        <div className="stat-label">Upvotes tracked live</div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="faq-q">
        <span>{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </div>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        :root{
          --bg:#fafaf9;--ink:#0f0e0d;--ink-2:#6b6966;--ink-3:#b5b2ae;
          --orange:#ff4d00;--blue:#0066ff;--green:#00c853;
          --red:#dc2626;--emerald:#059669;
          --surface:#ffffff;--border:rgba(15,14,13,0.08);
        }
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
        .cursor-blink{animation:blink 1s infinite;color:var(--orange);}
        nav{position:fixed;top:0;left:0;right:0;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;background:rgba(250,250,249,0.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);z-index:100;}
        .nav-logo{font-family:'Instrument Serif',serif;font-size:20px;color:var(--ink);text-decoration:none;}
        .nav-logo span{color:var(--orange);font-style:italic;}
        .nav-right{display:flex;align-items:center;gap:24px;}
        .nav-link{font-size:14px;color:var(--ink-2);text-decoration:none;transition:color 0.2s;}
        .nav-link:hover{color:var(--ink);}
        .nav-btn{font-size:14px;font-weight:500;padding:10px 20px;background:var(--ink);color:white;text-decoration:none;border-radius:100px;transition:all 0.2s;}
        .nav-btn:hover{background:var(--orange);transform:translateY(-1px);box-shadow:0 8px 24px rgba(255,77,0,0.3);}
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 40px 80px;position:relative;overflow:hidden;}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 20%,rgba(255,77,0,0.07) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 80% 80%,rgba(0,102,255,0.05) 0%,transparent 60%);pointer-events:none;}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:6px 16px 6px 8px;font-size:13px;color:var(--ink-2);margin-bottom:40px;box-shadow:0 2px 8px rgba(0,0,0,0.06);animation:fadeIn 0.6s ease both;}
        .badge-dot{width:8px;height:8px;background:var(--green);border-radius:50%;animation:blink 2s infinite;}
        .hero h1{font-family:'Instrument Serif',serif;font-size:clamp(48px,8vw,96px);line-height:1.0;letter-spacing:-2px;margin-bottom:24px;animation:fadeIn 0.6s 0.1s ease both;}
        .hero h1 em{font-style:italic;color:var(--orange);}
        .hero-sub{font-size:clamp(16px,2vw,20px);color:var(--ink-2);max-width:560px;line-height:1.7;margin-bottom:48px;font-weight:300;animation:fadeIn 0.6s 0.2s ease both;}
        .hero-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;animation:fadeIn 0.6s 0.3s ease both;}
        .btn-main{font-size:15px;font-weight:500;padding:14px 32px;background:var(--ink);color:white;text-decoration:none;border-radius:100px;transition:all 0.25s;box-shadow:0 4px 16px rgba(0,0,0,0.12);}
        .btn-main:hover{background:var(--orange);transform:translateY(-2px);box-shadow:0 12px 32px rgba(255,77,0,0.35);}
        .btn-ghost{font-size:15px;padding:14px 32px;color:var(--ink-2);text-decoration:none;border-radius:100px;border:1px solid var(--border);transition:all 0.25s;background:var(--surface);}
        .btn-ghost:hover{border-color:var(--ink);color:var(--ink);}
        .hero-card{margin-top:72px;max-width:640px;width:100%;animation:fadeIn 0.6s 0.4s ease both;}
        .slack-preview{background:#1a1d21;border-radius:16px;padding:24px;text-align:left;box-shadow:0 32px 80px rgba(0,0,0,0.2);position:relative;overflow:hidden;min-height:120px;}
        .slack-preview::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--red),var(--orange),var(--emerald));}
        .sp-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;}
        .sp-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--orange),#ff9500);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
        .sp-name{font-size:14px;font-weight:600;color:#fff;}
        .sp-time{font-size:11px;color:rgba(255,255,255,0.3);margin-left:4px;}
        .sp-live{margin-left:auto;font-size:11px;color:var(--green);font-weight:600;animation:pulse 1.5s infinite;}
        .sp-alert{background:rgba(220,38,38,0.12);border:1px solid rgba(220,38,38,0.3);border-radius:8px;padding:12px 16px;margin-bottom:12px;}
        .sp-alert-title{font-size:13px;font-weight:600;color:#f87171;margin-bottom:4px;}
        .sp-alert-body{font-size:13px;color:rgba(255,255,255,0.7);line-height:1.5;}
        .sp-row{display:flex;gap:8px;margin-bottom:8px;font-size:13px;}
        .sp-label{color:rgba(255,255,255,0.35);min-width:80px;flex-shrink:0;}
        .sp-val{color:rgba(255,255,255,0.8);}
        .sp-val.orange{color:var(--orange);}
        .sp-val.link{color:#60a5fa;}
        .sp-scores{display:flex;gap:12px;margin:12px 0;}
        .score-chip{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;}
        .score-chip-label{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
        .score-chip-val{font-size:22px;font-weight:700;color:#fff;margin-bottom:6px;}
        .score-chip-val.danger{color:#f87171;}
        .score-chip-val.viral{color:#34d399;}
        .score-bar-bg{height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;}
        .score-bar-fill{height:100%;border-radius:2px;animation:fadeIn 0.8s ease both;}
        .score-bar-fill.danger{background:var(--red);}
        .score-bar-fill.viral{background:var(--emerald);}
        .sp-reply{background:rgba(0,102,255,0.08);border-left:2px solid var(--blue);border-radius:0 6px 6px 0;padding:12px 14px;margin-top:12px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;font-style:italic;min-height:40px;}
        .sp-action{display:inline-flex;align-items:center;gap:6px;margin-top:12px;background:rgba(255,77,0,0.15);border:1px solid rgba(255,77,0,0.4);border-radius:6px;padding:6px 12px;font-size:12px;font-weight:600;color:var(--orange);}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .stat{background:var(--bg);padding:48px 40px;text-align:center;}
        .stat-num{font-family:'Instrument Serif',serif;font-size:48px;color:var(--ink);letter-spacing:-2px;line-height:1;margin-bottom:8px;}
        .stat-label{font-size:13px;color:var(--ink-3);}
        .section{padding:120px 40px;max-width:1100px;margin:0 auto;}
        .section-eyebrow{font-size:12px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--orange);margin-bottom:16px;}
        .section-title{font-family:'Instrument Serif',serif;font-size:clamp(36px,5vw,56px);letter-spacing:-1.5px;line-height:1.1;margin-bottom:64px;}
        .section-title em{font-style:italic;color:var(--ink-2);}
        .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--border);border:1px solid var(--border);}
        .feature{background:var(--surface);padding:40px 36px;transition:background 0.3s;}
        .feature:hover{background:#fdf5f2;}
        .feature-emoji{font-size:28px;margin-bottom:20px;display:block;}
        .feature h3{font-size:16px;font-weight:500;color:var(--ink);margin-bottom:10px;}
        .feature p{font-size:14px;color:var(--ink-2);line-height:1.7;font-weight:300;}
        .how-section{padding:120px 40px;background:var(--ink);position:relative;overflow:hidden;}
        .how-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 60% at 10% 50%,rgba(255,77,0,0.12) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 90% 20%,rgba(0,102,255,0.08) 0%,transparent 60%);}
        .how-inner{max-width:1100px;margin:0 auto;position:relative;z-index:1;}
        .how-section .section-eyebrow{color:var(--orange);}
        .how-section .section-title{color:white;}
        .how-section .section-title em{color:rgba(255,255,255,0.4);}
        .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;}
        .step-num{font-family:'Instrument Serif',serif;font-size:72px;color:rgba(255,255,255,0.06);line-height:1;margin-bottom:16px;}
        .step h3{font-size:16px;font-weight:500;color:white;margin-bottom:10px;}
        .step p{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;font-weight:300;}
        .social-proof{padding:80px 40px;border-bottom:1px solid var(--border);background:var(--surface);}
        .social-inner{max-width:1100px;margin:0 auto;}
        .social-label{font-size:12px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--ink-3);text-align:center;margin-bottom:48px;}
        .testimonials{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
        .testimonial{background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:28px;}
        .testimonial-text{font-size:15px;color:var(--ink-2);line-height:1.7;font-weight:300;margin-bottom:20px;font-style:italic;}
        .testimonial-author{display:flex;align-items:center;gap:12px;}
        .testimonial-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--orange),#ff9500);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:white;flex-shrink:0;}
        .testimonial-name{font-size:14px;font-weight:500;color:var(--ink);}
        .testimonial-role{font-size:12px;color:var(--ink-3);}
        .pricing-section{padding:120px 40px;max-width:1100px;margin:0 auto;text-align:center;}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:64px;text-align:left;}
        .plan{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:36px;transition:all 0.3s;position:relative;}
        .plan:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,0.08);}
        .plan.featured{background:var(--ink);border-color:var(--ink);}
        .plan.featured:hover{box-shadow:0 20px 60px rgba(15,14,13,0.25);}
        .plan-badge{display:inline-block;background:var(--orange);color:white;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:100px;margin-bottom:16px;}
        .plan-name{font-size:13px;font-weight:500;color:var(--ink-2);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
        .plan.featured .plan-name{color:rgba(255,255,255,0.5);}
        .plan-price{font-family:'Instrument Serif',serif;font-size:52px;letter-spacing:-2px;color:var(--ink);line-height:1;margin-bottom:4px;}
        .plan.featured .plan-price{color:white;}
        .plan-period{font-size:13px;color:var(--ink-3);margin-bottom:28px;}
        .plan.featured .plan-period{color:rgba(255,255,255,0.35);}
        .plan-divider{height:1px;background:var(--border);margin-bottom:24px;}
        .plan.featured .plan-divider{background:rgba(255,255,255,0.1);}
        .plan-features{list-style:none;margin-bottom:32px;}
        .plan-features li{font-size:14px;color:var(--ink-2);padding:8px 0;display:flex;align-items:center;gap:10px;font-weight:300;border-bottom:1px solid var(--border);}
        .plan.featured .plan-features li{color:rgba(255,255,255,0.65);border-color:rgba(255,255,255,0.06);}
        .plan-features li::before{content:'✓';color:var(--emerald);font-weight:600;font-size:13px;flex-shrink:0;}
        .plan-cta{display:block;text-align:center;font-size:14px;font-weight:500;padding:13px;border-radius:100px;text-decoration:none;transition:all 0.25s;border:1px solid var(--border);color:var(--ink);background:var(--bg);}
        .plan-cta:hover{border-color:var(--ink);background:var(--ink);color:white;}
        .plan.featured .plan-cta{background:var(--orange);border-color:var(--orange);color:white;}
        .plan.featured .plan-cta:hover{background:#ff6a1a;box-shadow:0 8px 24px rgba(255,77,0,0.4);}
        .faq-section{padding:120px 40px;max-width:720px;margin:0 auto;}
        .faq-list{margin-top:48px;}
        .faq-item{border-bottom:1px solid var(--border);padding:20px 0;cursor:pointer;transition:all 0.2s;}
        .faq-item:first-child{border-top:1px solid var(--border);}
        .faq-q{display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:16px;font-weight:500;color:var(--ink);}
        .faq-icon{color:var(--orange);font-size:20px;flex-shrink:0;font-weight:300;}
        .faq-a{font-size:14px;color:var(--ink-2);line-height:1.7;font-weight:300;margin-top:12px;padding-right:32px;}
        .cta-section{padding:160px 40px;text-align:center;position:relative;overflow:hidden;}
        .cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(255,77,0,0.06) 0%,transparent 70%);}
        .cta-section h2{font-family:'Instrument Serif',serif;font-size:clamp(40px,6vw,72px);letter-spacing:-2px;line-height:1.05;margin-bottom:24px;position:relative;}
        .cta-section h2 em{font-style:italic;color:var(--orange);}
        .cta-section p{font-size:17px;color:var(--ink-2);margin-bottom:48px;font-weight:300;position:relative;}
        footer{border-top:1px solid var(--border);padding:32px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
        .footer-logo{font-family:'Instrument Serif',serif;font-size:18px;color:var(--ink);text-decoration:none;}
        .footer-logo span{color:var(--orange);font-style:italic;}
        footer p{font-size:13px;color:var(--ink-3);}
        .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1);}
        .reveal.visible{opacity:1;transform:translateY(0);}
        @media(max-width:768px){
          nav{padding:0 20px;}
          .hero{padding:100px 20px 60px;}
          .stats{grid-template-columns:repeat(2,1fr);}
          .features-grid,.steps,.testimonials,.pricing-grid{grid-template-columns:1fr;}
          .section,.faq-section,.pricing-section{padding:80px 20px;}
          .how-section{padding:80px 20px;}
          .social-proof{padding:60px 20px;}
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">Respond<span>AI</span></a>
        <div className="nav-right">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="/login" className="nav-btn">Start Free →</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Live monitoring active — 5 min scans
        </div>
        <h1>Respond before<br/>it <em>goes viral.</em></h1>
        <p className="hero-sub">
          HN threads move fast. One negative post can hit 200 upvotes in 30 minutes.
          We detect it early, score the risk, and draft your reply — before the damage spreads.
        </p>
        <div className="hero-actions">
          <a href="/login" className="btn-main">Protect My Brand Free</a>
          <a href="#demo" className="btn-ghost">See live alert ↓</a>
        </div>
        <div className="hero-card" id="demo">
          <TypingCard />
        </div>
      </section>

      <StatsSection />

      <div className="social-proof reveal">
        <div className="social-inner">
          <div className="social-label">What founders are saying</div>
          <div className="testimonials">
            {[
              ["S","A negative HN thread about our pricing hit 180 upvotes in 20 minutes. RespondAI caught it at 12 upvotes. We responded before it blew up.","Sarah K.","Founder, DevToolsCo"],
              ["M","The reply draft is scarily good. It sounds exactly like how I'd actually respond on HN. Saved me from a PR disaster twice this month.","Marcus L.","CEO, SaaSBuilder"],
              ["J","I used to check HN manually every hour. Now I just wait for the Slack ping. It's changed how I handle community management completely.","James R.","Indie Hacker"],
            ].map(([avatar,text,name,role])=>(
              <div className="testimonial" key={name as string}>
                <div className="testimonial-text">&ldquo;{text as string}&rdquo;</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{avatar}</div>
                  <div>
                    <div className="testimonial-name">{name as string}</div>
                    <div className="testimonial-role">{role as string}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section" id="features">
        <div className="section-eyebrow reveal">Features</div>
        <h2 className="section-title reveal">Everything you need<br/>to <em>stay ahead.</em></h2>
        <div className="features-grid reveal">
          {[
            ["🚨","Risk Score (1–10)","Know instantly if a post threatens your brand. Score 8+ triggers an immediate alert. Powered by deep red severity indicators."],
            ["📈","Viral Score (1–10)","Predict if a post will blow up before it does. Emerald scoring shows opportunity threads, not just threats."],
            ["💬","HN-Style Reply Draft","AI writes in authentic founder tone — direct, no PR speak. Paste and send in under 30 seconds."],
            ["⚡","5-Min Early Detection","Catch threads before they gain momentum. The first 30 minutes on HN are everything."],
            ["🥊","Competitor Radar","Monitor what HN says about your competitors. Turn their bad press into your opportunity with scored insights."],
            ["🔔","Slack-Native Alerts","Zero new dashboards. Full context — risk score, viral score, reply draft — lands directly in your Slack."],
          ].map(([icon,title,desc])=>(
            <div className="feature" key={title as string}>
              <span className="feature-emoji">{icon}</span>
              <h3>{title as string}</h3>
              <p>{desc as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="how-inner">
          <div className="section-eyebrow reveal">How it works</div>
          <h2 className="section-title reveal">Up and running<br/><em>in 2 minutes.</em></h2>
          <div className="steps reveal">
            {[
              ["01","Set keywords","Enter your brand name, product, competitors. We watch HN 24/7 so you don't have to."],
              ["02","Early detection","Our engine scans HN every 5 minutes — catching posts before they gain traction."],
              ["03","AI scores the risk","LLaMA 3.3 rates Risk (1–10) in red and Viral potential (1–10) in green for every matched post."],
              ["04","Reply in 30 sec","Get a founder-style draft ready to paste. Respond before the thread blows up."],
            ].map(([num,title,desc])=>(
              <div className="step" key={num as string}>
                <div className="step-num">{num}</div>
                <h3>{title as string}</h3>
                <p>{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
  <div className="section-eyebrow reveal">Pricing</div>
  <h2 className="section-title reveal">Simple pricing,<br/><em>no surprises.</em></h2>
  <div className="pricing-grid reveal">
    <div className="plan">
      <div className="plan-name">Free</div>
      <div className="plan-price">$0</div>
      <div className="plan-period">forever</div>
      <div className="plan-divider"></div>
      <ul className="plan-features">
        <li>3 keywords</li>
        <li>HN monitoring</li>
        <li>Risk + Viral scoring</li>
        <li>Slack alerts</li>
      </ul>
      <a href="/login" className="plan-cta">Get started free</a>
    </div>
    <div className="plan featured">
      <div className="plan-badge">Most popular</div>
      <div className="plan-name">Starter</div>
      <div className="plan-price">$29</div>
      <div className="plan-period">per month</div>
      <div className="plan-divider"></div>
      <ul className="plan-features">
        <li>20 keywords</li>
        <li>HN + Reddit monitoring</li>
        <li>AI reply drafts</li>
        <li>Competitor radar</li>
        <li>Slack alerts</li>
      </ul>
      <a href="https://respondai.lemonsqueezy.com/checkout/buy/ef1471f2-9f62-4b95-a081-e2802c59964c" className="plan-cta" target="_blank">Start free trial</a>
    </div>
    <div className="plan">
      <div className="plan-name">Pro</div>
      <div className="plan-price">$49</div>
      <div className="plan-period">per month</div>
      <div className="plan-divider"></div>
      <ul className="plan-features">
        <li>Unlimited keywords</li>
        <li>HN + Reddit monitoring</li>
        <li>Team dashboard</li>
        <li>Weekly AI brand report</li>
        <li>Custom AI tone</li>
        <li>API access</li>
      </ul>
      <a href="https://respondai.lemonsqueezy.com/checkout/buy/db29bbf5-eac6-42c5-85f4-804eac772552" className="plan-cta" target="_blank">Go pro</a>
    </div>
  </div>
</section>
      <section className="faq-section">
        <div className="section-eyebrow reveal">FAQ</div>
        <h2 className="section-title reveal">Common<br/><em>questions.</em></h2>
        <div className="faq-list reveal">
          {[
            ["How do I set up my keywords?","After signing in, enter any keywords you want to monitor — your brand name, product name, or competitor names. We start scanning immediately."],
            ["How accurate are the AI reply drafts?","The drafts are written in authentic HN founder tone using LLaMA 3.3. Most founders use them as a starting point and tweak slightly. They're designed to sound like you, not like PR."],
            ["What's the difference between Risk Score and Viral Score?","Risk Score (shown in red) measures how damaging a post could be to your brand. Viral Score (shown in green) measures how likely a post is to gain traction — including positive mentions worth engaging with."],
            ["Do I need a Slack workspace?","Yes, currently alerts are sent via Slack Webhook. Email alerts are coming soon for teams without Slack."],
            ["How is this different from Brand24 or Mention?","Those tools give you a dashboard to check. We push alerts to where you already work (Slack) with an AI-drafted reply ready to go. We're built for speed, not analytics."],
            ["Can I monitor competitors?","Yes. Add competitor keywords during setup. You'll get separate alerts when HN discusses your competitors, with an opportunity score instead of a risk score."],
          ].map(([q,a])=>(
            <FAQItem key={q as string} q={q as string} a={a as string} />
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>One bad HN thread<br/>can cost you <em>thousands.</em></h2>
        <p>Set up in 2 minutes. Free forever. No credit card.</p>
        <a href="/login" className="btn-main" style={{fontSize:"16px",padding:"16px 40px"}}>Protect My Brand Now →</a>
      </section>

      <footer>
        <a href="/" className="footer-logo">Respond<span>AI</span></a>
        <p>© 2025 RespondAI. Built for founders who move fast.</p>
      </footer>
    </>
  );
}