import React from 'react';
import { Trophy, Heart, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}>
    <div className="bg-white/60 border border-slate-200/60 hover:shadow-xl transition-all duration-300 overflow-hidden group p-6 rounded-2xl">
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${gradient} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-slate-700" />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function StatsCards({ matches, favorites, todayMatches, isLoading }) {
  if (isLoading) {
    // Grid responsivo para o skeleton loader
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white/60 border border-slate-200/60 p-6 rounded-2xl">
            <div className="h-4 w-24 mb-4 bg-slate-200 animate-pulse rounded"></div>
            <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    // Grid com 2 colunas por padrão (mobile) e 4 colunas em telas grandes (lg)
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <StatCard title="Total de Partidas" value={matches.length} icon={Trophy} gradient="bg-blue-500" delay={0} />
      <StatCard title="Favoritas" value={favorites.length} icon={Heart} gradient="bg-red-500" delay={0.1} />
      <StatCard title="Hoje" value={todayMatches.length} icon={Calendar} gradient="bg-emerald-500" delay={0.2} />
      <StatCard title="Ao Vivo" value={matches.filter(m => m.status === 'live').length} icon={Zap} gradient="bg-orange-500" delay={0.3} />
    </div>
  );
}