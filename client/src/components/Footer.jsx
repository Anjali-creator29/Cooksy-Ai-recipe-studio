import React from 'react';
import { Flame, Heart, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#060911] text-slate-400 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-slate-200 font-semibold text-sm">Cooksy AI Recipe Studio</p>
            <p className="text-xs text-slate-500">Personalized Recipes • JWT Auth • Bookmarking Vault</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Node Single-Service Active
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> JWT Protected
          </span>
        </div>

        <p className="text-xs text-slate-500 text-center md:text-right">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for culinary explorers. © {new Date().getFullYear()} Cooksy.
        </p>
      </div>
    </footer>
  );
}
