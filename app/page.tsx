"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.left = mouseX - 6 + "px";
        cursor.style.top = mouseY - 6 + "px";
      }
    };
    document.addEventListener("mousemove", onMove);

    const animateRing = () => {
      ringX += (mouseX - ringX - 20) * 0.12;
      ringY += (mouseY - ringY - 20) * 0.12;
      if (ring) {
        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
      }
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));

    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');
        :root{--cyan:#00f5ff;--magenta:#ff00aa;--violet:#7b00ff;--green:#00ff88;--bg:#020008;}
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:var(--bg);color:#fff;font-family:'Rajdhani',sans-serif;overflow-x:hidden;cursor:none;}
        .cursor{width:12px;height:12px;background:var(--cyan);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transition:transform 0.1s;box-shadow:0 0 20px var(--cyan);}
        .cursor-ring{width:40px;height:40px;border:1px solid rgba(0,245,255,0.4);border-radius:50%;position:fixed;pointer-events:none;z-index:9998;transition:all 0.15s ease;}
        body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;z-index:0;}
        nav{position:fixed;top:0;left:0;right:0;padding:20px 40px;display:flex;justify-content:space-between;align-items:center;z-index:100;backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,245,255,0.08);}
        .logo{font-family:'Orbitron',monospace;font-size:18px;font-weight:900;letter-spacing:4px;background:linear-gradient(90deg,var(--cyan),var(--magenta));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .nav-cta{font-family:'Orbitron',monospace;font-size:11px;letter-spacing:3px;padding:10px 24px;border:1px solid var(--cyan);color:var(--cyan);text-decoration:none;text-transform:uppercase;transition:all 0.3s;}
        .nav-cta:hover{background:var(--cyan);color:var(--bg);}
        .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:120px 40px 80px;position:relative;z-index:1;}
        .hero-badge{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:5px;color:var(--green);border:1px solid rgba(0,255,136,0.3);padding:6px 16px;margin-bottom:40px;animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,0.3);}50%{box-shadow:0 0 20px 4px rgba(0,255,136,0.15);}}
        .hero h1{font-family:'Orbitron',monospace;font-size:clamp(40px,8vw,100px);font-weight:900;line-height:1;letter-spacing:-2px;margin-bottom:8px;}
        .line1{background:linear-gradient(135deg,#fff 0%,var(--cyan) 50%,var(--magenta) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block;}
        .line2{background:linear-gradient(135deg,var(--violet) 0%,var(--magenta) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block;}
        .hero-sub{font-size:20px;font-weight:300;color:rgba(255,255,255,0.5);max-width:620px;margin:32px auto 48px;line-height:1.7;letter-spacing:1px;}
        .hero-sub strong{color:var(--cyan);font-weight:600;}
        .hero-actions{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;}
        .btn-primary{font-family:'Orbitron',monospace;font-size:12px;letter-spacing:3px;padding:16px 40px;background:linear-gradient(135deg,var(--cyan),var(--violet));color:var(--bg);text-decoration:none;font-weight:700;text-transform:uppercase;transition:all 0.3s;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 20px 60px rgba(0,245,255,0.4);}
        .btn-secondary{font-family:'Orbitron',monospace;font-size:12px;letter-spacing:3px;padding:16px 40px;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);text-decoration:none;text-transform:uppercase;transition:all 0.3s;}
        .btn-secondary:hover{border-color:var(--magenta);color:var(--magenta);}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;animation:float 8s ease-in-out infinite;}
        .orb-1{width:500px;height:500px;background:radial-gradient(circle,rgba(123,0,255,0.3),transparent 70%);top:-100px;right:-100px;}
        .orb-2{width:400px;height:400px;background:radial-gradient(circle,rgba(0,245,255,0.2),transparent 70%);bottom:0;left:-100px;animation-delay:-4s;}
        .orb-3{width:300px;height:300px;background:radial-gradient(circle,rgba(255,0,170,0.2),transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:-2s;}
        @keyframes float{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-30px) scale(1.05);}}
        .stats-bar{background:rgba(0,245,255,0.03);border-top:1px solid rgba(0,245,255,0.1);border-bottom:1px solid rgba(0,245,255,0.1);padding:24px 40px;display:flex;justify-content:center;gap:80px;position:relative;z-index:1;flex-wrap:wrap;}
        .stat-num{font-family:'Orbitron',monospace;font-size:32px;font-weight:900;background:linear-gradient(135deg,var(--cyan),var(--magenta));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .stat-label{font-size:12px;letter-spacing:3px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-top:4px;}
        .section{padding:120px 40px;max-width:1200px;margin:0 auto;position:relative;z-index:1;}
        .section-label{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:6px;color:var(--magenta);text-transform:uppercase;margin-bottom:16px;}
        .section-title{font-family:'Orbitron',monospace;font-size:clamp(28px,4vw,48px);font-weight:900;line-height:1.1;margin-bottom:60px;}
        .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2px;}
        .step{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);padding:40px 32px;position:relative;transition:all 0.3s;overflow:hidden;}
        .step:hover{border-color:rgba(0,245,255,0.2);}
        .step-num{font-family:'Orbitron',monospace;font-size:64px;font-weight:900;color:rgba(0,245,255,0.08);position:absolute;top:16px;right:24px;line-height:1;}
        .step-icon{font-size:32px;margin-bottom:20px;}
        .step h3{font-family:'Orbitron',monospace;font-size:14px;letter-spacing:2px;color:var(--cyan);margin-bottom:12px;text-transform:uppercase;}
        .step p{font-size:15px;color:rgba(255,255,255,0.5);line-height:1.7;font-weight:300;}
        .features{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;}
        .feature{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);padding:40px;transition:all 0.4s;position:relative;overflow:hidden;}
        .feature:hover{border-color:rgba(0,245,255,0.15);transform:translateY(-4px);}
        .feature-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--cyan),var(--violet));display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:24px;}
        .feature h3{font-family:'Orbitron',monospace;font-size:13px;letter-spacing:2px;color:#fff;margin-bottom:12px;text-transform:uppercase;}
        .feature p{font-size:15px;color:rgba(255,255,255,0.45);line-height:1.8;font-weight:300;}
        .slack-card{background:#1a1d21;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:24px;max-width:700px;margin:0 auto;}
        .slack-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.08);}
        .slack-avatar{width:36px;height:36px;background:linear-gradient(135deg,var(--cyan),var(--violet));border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .slack-name{font-size:14px;font-weight:bold;color:#fff;}
        .slack-time{font-size:11px;color:rgba(255,255,255,0.3);}
        .alert-badge{display:inline-block;background:rgba(255,0,0,0.15);border:1px solid rgba(255,60,60,0.4);color:#ff6060;font-size:11px;letter-spacing:2px;padding:3px 10px;font-family:'Orbitron',monospace;margin-bottom:12px;}
        .slack-field{display:flex;gap:12px;margin-bottom:8px;font-size:14px;}
        .slack-key{color:rgba(255,255,255,0.4);min-width:120px;}
        .slack-val{color:#fff;}
        .slack-val.negative{color:#ff6060;}
        .slack-val.high{color:#ffaa00;}
        .slack-val.link{color:var(--cyan);}
        .score-bar{display:flex;align-items:center;gap:8px;font-size:14px;margin-bottom:8px;}
        .score-label{color:rgba(255,255,255,0.4);min-width:120px;}
        .score-fill{color:var(--magenta);}
        .score-num{color:#fff;font-family:'Orbitron',monospace;font-size:12px;}
        .slack-draft{margin-top:16px;padding:16px;background:rgba(0,245,255,0.04);border-left:2px solid var(--cyan);font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;}
        .action-now{margin-top:12px;padding:10px 16px;background:rgba(255,0,0,0.1);border:1px solid rgba(255,60,60,0.3);color:#ff6060;font-family:'Orbitron',monospace;font-size:11px;letter-spacing:2px;display:inline-block;}
        .pricing{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:2px;max-width:900px;margin:0 auto;}
        .plan{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);padding:48px 36px;transition:all 0.3s;position:relative;}
        .plan.featured{border-color:rgba(0,245,255,0.3);background:rgba(0,245,255,0.03);}
        .plan.featured::before{content:'MOST POPULAR';position:absolute;top:0;left:0;right:0;background:linear-gradient(90deg,var(--cyan),var(--violet));color:var(--bg);font-family:'Orbitron',monospace;font-size:9px;letter-spacing:4px;text-align:center;padding:6px;font-weight:700;}
        .plan-name{font-family:'Orbitron',monospace;font-size:12px;letter-spacing:4px;color:rgba(255,255,255,0.5);text-transform:uppercase;margin-bottom:16px;margin-top:8px;}
        .plan-price{font-family:'Orbitron',monospace;font-size:48px;font-weight:900;background:linear-gradient(135deg,#fff,var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px;}
        .plan-period{font-size:13px;color:rgba(255,255,255,0.3);letter-spacing:2px;margin-bottom:32px;}
        .plan-features{list-style:none;margin-bottom:40px;}
        .plan-features li{font-size:14px;color:rgba(255,255,255,0.6);padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:10px;font-weight:300;}
        .plan-features li::before{content:'▸';color:var(--cyan);font-size:10px;}
        .plan-btn{display:block;text-align:center;font-family:'Orbitron',monospace;font-size:11px;letter-spacing:3px;padding:14px;text-decoration:none;text-transform:uppercase;transition:all 0.3s;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.6);}
        .plan.featured .plan-btn{background:linear-gradient(135deg,var(--cyan),var(--violet));color:var(--bg);font-weight:700;border:none;}
        .cta-section{padding:160px 40px;text-align:center;position:relative;z-index:1;}
        .cta-section h2{font-family:'Orbitron',monospace;font-size:clamp(32px,5vw,64px);font-weight:900;background:linear-gradient(135deg,#fff,var(--cyan),var(--magenta));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:24px;line-height:1.1;}
        .cta-section p{font-size:18px;color:rgba(255,255,255,0.4);margin-bottom:48px;letter-spacing:1px;}
        footer{border-top:1px solid rgba(255,255,255,0.05);padding:40px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1;flex-wrap:wrap;gap:16px;}
        footer p{font-size:12px;color:rgba(255,255,255,0.2);letter-spacing:2px;}
        .divider{height:1px;background:linear-gradient(90deg,transparent,var(--cyan),var(--magenta),var(--violet),transparent);margin:0 40px;opacity:0.3;}
        .reveal{opacity:0;transform:translateY(30px);transition:all 0.8s cubic-bezier(0.16,1,0.3,1);}
        .reveal.visible{opacity:1;transform:translateY(0);}
      `}</style>

      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      <nav>
        <div className="logo">HN_MONITOR</div>
        <a href="/register" className="nav-cta">Start Free</a>
      </nav>

      <section className="hero">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="hero-badge">⚡ RESPOND BEFORE IT GOES VIRAL</div>
        <h1>
          <span className="line1">ACT BEFORE</span>
          <span className="line2">THE DAMAGE</span>
        </h1>
        <p className="hero-sub">
          <strong>HN threads move fast.</strong> A negative post can hit 200 upvotes in 30 minutes.
          We detect it early, score the risk, and give you a{" "}
          <strong>founder-ready reply</strong> — before it spreads.
        </p>
        <div className="hero-actions">
          <a href="/register" className="btn-primary">Protect My Brand Free</a>
          <a href="#demo" className="btn-secondary">See Live Alert</a>
        </div>
      </section>

      <div className="stats-bar">
        {[["5min","Early Detection"],["9/10","Risk Scoring"],["AI","Reply Draft"],["$0","To Start"]].map(([n,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <section className="section">
        <div className="section-label">// How It Works</div>
        <h2 className="section-title">STOP FIRES<br/><span style={{background:"linear-gradient(135deg,var(--cyan),var(--magenta))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>BEFORE THEY START</span></h2>
        <div className="steps reveal">
          {[
            ["🎯","01","Set Keywords","Enter your brand, competitors, or industry terms. We watch HN 24/7 so you don't have to."],
            ["⚡","02","Early Detection","We catch posts in the first 5 minutes — before they gain traction and go viral."],
            ["📊","03","Risk + Viral Score","AI scores each post 1-10 for brand risk and viral potential. Know exactly what needs action."],
            ["💬","04","Reply Now","Get a founder-style HN reply ready to paste. Respond in 30 seconds, not 30 minutes."]
          ].map(([icon,num,title,desc])=>(
            <div className="step" key={num as string}>
              <div className="step-num">{num}</div>
              <div className="step-icon">{icon}</div>
              <h3>{title as string}</h3>
              <p>{desc as string}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      <section className="section">
        <div className="section-label">// Features</div>
        <h2 className="section-title">BUILT FOR<br/><span style={{background:"linear-gradient(135deg,var(--violet),var(--magenta))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>FOUNDERS</span></h2>
        <div className="features reveal">
          {[
            ["🚨","Risk Score (1-10)","Know instantly if a post is dangerous. Score 8+ triggers immediate Slack alert with action required."],
            ["📈","Viral Score (1-10)","Predict if a post will blow up. Catch opportunity threads early — not just negative ones."],
            ["💬","HN-Style Reply Draft","AI writes in authentic HN founder tone. Paste and send in seconds. No PR speak."],
            ["⚡","5-Min Early Detection","Catch threads before they gain momentum. The first 30 minutes are everything on HN."],
            ["🥊","Competitor Radar","Monitor what HN says about your competitors. Turn their bad press into your opportunity."],
            ["🔔","Slack-Native Alerts","Zero new dashboards. Alerts with full context land directly in your team Slack."]
          ].map(([icon,title,desc])=>(
            <div className="feature" key={title as string}>
              <div className="feature-icon">{icon}</div>
              <h3>{title as string}</h3>
              <p>{desc as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"120px 40px",position:"relative",zIndex:1}} id="demo">
        <div style={{textAlign:"center",marginBottom:60}}>
          <div className="section-label" style={{display:"inline-block"}}>// Live Alert Sample</div>
          <h2 className="section-title" style={{marginBottom:0}}>WHAT HITS<br/><span style={{background:"linear-gradient(135deg,var(--green),var(--cyan))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>YOUR SLACK</span></h2>
        </div>
        <div className="slack-card reveal">
          <div className="slack-header">
            <div className="slack-avatar">⚠️</div>
            <div>
              <div className="slack-name">HN Monitor</div>
              <div className="slack-time">Today at 9:14 AM</div>
            </div>
          </div>
          <div className="alert-badge">🚨 POTENTIAL CRISIS — ACT NOW</div>
          <div className="slack-field"><span className="slack-key">Why it matters</span><span className="slack-val negative">Negative thread gaining traction fast — 120 upvotes in 18 min</span></div>
          <div className="slack-field"><span className="slack-key">Post</span><span className="slack-val">Why I stopped recommending [YourProduct] to my team</span></div>
          <div className="slack-field"><span className="slack-key">Age</span><span className="slack-val">18 min old | Upvotes: 120 | Comments: 34</span></div>
          <div className="score-bar"><span className="score-label">📊 Risk Score</span><span className="score-fill">█████████░</span><span className="score-num">9/10</span></div>
          <div className="score-bar"><span className="score-label">📈 Viral Score</span><span className="score-fill">████████░░</span><span className="score-num">8/10</span></div>
          <div className="slack-draft">
            <div style={{color:"var(--cyan)",fontSize:11,letterSpacing:2,marginBottom:8}}>💬 SUGGESTED REPLY (HN STYLE)</div>
            Hey, founder here. This is valid feedback and I want to address it directly. We shipped a breaking change last week without enough notice — that was our mistake. Here is what we are doing to fix it.
          </div>
          <div className="action-now">⚡ ACTION: RESPOND NOW</div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="section">
        <div style={{textAlign:"center",marginBottom:60}}>
          <div className="section-label" style={{display:"inline-block"}}>// Pricing</div>
          <h2 className="section-title" style={{marginBottom:0}}>SIMPLE<br/><span style={{background:"linear-gradient(135deg,var(--cyan),var(--green))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PRICING</span></h2>
        </div>
        <div className="pricing reveal">
          <div className="plan">
            <div className="plan-name">Free</div>
            <div className="plan-price">$0</div>
            <div className="plan-period">/ forever</div>
            <ul className="plan-features">
              <li>3 keywords</li>
              <li>100 alerts / month</li>
              <li>Risk + Viral scoring</li>
              <li>Slack integration</li>
            </ul>
            <a href="/register" className="plan-btn">Get Started</a>
          </div>
          <div className="plan featured">
            <div className="plan-name">Starter</div>
            <div className="plan-price">$29</div>
            <div className="plan-period">/ month</div>
            <ul className="plan-features">
              <li>20 keywords</li>
              <li>Unlimited alerts</li>
              <li>HN reply drafts</li>
              <li>Competitor radar</li>
              <li>Priority support</li>
            </ul>
            <a href="/register" className="plan-btn">Start Free Trial</a>
          </div>
          <div className="plan">
            <div className="plan-name">Pro</div>
            <div className="plan-price">$79</div>
            <div className="plan-period">/ month</div>
            <ul className="plan-features">
              <li>Unlimited keywords</li>
              <li>Reddit + HN + Twitter</li>
              <li>Team dashboard</li>
              <li>API access</li>
              <li>Custom alerts</li>
            </ul>
            <a href="/register" className="plan-btn">Go Pro</a>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>ONE BAD HN THREAD<br/>CAN COST YOU THOUSANDS</h2>
        <p>Set up in 2 minutes. Free forever. No credit card.</p>
        <a href="/register" className="btn-primary" style={{fontSize:14,padding:"20px 60px"}}>Protect My Brand Now</a>
      </section>

      <footer>
        <div className="logo">HN_MONITOR</div>
        <p>© 2025 HN Monitor. Built for founders who move fast.</p>
      </footer>
    </>
  );
}