"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        :root{--bg:#fafaf9;--ink:#0f0e0d;--ink-2:#6b6966;--ink-3:#b5b2ae;--orange:#ff4d00;--surface:#ffffff;--border:rgba(15,14,13,0.08);}
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 60% 60% at 10% 10%,rgba(255,77,0,0.06) 0%,transparent 60%);pointer-events:none;z-index:0;}
        .page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;position:relative;z-index:1;}
        .box{width:100%;max-width:440px;animation:fadeUp 0.5s ease both;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .logo{font-family:'Instrument Serif',serif;font-size:20px;color:var(--ink);text-decoration:none;display:block;text-align:center;margin-bottom:48px;}
        .logo span{color:var(--orange);font-style:italic;}
        .title{font-family:'Instrument Serif',serif;font-size:32px;letter-spacing:-1px;text-align:center;margin-bottom:8px;}
        .sub{font-size:14px;color:var(--ink-2);text-align:center;margin-bottom:36px;font-weight:300;line-height:1.6;}
        .field{margin-bottom:16px;}
        .label{display:block;font-size:13px;font-weight:500;color:var(--ink);margin-bottom:8px;}
        .input{width:100%;padding:13px 16px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;font-size:15px;font-family:'DM Sans',sans-serif;color:var(--ink);outline:none;transition:all 0.2s;}
        .input:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(255,77,0,0.08);}
        .input::placeholder{color:var(--ink-3);}
        .submit{width:100%;padding:15px;background:var(--ink);color:white;border:none;border-radius:100px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.25s;margin-top:8px;}
        .submit:hover:not(:disabled){background:var(--orange);transform:translateY(-2px);box-shadow:0 12px 32px rgba(255,77,0,0.3);}
        .submit:disabled{opacity:0.5;cursor:not-allowed;}
        .error{background:#fff5f5;border:1px solid rgba(255,0,0,0.15);border-radius:10px;padding:12px 16px;font-size:13px;color:#d32f2f;margin-top:12px;}
        .sent-box{text-align:center;}
        .sent-icon{width:64px;height:64px;background:linear-gradient(135deg,var(--orange),#ff9500);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 24px;box-shadow:0 8px 32px rgba(255,77,0,0.3);}
        .sent-box h2{font-family:'Instrument Serif',serif;font-size:28px;letter-spacing:-1px;margin-bottom:12px;}
        .sent-box p{font-size:14px;color:var(--ink-2);line-height:1.7;font-weight:300;}
        .sent-box .email-highlight{color:var(--ink);font-weight:500;}
        .back{display:block;text-align:center;margin-top:32px;font-size:13px;color:var(--ink-3);text-decoration:none;}
        .back:hover{color:var(--ink);}
      `}</style>

      <div className="page">
        <div className="box">
          <a href="/" className="logo">Respond<span>AI</span></a>

          {sent ? (
            <div className="sent-box">
              <div className="sent-icon">✉️</div>
              <h2>Check your email</h2>
              <p>We sent a login link to<br/><span className="email-highlight">{email}</span><br/><br/>Click the link to access your dashboard.</p>
              <a href="/" className="back">← Back to home</a>
            </div>
          ) : (
            <>
              <h1 className="title">Welcome back</h1>
              <p className="sub">Enter your email and we'll send you<br/>a magic link to sign in.</p>
              <form onSubmit={handleLogin}>
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
                <button className="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Magic Link →"}
                </button>
                {error && <div className="error">✗ {error}</div>}
              </form>
              <a href="/" className="back">← Back to home</a>
            </>
          )}
        </div>
      </div>
    </>
  );
}