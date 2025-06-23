// src/pages/SourceCode.jsx (versão corrigida e mais limpa)
import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/index.js";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth.js"; // Importa o hook

export default function SourceCode() {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Usa o hook para pegar o usuário real

  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Se terminou de carregar e o usuário não é admin, redireciona
  if (!user || user.role !== 'admin') {
    navigate(createPageUrl("Dashboard"));
    return null; // Retorna null para não renderizar nada enquanto redireciona
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 border rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Código Fonte</h1>
            <p className="text-slate-600 text-lg mt-1">Esta página é um placeholder para a visualização do código.</p>
          </div>
        </motion.div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Visualização de Código</h2>
            <p>O código fonte completo do projeto estaria disponível para download aqui.</p>
        </div>
      </div>
    </div>
  );
}