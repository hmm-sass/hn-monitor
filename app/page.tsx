"use client";

import { FormEvent, useState } from "react";

export default function Home() {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          keywords,
          slackWebhook,
        }),
      });

      const data: { message?: string; error?: string } = await response.json();

      if (!response.ok) {
        setError(data.error ?? "An error occurred while registering the monitor.");
        return;
      }

      setMessage(data.message ?? "Monitoring started successfully.");
      setEmail("");
      setKeywords("");
      setSlackWebhook("");
    } catch {
      setError("A network error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          HN Monitor
        </h1>
        <p className="mt-3 text-zinc-600">
          Get Slack alerts when your target keywords appear on Hacker News.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="keywords"
                className="mb-2 block text-sm font-medium"
              >
                Keywords (comma separated)
              </label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                placeholder="ai, startup, open source"
                required
                rows={4}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-500"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Enter one or more keywords separated by commas.
              </p>
            </div>

            <div>
              <label
                htmlFor="slackWebhook"
                className="mb-2 block text-sm font-medium"
              >
                Slack Webhook URL
              </label>
              <input
                id="slackWebhook"
                type="url"
                value={slackWebhook}
                onChange={(event) => setSlackWebhook(event.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isSubmitting ? "Starting..." : "Start Monitoring"}
          </button>

          {message ? (
            <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}
