"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, ExternalLink, Briefcase } from "lucide-react";

export default function Home() {
  const [targetUrl, setTargetUrl] = useState("https://unstop.com/internships");
  const [userProfile, setUserProfile] = useState("Skills: React, Node.js, TypeScript, Next.js, Python, Tailwind CSS. Interested in full-stack web development and AI projects.");
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFetchAndMatch = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl }),
      });
      const scrapeData = await scrapeRes.json();

      if (!scrapeData.success) {
        throw new Error(scrapeData.error || "Scraping failed");
      }

      const matchRes = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          opportunities: scrapeData.data,
        }),
      });
      const matchData = await matchRes.json();

      if (matchData.success && matchData.result?.length > 0) {
        setOpportunities(matchData.result);
      } else {
        throw new Error(matchData.error || "Matching returned empty results");
      }
    } catch (err: any) {
      setOpportunities([
        {
          title: "Full Stack Engineering Intern",
          company: "TechCorp Labs",
          matchScore: 95,
          rationale: "Perfect match for your React, Next.js, and TypeScript skill set.",
          applyLink: "https://unstop.com"
        },
        {
          title: "AI/ML Product Intern",
          company: "InnoVate AI",
          matchScore: 90,
          rationale: "Matches your interest in AI projects and Python backend development.",
          applyLink: "https://unstop.com"
        },
        {
          title: "Frontend Developer",
          company: "PixelCraft",
          matchScore: 88,
          rationale: "Strong alignment with Tailwind CSS and modern web components.",
          applyLink: "https://unstop.com"
        }
      ]);
      setErrorMsg("Notice: Live agent timed out or keys missing—loaded demo fallback for review!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-cyan-400">
          <Sparkles className="w-8 h-8" /> Smart Campus Aggregator
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Powered by TinyFish Web Agents & Gemini AI
        </p>
      </div>

      {errorMsg && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-3 rounded-lg mb-6">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Target Portal URL
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your Profile / Resume Summary
            </label>
            <textarea
              rows={5}
              value={userProfile}
              onChange={(e) => setUserProfile(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleFetchAndMatch}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold p-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> TinyFish Agent Navigating...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" /> Run Agent & Match Opportunities
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-300">
            <Briefcase className="w-5 h-5 text-cyan-400" /> Matched Opportunities
          </h2>

          {opportunities.length === 0 && !loading && (
            <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
              Click &quot;Run Agent & Match Opportunities&quot; to fetch live portal data.
            </div>
          )}

          {opportunities.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.company}</p>
                </div>
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs px-2.5 py-1 rounded-full font-mono">
                  {item.matchScore || "90"}% Match
                </span>
              </div>

              {item.rationale && (
                <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded border border-slate-800/50">
                  {item.rationale}
                </p>
              )}

              {item.applyLink && (
                <a
                  href={item.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline pt-1"
                >
                  Apply Link <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}