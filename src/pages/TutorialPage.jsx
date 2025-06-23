import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, User, Heart, Search, Image as ImageIcon, Twitter } from 'lucide-react';

// Componente para cada passo do tutorial
const TutorialStep = ({ icon, title, children, delay }) => (
  <motion.div 
    className="flex items-start gap-6"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
      {React.createElement(icon, { className: "w-6 h-6" })}
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <div className="text-slate-600 space-y-2">
        {children}
      </div>
    </div>
  </motion.div>
);

export default function TutorialPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Bem-vindo ao MatchTracker!</h1>
        <p className="text-slate-600 text-lg">Aqui está um guia rápido para aproveitar ao máximo o nosso site.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <div className="space-y-12">
          <TutorialStep icon={User} title="1. Personalize seu Perfil" delay={0.1}>
            <p>Comece indo para a página <Link to="/profile" className="text-blue-600 font-semibold hover:underline">Meu Perfil</Link>. Lá você pode adicionar seu nome e seu time do coração. Isso ajudará a personalizar sua experiência no futuro!</p>
          </TutorialStep>

          <TutorialStep icon={Search} title="2. Explore as Partidas" delay={0.2}>
            <p>A página <Link to="/all-matches" className="text-blue-600 font-semibold hover:underline">Todas as Partidas</Link> é onde a mágica acontece. Use a barra de busca para encontrar jogos pelo nome do time ou filtre por campeonato para achar exatamente o que você procura.</p>
          </TutorialStep>
          
          <TutorialStep icon={Heart} title="3. Salve suas Partidas Favoritas" delay={0.3}>
            <p>Viu um jogo que não quer perder? Clique no ícone de coração (❤️) em qualquer card de partida. Ele será salvo na sua lista pessoal, que você pode acessar a qualquer momento na página <Link to="/favorites" className="text-blue-600 font-semibold hover:underline">Minhas Partidas</Link>.</p>
          </TutorialStep>

          <TutorialStep icon={ImageIcon} title="4. Crie Imagens Incríveis" delay={0.4}>
            <p>Clique em qualquer card de partida para ver a **Página de Detalhes**. Nela, você encontrará um botão para **"Gerar Imagem"**. Com um clique, você pode baixar um card personalizado e com um design incrível para postar onde quiser.</p>
          </TutorialStep>

          <TutorialStep icon={Twitter} title="5. Compartilhe com um Clique" delay={0.5}>
            <p>Na mesma Página de Detalhes, use o botão **"Compartilhar no Twitter"**. Nós vamos gerar a imagem, copiá-la para sua área de transferência e abrir o Twitter com um texto pronto. É só colar a imagem (Ctrl+V) e postar!</p>
          </TutorialStep>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center">
          <h3 className="text-2xl font-bold text-slate-800">Pronto para começar?</h3>
          <p className="text-slate-600 mt-2 mb-6">Explore o site e nunca mais perca um jogo importante.</p>
          <Link to="/">
            <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Ir para o Dashboard
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}