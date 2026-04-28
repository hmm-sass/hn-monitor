"use client";

import { FormEvent, useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [keywords, setKeywords] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, keywords, slackWebhook }),
      });
      const data: { message?: string; error?: string } = await response.json();
      if (!response.ok) {
        setError(data.error ?? "An error occurred.");
        return;
      }
      setMessage(data.message ?? "Monitoring started successfully!");
      setEmail("");
      setKeywords("");
      setSlackWebhook("");
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');
        :root{--cyan:#00f5ff;--magenta:#ff00aa;--violet:#7b00ff;--green:#00ff88;--bg:#020008;}
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:var(--bg);color:#fff;font-family:'Rajdhani',sans-serif;overflow-x:hidden;}
        body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;z-index:0;}
        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;z-index:1;}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .orb-1{width:500px;height:500px;background:radial-gradient(circle,rgba(123,0,255,0.2),transparent 70%);top:-100px;right:-100px;}
        .orb-2{width:400px;height:400px;background:radial-gradient(circle,rgba(0,245,255,0.15),transparent 70%);bottom:0;left:-100px;}
        .back{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.4);text-decoration:none;text-transform:uppercase;margin-bottom:40px;display:flex;align-items:center;gap:8px;transition:color 0.3s;}
        .back:hover{color:var(--cyan);}
        .card{background:rgba(255,255,255,0.02);border:1px solid rgba(0,245,255,0.15);padding:48px;width:100%;max-width:520px;position:relative;}
        .card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--cyan),var(--violet),var(--magenta));}
        .card-label{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:6px;color:var(--magenta);text-transform:uppercase;margin-bottom:12px;}
        .card-title{font-family:'Orbitron',monospace;font-size:28px;font-weight:900;background:linear-gradient(135deg,#fff,var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;}
        .card-sub{font-size:15px;color:rgba(255,255,255,0.4);margin-bottom:40px;line-height:1.6;}
        .field{margin-bottom:24px;}
        .label{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:3px;color:rgba(255,255,255,0.5);text-transform:uppercase;margin-bottom:10px;display:block;}
        .input{width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:14px 16px;font-family:'Rajdhani',sans-serif;font-size:15px;outline:none;transition:border-color 0.3s;}
        .input:focus{border-color:var(--cyan);}
        .input::placeholder{color:rgba(255,255,255,0.2);}
        textarea.input{resize:vertical;min-height:100px;}
        .hint{font-size:12px;color:rgba(255,255,255,0.25);margin-top:6px;letter-spacing:1px;}
        .submit{width:100%;font-family:'Orbitron',monospace;font-size:12px;letter-spacing:3px;padding:16px;background:linear-gradient(135deg,var(--cyan),var(--violet));color:var(--bg);border:none;font-weight:700;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-top:8px;}
        .submit:hover{box-shadow:0 10px 40px rgba(0,245,255,0.3);transform:translateY(-2px);}
        .submit:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .success{margin-top:20px;padding:16px;background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.3);color:var(--green);font-size:14px;letter-spacing:1px;text-align:center;}
        .error{margin-top:20px;padding:16px;background:rgba(255,0,0,0.05);border:1px solid rgba(255,60,60,0.3);color:#ff6060;font-size:14px;letter-spacing:1px;text-align:center;}
      `}</style>

      <div className="page">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        <a href="/" className="back">← Back to Home</a>

        <div className="card">
          <div className="card-label">// Setup</div>
          <h1 className="card-title">START MONITORING</h1>
          <p className="card-sub">Enter your keywords and Slack webhook to start receiving AI-powered alerts from Hacker News.</p>

          <form onSubmit={handleSubmit}>
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
              <label className="label">Keywords</label>
              <textarea
                className="input"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="your-brand, competitor, industry-term"
                required
              />
              <p className="hint">Separate multiple keywords with commas</p>
            </div>

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
              <p className="hint">Get your webhook URL from Slack API settings</p>
            </div>

            <button className="submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "ACTIVATING..." : "ACTIVATE MONITOR"}
            </button>

            {message && <div className="success">✓ {message}</div>}
            {error && <div className="error">✗ {error}</div>}
          </form>
        </div>
      </div>
    </>
  );
}