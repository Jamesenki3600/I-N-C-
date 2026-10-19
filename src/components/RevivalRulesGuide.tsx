import React from 'react';
import { Shield, Swords, Sparkles, BookOpen, Clock, Heart, Zap, Award } from 'lucide-react';

export const RevivalRulesGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Memorial & Revival Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <Clock className="w-4 h-4" />
          <span>Vanguard ZERO Revival Project (2019 – 2023 – Forever)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Reverse-Engineered Vanguard ZERO Rules & Engine
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          On June 30, 2023, Bushiroad officially shut down the servers for <em>Cardfight!! Vanguard ZERO</em>.
          This project reconstructs and revives the unique, fast-paced battle mechanics of Zero directly in your browser.
        </p>

        <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Award className="w-4 h-4 text-cyan-400" /> 100% Faithful Zero Format
          </span>
          <span>·</span>
          <span>40-Card Standard Decks</span>
          <span>·</span>
          <span>Front-Row Intercept Barriers</span>
          <span>·</span>
          <span>Twin Drive Trigger Allocations</span>
        </div>
      </div>

      {/* Zero vs Physical TCG Differences */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>How Vanguard ZERO Differs from Standard Vanguard</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rule 1: Deck Construction */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center font-mono text-xs">
                1
              </span>
              <span>40-Card Deck with Fixed Ratios</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In standard Vanguard, decks have 50 cards with 16 triggers. In <strong>Vanguard ZERO</strong>, decks contain exactly <strong>40 cards</strong>:
              <br />
              • <strong>1 First Vanguard</strong> (Grade 0 starter)
              <br />
              • <strong>13 Grade 1s</strong> (including up to 4 Sentinels)
              <br />
              • <strong>13 Grade 2s</strong> (Front-row Interceptors)
              <br />
              • <strong>13 Grade 3s</strong> (Holders of your triggers)
            </p>
          </div>

          {/* Rule 2: Grade 3 Triggers */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center font-mono text-xs">
                2
              </span>
              <span>Triggers Assigned to Grade 3s</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Triggers are not independent Grade 0 cards! Instead, you bind trigger types to your Grade 3 units.
              Each deck must have <strong>exactly 4 Heal Triggers</strong>. The other 9 Grade 3s can be assigned <strong>Critical</strong>, <strong>Draw</strong>, or <strong>Stand</strong> triggers.
            </p>
          </div>

          {/* Rule 3: The Intercept System */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center font-mono text-xs">
                3
              </span>
              <span>The Intercept Rule (Game-Defining Mechanic)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All Grade 2 units have <strong>Intercept</strong>. When placed in the front row, they form an impenetrable shield:
              <strong> The opponent CANNOT attack your Vanguard while you have an active Grade 2 in the front row!</strong>
              Attackers must eliminate the Interceptors before they can strike the Vanguard.
            </p>
          </div>

          {/* Rule 4: No Hand Guarding + Auto-Sentinels */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center font-mono text-xs">
                4
              </span>
              <span>No Hand Guarding & Auto-Sentinels</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In Zero, you do not drop shields from your hand to guard normal attacks. Defense is handled on-board via <strong>Interceptors</strong> and <strong>Sentinels (Perfect Guards)</strong>.
              When your Vanguard would receive lethal damage (at 5 damage), your Sentinel automatically deploys from hand to block the strike!
            </p>
          </div>
        </div>
      </div>

      {/* Turn Structure */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Vanguard ZERO Turn Lifecycle</h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-mono text-amber-400 font-bold">1. Stand & Draw</span>
            <p className="text-slate-400 text-[11px]">All rested cards stand up. Draw 1 card from your deck.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-mono text-amber-400 font-bold">2. Ride Phase</span>
            <p className="text-slate-400 text-[11px]">Ride a card with Grade = current Vanguard Grade + 1 onto your Vanguard circle.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-mono text-amber-400 font-bold">3. Main Phase</span>
            <p className="text-slate-400 text-[11px]">Call Rear-guards from hand. Activate Counter Blast and soul skills.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-mono text-amber-400 font-bold">4. Battle Phase</span>
            <p className="text-slate-400 text-[11px]">Attack opponent Interceptors or exposed Vanguard. Execute Twin Drive checks!</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-mono text-amber-400 font-bold">5. End Phase</span>
            <p className="text-slate-400 text-[11px]">Temporary power boosts expire. Turn passes to opponent.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
