"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type Monitor = {
  id: string;
  email: string;
  keywords: string[];
  competitor_keywords: string[];
  slack_webhook: string;
  plan: string;
};

type Mention = {
  id: string;
  platform: string;
  post_title: string;
  post_url: string;
  risk_score: number | null;
  viral_score: number | null;
  ai_draft: string;
  is_read: boolean;
  detected_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<{ email: string } | null>(null);
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [keywords, setKeywords] = useState("");
  const [competitorKeywords, setCompetitorKeywords] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser({ email: user.email ?? "" });

      const { data: monitorData } = await supabase
        .from("monitors")
        .select("*")
        .eq("email", user.email)
        .single();

      setMonitor(monitorData ?? null);

      if (monitorData) {
        const { data: mentionData } = await supabase
          .from("mentions")
          .select("*")
          .eq("monitor_id", monitorData.id)
          .order("detected_at", { ascending: false })
          .limit(20);
        setMentions(mentionData ?? []);
      }

      setLoading(false);
    }
    load();
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user?.email, keywords, slackWebhook, competitorKeywords }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setSubmitting(false); return; }

    const { data: monitorData } = await supabase
      .from("monitors").select("*").eq("email", user?.email).single();
    setMonitor(monitorData);
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const markAsRead = async (id: string) => {
    await supabase.from("mentions").update({ is_read: true }).eq("id", id);
    setMentions(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const avgRisk = mentions.filter(m => m.risk_score !== null).length > 0
    ? Math.round(mentions.filter(m => m.risk_score !== null).reduce((a, m) => a + (m.risk_score ?? 0), 0) / mentions.filter(m => m.risk_score !== null).length)
    : 0;

  const thisWeek = mentions.filter(m => {
    const d = new Date(m.detected_at);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const isPro = monitor?.plan === "pro";
  const isStarter = monitor?.plan === "starter" || isPro;
  const isFree = monitor?.plan === "free" || !monitor?.plan;

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",background:"#fafaf9"}}>
      <div style={{color:"#b5b2ae",fontSize:"14px"}}>Loading...</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        :root{--bg:#fafaf9;--ink:#0f0e0d;--ink-2:#6b6966;--ink-3:#b5b2ae;--orange:#ff4d00;--surface:#ffffff;--border:rgba(15,14,13,0.08);--emerald:#059669;--red:#dc2626;}
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
        .nav{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;background:var(--surface);border-bottom:1px solid var(--border);}
        .nav-logo{font-family:'Instrument Serif',serif;font-size:20px;color:var(--ink);text-decoration:none;}
        .nav-logo span{color:var(--orange);font-style:italic;}
        .nav-right{display:flex;align-items:center;gap:16px;}
        .nav-email{font-size:13px;color:var(--ink-3);}
        .plan-badge{font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;text-transform:uppercase;letter-spacing:1px;}
        .plan-badge.free{background:var(--bg);border:1px solid var(--border);color:var(--ink-3);}
        .plan-badge.starter{background:#fff5f0;border:1px solid rgba(255,77,0,0.2);color:var(--orange);}
        .plan-badge.pro{background:var(--ink);color:white;}
        .logout-btn{font-size:13px;color:var(--ink-2);background:none;border:1px solid var(--border);padding:7px 16px;border-radius:100px;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
        .logout-btn:hover{border-color:var(--ink);color:var(--ink);}
        .main{max-width:900px;margin:0 auto;padding:48px 40px;}
        .page-title{font-family:'Instrument Serif',serif;font-size:36px;letter-spacing:-1px;margin-bottom:6px;}
        .page-sub{font-size:14px;color:var(--ink-2);margin-bottom:32px;font-weight:300;}
        .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;}
        .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px 28px;}
        .stat-card-label{font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:var(--ink-3);margin-bottom:8px;}
        .stat-card-value{font-family:'Instrument Serif',serif;font-size:40px;letter-spacing:-1px;color:var(--ink);line-height:1;}
        .stat-card-value.red{color:var(--red);}
        .stat-card-value.emerald{color:var(--emerald);}
        .stat-card-sub{font-size:12px;color:var(--ink-3);margin-top:6px;}
        .upgrade-banner{background:var(--ink);border-radius:16px;padding:24px 32px;margin-bottom:32px;display:flex;align-items:center;justify-content:space-between;gap:24px;position:relative;overflow:hidden;}
        .upgrade-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 0% 50%,rgba(255,77,0,0.2) 0%,transparent 60%);}
        .upgrade-banner-text{position:relative;z-index:1;}
        .upgrade-banner-title{font-size:15px;font-weight:500;color:white;margin-bottom:4px;}
        .upgrade-banner-sub{font-size:13px;color:rgba(255,255,255,0.5);font-weight:300;}
        .upgrade-banner-btn{position:relative;z-index:1;flex-shrink:0;background:var(--orange);color:white;font-size:13px;font-weight:500;padding:10px 20px;border-radius:100px;text-decoration:none;transition:all 0.2s;white-space:nowrap;}
        .upgrade-banner-btn:hover{background:#ff6a1a;box-shadow:0 8px 24px rgba(255,77,0,0.4);}
        .cards{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:32px;}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;}
        .card-label{font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:var(--ink-3);margin-bottom:16px;}
        .keyword-list{display:flex;flex-wrap:wrap;gap:8px;}
        .keyword-tag{display:inline-flex;align-items:center;background:#fff5f0;border:1px solid rgba(255,77,0,0.15);border-radius:100px;padding:4px 12px;font-size:13px;color:var(--orange);font-weight:500;}
        .competitor-tag{display:inline-flex;align-items:center;background:#f0f7ff;border:1px solid rgba(0,102,255,0.15);border-radius:100px;padding:4px 12px;font-size:13px;color:#0066ff;font-weight:500;}
        .slack-status{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--ink-2);}
        .status-dot{width:8px;height:8px;border-radius:50%;background:var(--emerald);}
        .mentions-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
        .mentions-title{font-size:16px;font-weight:500;}
        .unread-badge{background:var(--orange);color:white;font-size:11px;font-weight:600;padding:2px 8px;border-radius:100px;}
        .mention-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:12px;cursor:pointer;transition:all 0.2s;}
        .mention-card:hover{border-color:rgba(255,77,0,0.3);box-shadow:0 4px 16px rgba(0,0,0,0.06);}
        .mention-card.unread{border-left:3px solid var(--orange);}
        .mention-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px;}
        .mention-title{font-size:14px;font-weight:500;color:var(--ink);line-height:1.5;flex:1;}
        .mention-time{font-size:12px;color:var(--ink-3);white-space:nowrap;flex-shrink:0;}
        .mention-scores{display:flex;gap:8px;margin-bottom:12px;}
        .score-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:12px;font-weight:500;}
        .score-badge.risk{background:rgba(220,38,38,0.08);color:var(--red);}
        .score-badge.viral{background:rgba(5,150,105,0.08);color:var(--emerald);}
        .score-badge.platform{background:var(--bg);border:1px solid var(--border);color:var(--ink-3);}
        .mention-draft{background:#f8f9ff;border-left:2px solid #0066ff;border-radius:0 8px 8px 0;padding:10px 14px;font-size:13px;color:var(--ink-2);line-height:1.6;font-style:italic;margin-bottom:12px;}
        .mention-draft-locked{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--ink-3);margin-bottom:12px;display:flex;align-items:center;gap:8px;}
        .mention-actions{display:flex;gap:8px;}
        .action-btn{font-size:12px;font-weight:500;padding:6px 14px;border-radius:100px;cursor:pointer;transition:all 0.2s;text-decoration:none;border:1px solid var(--border);color:var(--ink-2);background:none;font-family:'DM Sans',sans-serif;}
        .action-btn.primary{background:var(--ink);color:white;border-color:var(--ink);}
        .action-btn.primary:hover{background:var(--orange);border-color:var(--orange);}
        .action-btn.upgrade{background:var(--orange);color:white;border-color:var(--orange);}
        .action-btn:hover{border-color:var(--ink);color:var(--ink);}
        .empty-state{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:60px;text-align:center;}
        .empty-icon{font-size:32px;margin-bottom:16px;}
        .empty-title{font-size:16px;font-weight:500;margin-bottom:8px;}
        .empty-sub{font-size:14px;color:var(--ink-2);font-weight:300;line-height:1.6;}
        .onboarding{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px;max-width:560px;}
        .onboarding-title{font-family:'Instrument Serif',serif;font-size:26px;letter-spacing:-0.5px;margin-bottom:8px;}
        .onboarding-sub{font-size:14px;color:var(--ink-2);margin-bottom:32px;font-weight:300;line-height:1.6;}
        .field{margin-bottom:20px;}
        .label{display:block;font-size:13px;font-weight:500;color:var(--ink);margin-bottom:8px;}
        .input{width:100%;padding:13px 16px;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;font-size:15px;font-family:'DM Sans',sans-serif;color:var(--ink);outline:none;transition:all 0.2s;}
        .input:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(255,77,0,0.08);}
        .input::placeholder{color:var(--ink-3);}
        textarea.input{resize:none;min-height:72px;line-height:1.6;}
        .hint{font-size:12px;color:var(--ink-3);margin-top:6px;}
        .divider{display:flex;align-items:center;gap:12px;margin:20px 0;}
        .divider-line{flex:1;height:1px;background:var(--border);}
        .divider-label{font-size:12px;color:var(--ink-3);}
        .submit{width:100%;padding:14px;background:var(--ink);color:white;border:none;border-radius:100px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.25s;margin-top:8px;}
        .submit:hover:not(:disabled){background:var(--orange);transform:translateY(-1px);box-shadow:0 8px 24px rgba(255,77,0,0.3);}
        .submit:disabled{opacity:0.5;cursor:not-allowed;}
        .error-msg{background:#fff5f5;border:1px solid rgba(255,0,0,0.15);border-radius:10px;padding:12px 16px;font-size:13px;color:#d32f2f;margin-top:12px;}
        @media(max-width:768px){
          .nav{padding:0 20px;}
          .main{padding:32px 20px;}
          .stats-grid{grid-template-columns:1fr;}
          .cards{grid-template-columns:1fr;}
          .upgrade-banner{flex-direction:column;align-items:flex-start;}
        }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Respond<span>AI</span></a>
        <div className="nav-right">
          {monitor && (
            <span className={`plan-badge ${monitor.plan || 'free'}`}>
              {monitor.plan || 'free'}
            </span>
          )}
          <span className="nav-email">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <main className="main">
        {!monitor ? (
          <>
            <h1 className="page-title">Welcome to RespondAI</h1>
            <p className="page-sub">Set up your monitor to start protecting your brand.</p>
            <div className="onboarding">
              <h2 className="onboarding-title">Set up your monitor</h2>
              <p className="onboarding-sub">Enter your keywords and connect Slack. Takes 2 minutes.</p>
              <form onSubmit={handleSetup}>
                <div className="field">
                  <label className="label">Brand Keywords</label>
                  <textarea className="input" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="your-brand, your-product, your-name" required/>
                  <p className="hint">Separate with commas.</p>
                </div>
                <div className="divider">
                  <div className="divider-line"></div>
                  <span className="divider-label">Optional</span>
                  <div className="divider-line"></div>
                </div>
                <div className="field">
                  <label className="label">Competitor Keywords</label>
                  <textarea className="input" value={competitorKeywords} onChange={e => setCompetitorKeywords(e.target.value)} placeholder="zendesk, intercom, freshdesk"/>
                </div>
                <div className="field">
                  <label className="label">Slack Webhook URL</label>
                  <input className="input" type="url" value={slackWebhook} onChange={e => setSlackWebhook(e.target.value)} placeholder="https://hooks.slack.com/services/..." required/>
                  <p className="hint">Get your webhook from <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" style={{color:"var(--orange)"}}>api.slack.com/apps</a></p>
                </div>
                <button className="submit" disabled={submitting}>
                  {submitting ? "Activating..." : "Activate Monitor →"}
                </button>
                {error && <div className="error-msg">✗ {error}</div>}
              </form>
            </div>
          </>
        ) : (
          <>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Your monitor is active. Scanning HN every 5 minutes.</p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-label">Total Mentions</div>
                <div className="stat-card-value">{mentions.length}</div>
                <div className="stat-card-sub">All time</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">This Week</div>
                <div className="stat-card-value emerald">{thisWeek}</div>
                <div className="stat-card-sub">Last 7 days</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Avg Risk Score</div>
                <div className={`stat-card-value ${avgRisk >= 6 ? "red" : ""}`}>{avgRisk > 0 ? `${avgRisk}/10` : "—"}</div>
                <div className="stat-card-sub">Across all mentions</div>
              </div>
            </div>

            {isFree && (
              <div className="upgrade-banner">
                <div className="upgrade-banner-text">
                  <div className="upgrade-banner-title">🚀 Unlock Reddit monitoring + AI reply drafts</div>
                  <div className="upgrade-banner-sub">Upgrade to Starter — $29/mo. Cancel anytime.</div>
                </div>
                <a href="/login?plan=starter" className="upgrade-banner-btn">Upgrade now →</a>
              </div>
            )}

            {isStarter && !isPro && (
              <div className="upgrade-banner">
                <div className="upgrade-banner-text">
                  <div className="upgrade-banner-title">⚡ Unlock unlimited keywords + weekly AI report</div>
                  <div className="upgrade-banner-sub">Upgrade to Pro — $49/mo. Cancel anytime.</div>
                </div>
                <a href="/login?plan=pro" className="upgrade-banner-btn">Go Pro →</a>
              </div>
            )}

            <div className="cards">
              <div className="card">
                <div className="card-label">Brand Keywords</div>
                <div className="keyword-list">
                  {monitor.keywords.map(k => (
                    <span className="keyword-tag" key={k}>🔍 {k}</span>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-label">Competitor Keywords</div>
                <div className="keyword-list">
                  {monitor.competitor_keywords?.length > 0
                    ? monitor.competitor_keywords.map(k => (
                        <span className="competitor-tag" key={k}>🥊 {k}</span>
                      ))
                    : <span style={{fontSize:"13px",color:"var(--ink-3)"}}>None added</span>
                  }
                </div>
              </div>
              <div className="card" style={{gridColumn:"1/-1"}}>
                <div className="card-label">Slack Integration</div>
                <div className="slack-status">
                  <span className="status-dot"></span>
                  Connected — alerts going to your Slack
                </div>
              </div>
            </div>

            <div className="mentions-header">
              <span className="mentions-title">Recent Mentions</span>
              {mentions.filter(m => !m.is_read).length > 0 && (
                <span className="unread-badge">
                  {mentions.filter(m => !m.is_read).length} new
                </span>
              )}
            </div>

            {mentions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📡</div>
                <div className="empty-title">Scanning HN...</div>
                <div className="empty-sub">Mentions will appear here when we detect your keywords.<br/>Check your Slack for real-time alerts.</div>
              </div>
            ) : (
              mentions.map(mention => (
                <div
                  key={mention.id}
                  className={`mention-card ${!mention.is_read ? "unread" : ""}`}
                  onClick={() => {
                    setExpandedId(expandedId === mention.id ? null : mention.id);
                    if (!mention.is_read) markAsRead(mention.id);
                  }}
                >
                  <div className="mention-top">
                    <div className="mention-title">{mention.post_title}</div>
                    <div className="mention-time">
                      {new Date(mention.detected_at).toLocaleDateString("en-US", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}
                    </div>
                  </div>
                  <div className="mention-scores">
                    {mention.risk_score !== null && (
                      <span className="score-badge risk">🔴 Risk {mention.risk_score}/10</span>
                    )}
                    {mention.viral_score !== null && (
                      <span className="score-badge viral">🟢 Viral {mention.viral_score}/10</span>
                    )}
                    <span className="score-badge platform">{mention.platform.toUpperCase()}</span>
                  </div>
                  {expandedId === mention.id && (
                    <>
                      {isStarter ? (
                        mention.ai_draft && (
                          <div className="mention-draft">💬 {mention.ai_draft}</div>
                        )
                      ) : (
                        <div className="mention-draft-locked">
                          🔒 AI reply draft — <a href="/login?plan=starter" style={{color:"var(--orange)",textDecoration:"none",fontWeight:"500"}}>Upgrade to Starter</a> to unlock
                        </div>
                      )}
                      <div className="mention-actions">
                        <a href={mention.post_url} target="_blank" rel="noreferrer" className="action-btn primary">
                          Respond on {mention.platform === 'reddit' ? 'Reddit' : 'HN'} →
                        </a>
                        {isStarter && mention.ai_draft && (
                          <button className="action-btn" onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(mention.ai_draft); }}>
                            Copy draft
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </main>
    </>
  );
}