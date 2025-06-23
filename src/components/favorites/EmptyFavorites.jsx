import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils/index.js";
import { Heart, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyFavorites() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <div className="bg-white/60 border border-slate-200/60 shadow-xl max-w-2xl mx-auto rounded-2xl">
        <div className="text-center py-16 px-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.5, type: "spring" }} className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-500" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Nenhuma partida favorita</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">Você ainda não salvou nenhuma partida como favorita.<br /> Explore o dashboard e adicione suas partidas preferidas!</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Link to={createPageUrl("Dashboard")}>
              <button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group rounded-lg flex items-center gap-3">
                <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Ver Partidas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}